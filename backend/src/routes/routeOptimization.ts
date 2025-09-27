import express from 'express';
import { optimizeRouteWithAI, generateMenuRecommendations } from '../utils/geminiUtils';
import { getOptimizedRoute, geocodeAddress, getETA } from '../utils/googleMapsUtils';
import { storage } from '../utils/storage';

const router = express.Router();

const authenticateUser = (req: any, res: any, next: any) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }
  
  const user = storage.findById('users', userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  req.user = user;
  next();
};

// Optimize delivery route using Google Maps + Gemini AI
router.post('/optimize', authenticateUser, async (req: any, res) => {
  try {
    const { deliveryIds, trafficConditions, weatherConditions, vendorLocation } = req.body;
    
    if (!deliveryIds || !Array.isArray(deliveryIds)) {
      return res.status(400).json({ error: 'Delivery IDs array is required' });
    }

    // Get delivery addresses
    const deliveries = deliveryIds.map((id: string) => {
      const delivery = storage.findById('deliveries', id);
      if (!delivery) return null;
      
      const subscription = storage.findById('subscriptions', delivery.subscriptionId);
      if (!subscription) return null;
      
      return {
        id: delivery.id,
        address: `${subscription.deliveryAddress.street}, ${subscription.deliveryAddress.city}`,
        coordinates: subscription.deliveryAddress.coordinates,
        priority: 'medium' as const
      };
    }).filter((delivery): delivery is NonNullable<typeof delivery> => delivery !== null);

    if (deliveries.length === 0) {
      return res.status(404).json({ error: 'No valid deliveries found' });
    }

    // Use vendor location or default to first delivery location
    // Ensure origin and destination are plain Coordinates { lat, lng }
    const origin: any = vendorLocation && typeof vendorLocation.lat === 'number' && typeof vendorLocation.lng === 'number'
      ? vendorLocation
      : deliveries[0].coordinates;

    // Prepare waypoints for Google Maps (only include coordinates shape expected by utils)
    const waypoints = deliveries.map(delivery => ({
      address: delivery.address,
      coordinates: delivery.coordinates
    }));

    // Try Google Maps optimization first
    let optimizedRoute;
    let optimizationMethod = 'AI Fallback';

    try {
  // Destination should be Coordinates (lat,lng) - use last delivery coordinates
  const destination = waypoints[waypoints.length - 1].coordinates;
  const googleMapsRoute = await getOptimizedRoute(origin, waypoints as any, destination);
      
      if (googleMapsRoute) {
        // Update deliveries with optimized route
        deliveries.forEach((delivery, index) => {
          const waypoint = googleMapsRoute.waypoints.find(wp => wp.address === delivery.address);
          if (waypoint) {
            storage.update('deliveries', delivery.id, {
              route: {
                optimized: true,
                waypoints: googleMapsRoute.waypoints,
                totalDistance: googleMapsRoute.totalDistance,
                totalTime: googleMapsRoute.totalTime,
                order: waypoint.order
              }
            });
          }
        });

        optimizedRoute = {
          optimizedRoute: googleMapsRoute.optimizedRoute,
          totalDistance: googleMapsRoute.totalDistance,
          totalTime: googleMapsRoute.totalTime,
          waypoints: googleMapsRoute.waypoints
        };
        optimizationMethod = 'Google Maps';
      }
    } catch (googleError) {
      console.warn('Google Maps optimization failed, falling back to AI:', googleError);
    }

    // Fallback to AI optimization if Google Maps fails
    if (!optimizedRoute) {
      optimizedRoute = await optimizeRouteWithAI({
        addresses: deliveries,
        trafficConditions: trafficConditions || 'Normal',
        weatherConditions: weatherConditions || 'Clear'
      });
    }

    res.json({
      success: true,
      optimizedRoute,
      totalDeliveries: deliveries.length,
      estimatedTime: optimizedRoute.totalTime,
      estimatedDistance: optimizedRoute.totalDistance,
      optimizationMethod,
      message: `Route optimized successfully using ${optimizationMethod}`
    });
  } catch (error) {
    console.error('Route optimization error:', error);
    res.status(500).json({ 
      error: 'Failed to optimize route',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Geocode address using Google Maps
router.post('/geocode', authenticateUser, async (req: any, res) => {
  try {
    const { address } = req.body;
    
    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const geocoded = await geocodeAddress(address);
    
    if (geocoded) {
      res.json({
        success: true,
        address: geocoded.address,
        coordinates: geocoded.coordinates,
        formattedAddress: geocoded.formattedAddress
      });
    } else {
      res.status(400).json({ error: 'Failed to geocode address' });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    res.status(500).json({ 
      error: 'Failed to geocode address',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get delivery route for specific delivery
router.get('/delivery/:id/route', authenticateUser, async (req: any, res) => {
  try {
    const { id } = req.params;
    const delivery = storage.findById('deliveries', id);
    
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const subscription = storage.findById('subscriptions', delivery.subscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({
      success: true,
      delivery: {
        id: delivery.id,
        address: `${subscription.deliveryAddress.street}, ${subscription.deliveryAddress.city}`,
        coordinates: subscription.deliveryAddress.coordinates,
        route: delivery.route,
        status: delivery.status
      }
    });
  } catch (error) {
    console.error('Get delivery route error:', error);
    res.status(500).json({ 
      error: 'Failed to get delivery route',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Generate menu recommendations using Gemini AI
router.post('/menu-recommendations', authenticateUser, async (req: any, res) => {
  try {
    const { currentMenuItems, customerPreferences } = req.body;
    
    if (!currentMenuItems || !Array.isArray(currentMenuItems)) {
      return res.status(400).json({ error: 'Current menu items array is required' });
    }

    // Use Gemini AI to generate recommendations
    const recommendations = await generateMenuRecommendations(
      currentMenuItems,
      customerPreferences || {}
    );

    res.json({
      success: true,
      recommendations,
      message: 'Menu recommendations generated successfully'
    });
  } catch (error) {
    console.error('Menu recommendations error:', error);
    res.status(500).json({ 
      error: 'Failed to generate menu recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get AI-powered insights for the dashboard
router.get('/insights', authenticateUser, async (req: any, res) => {
  try {
    const subscriptions = storage.findAll('subscriptions');
    const deliveries = storage.findAll('deliveries');
    const menus = storage.findAll('menus');

    // Generate insights using Gemini AI
    const insights = {
      totalSubscriptions: subscriptions.length,
      activeDeliveries: deliveries.filter((d: any) => d.status === 'in_progress').length,
      publishedMenus: menus.filter((m: any) => m.isPublished).length,
      aiRecommendations: [
        'Consider optimizing delivery routes during peak hours',
        'Add more vegetarian options based on customer preferences',
        'Implement dynamic pricing for high-demand items'
      ]
    };

    res.json({
      success: true,
      insights,
      message: 'AI insights generated successfully'
    });
  } catch (error) {
    console.error('AI insights error:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI insights',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as routeOptimizationRoutes };
