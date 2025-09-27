import express from 'express';
import { optimizeRouteWithAI, generateMenuRecommendations } from '../utils/geminiUtils';

const router = express.Router();

// Test Gemini AI integration
router.get('/test', async (req, res) => {
  try {
    console.log('Testing Gemini AI integration...');
    
    // Test route optimization
    const testAddresses = [
      {
        address: '123 Main Street, Mumbai',
        coordinates: { lat: 19.0760, lng: 72.8777 },
        priority: 'high' as const
      },
      {
        address: '456 Park Avenue, Mumbai',
        coordinates: { lat: 19.0760, lng: 72.8777 },
        priority: 'medium' as const
      },
      {
        address: '789 Business District, Mumbai',
        coordinates: { lat: 19.0760, lng: 72.8777 },
        priority: 'low' as const
      }
    ];

    const optimizedRoute = await optimizeRouteWithAI({
      addresses: testAddresses,
      trafficConditions: 'Heavy',
      weatherConditions: 'Clear'
    });

    // Test menu recommendations
    const menuItems = ['Dal Rice', 'Chicken Curry', 'Vegetable Sabzi'];
    const preferences = { veg: true, spiceLevel: 'medium' };
    
    const recommendations = await generateMenuRecommendations(menuItems, preferences);

    res.json({
      success: true,
      message: 'Gemini AI integration working successfully!',
      routeOptimization: {
        totalDistance: optimizedRoute.totalDistance,
        totalTime: optimizedRoute.totalTime,
        efficiency: optimizedRoute.efficiency,
        recommendations: optimizedRoute.recommendations
      },
      menuRecommendations: recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini AI test error:', error);
    res.status(500).json({
      success: false,
      error: 'Gemini AI test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export { router as testGeminiRoutes };
