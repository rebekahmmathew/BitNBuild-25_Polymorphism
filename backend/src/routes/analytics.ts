import express from 'express';
import { storage } from '../utils/storage';

const router = express.Router();

const authenticateUser = (req: any, res: any, next: any) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }
  
  // Try to find user by ID first, then by email
  let user = storage.findById('users', userId);
  if (!user) {
    user = storage.findAll('users', (u: any) => u.email === userId)[0];
  }
  
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }
  
  req.user = user;
  next();
};

// Get dashboard overview
router.get('/overview', authenticateUser, async (req: any, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const todaySubscriptions = storage.findAll('subscriptions', (sub: any) => 
      sub.createdAt && sub.createdAt.startsWith(today)
    ).length;
    
    const todayDeliveries = storage.findAll('deliveries', (delivery: any) => 
      delivery.date && delivery.date.startsWith(today)
    ).length;
    
    const activeSubscriptions = storage.findAll('subscriptions', (sub: any) => 
      sub.status === 'active'
    ).length;
    
    const pendingDeliveries = storage.findAll('deliveries', (delivery: any) => 
      ['pending', 'picked_up', 'out_for_delivery'].includes(delivery.status)
    ).length;

    const totalRevenue = storage.findAll('subscriptions', (sub: any) => 
      sub.status === 'active'
    ).reduce((sum: number, sub: any) => sum + (sub.price || 0), 0);

    res.json({
      todaySubscriptions,
      todayDeliveries,
      activeSubscriptions,
      pendingDeliveries,
      totalRevenue
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics overview' });
  }
});

// Get revenue analytics
router.get('/revenue', authenticateUser, async (req: any, res) => {
  try {
    const { groupBy = 'day', days = 7 } = req.query;
    
    // This would need to be implemented in the database manager
    // For now, return mock data
    const revenueData = [
      { date: '2024-11-20', totalRevenue: 1200, subscriptionCount: 5 },
      { date: '2024-11-21', totalRevenue: 1500, subscriptionCount: 6 },
      { date: '2024-11-22', totalRevenue: 1800, subscriptionCount: 7 },
      { date: '2024-11-23', totalRevenue: 2000, subscriptionCount: 8 },
      { date: '2024-11-24', totalRevenue: 2200, subscriptionCount: 9 },
      { date: '2024-11-25', totalRevenue: 2400, subscriptionCount: 10 },
      { date: '2024-11-26', totalRevenue: 2600, subscriptionCount: 11 }
    ];

    res.json({ revenueData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue analytics' });
  }
});

// Get subscription analytics
router.get('/subscriptions', authenticateUser, async (req: any, res) => {
  try {
    const { days = 30 } = req.query;
    
    // Get subscription breakdown by plan type
    const planTypeStats = [
      { _id: 'daily', count: 5 },
      { _id: 'weekly', count: 8 },
      { _id: 'monthly', count: 7 }
    ];

    res.json({ planTypeStats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription analytics' });
  }
});

// Get menu performance
router.get('/menu-performance', authenticateUser, async (req: any, res) => {
  try {
    const menuPerformance = {
      averageRating: 4.5,
      topMenus: [
        { menuName: 'Dal Rice', orderCount: 15 },
        { menuName: 'Chicken Curry', orderCount: 12 },
        { menuName: 'Vegetable Sabzi', orderCount: 10 }
      ]
    };

    res.json(menuPerformance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu performance' });
  }
});

// Get delivery performance
router.get('/delivery-performance', authenticateUser, async (req: any, res) => {
  try {
    const deliveryPerformance = {
      averageDeliveryTime: 25,
      statusDistribution: [
        { _id: 'delivered', count: 45 },
        { _id: 'out_for_delivery', count: 5 },
        { _id: 'pending', count: 3 }
      ]
    };

    res.json(deliveryPerformance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch delivery performance' });
  }
});

export { router as analyticsRoutes };