import express from 'express';
import { optimizeRouteWithAI, generateMenuRecommendations } from '../utils/geminiUtils';
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

// Optimize delivery route using Gemini AI
router.post('/optimize', authenticateUser, async (req: any, res) => {
  try {
    const { deliveryIds, trafficConditions, weatherConditions } = req.body;
    
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
        address: `${subscription.deliveryAddress.street}, ${subscription.deliveryAddress.city}`,
        coordinates: subscription.deliveryAddress.coordinates,
        priority: 'medium' as const
      };
    }).filter((delivery): delivery is NonNullable<typeof delivery> => delivery !== null);

    if (deliveries.length === 0) {
      return res.status(404).json({ error: 'No valid deliveries found' });
    }

    // Use Gemini AI to optimize route
    const optimizedRoute = await optimizeRouteWithAI({
      addresses: deliveries,
      trafficConditions: trafficConditions || 'Normal',
      weatherConditions: weatherConditions || 'Clear'
    });

    res.json({
      success: true,
      optimizedRoute,
      message: 'Route optimized successfully using AI'
    });
  } catch (error) {
    console.error('Route optimization error:', error);
    res.status(500).json({ 
      error: 'Failed to optimize route',
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
