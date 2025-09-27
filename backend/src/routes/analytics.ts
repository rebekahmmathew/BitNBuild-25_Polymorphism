import express from 'express';
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

// Get dashboard overview
router.get('/overview', authenticateUser, async (req: any, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const todaySubscriptions = storage.findAll('subscriptions', (sub: any) => 
      sub.createdAt.startsWith(today)
    ).length;
    
    const todayDeliveries = storage.findAll('deliveries', (delivery: any) => 
      delivery.date === today
    ).length;
    
    const activeSubscriptions = storage.findAll('subscriptions', (sub: any) => 
      sub.status === 'active'
    ).length;
    
    const pendingDeliveries = storage.findAll('deliveries', (delivery: any) => 
      ['scheduled', 'in_progress'].includes(delivery.status)
    ).length;

    const totalRevenue = storage.findAll('subscriptions', (sub: any) => 
      sub.status === 'active'
    ).reduce((sum: number, sub: any) => sum + sub.price, 0);

    res.json({
      todaySubscriptions,
      todayDeliveries,
      activeSubscriptions,
      pendingDeliveries,
      totalRevenue
    });
  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({ error: 'Failed to get dashboard overview' });
  }
});

// Get revenue analytics
router.get('/revenue', authenticateUser, async (req: any, res) => {
  try {
    const subscriptions = storage.findAll('subscriptions');
    const revenueData = subscriptions.map((sub: any) => ({
      date: sub.createdAt.split('T')[0],
      totalRevenue: sub.price,
      subscriptionCount: 1
    }));

    res.json({ revenueData });
  } catch (error) {
    console.error('Get revenue analytics error:', error);
    res.status(500).json({ error: 'Failed to get revenue analytics' });
  }
});

// Get subscription analytics
router.get('/subscriptions', authenticateUser, async (req: any, res) => {
  try {
    const subscriptions = storage.findAll('subscriptions');
    
    const subscriptionStats = {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: subscriptions.filter((sub: any) => sub.status === 'active').length,
      pausedSubscriptions: subscriptions.filter((sub: any) => sub.status === 'paused').length,
      cancelledSubscriptions: subscriptions.filter((sub: any) => sub.status === 'cancelled').length,
      averageRevenue: subscriptions.length > 0 ? subscriptions.reduce((sum: number, sub: any) => sum + sub.price, 0) / subscriptions.length : 0,
      totalRevenue: subscriptions.reduce((sum: number, sub: any) => sum + sub.price, 0)
    };

    const planTypeStats = subscriptions.reduce((acc: any, sub: any) => {
      if (!acc[sub.planType]) {
        acc[sub.planType] = { count: 0, revenue: 0 };
      }
      acc[sub.planType].count++;
      acc[sub.planType].revenue += sub.price;
      return acc;
    }, {});

    res.json({ 
      subscriptionStats,
      planTypeStats: Object.entries(planTypeStats).map(([planType, stats]: [string, any]) => ({
        _id: planType,
        count: stats.count,
        revenue: stats.revenue
      }))
    });
  } catch (error) {
    console.error('Get subscription analytics error:', error);
    res.status(500).json({ error: 'Failed to get subscription analytics' });
  }
});

// Get delivery analytics
router.get('/deliveries', authenticateUser, async (req: any, res) => {
  try {
    const deliveries = storage.findAll('deliveries');
    
    const deliveryStats = {
      totalDeliveries: deliveries.length,
      completedDeliveries: deliveries.filter((del: any) => del.status === 'delivered').length,
      failedDeliveries: deliveries.filter((del: any) => del.status === 'failed').length,
      averageDeliveryTime: deliveries.length > 0 ? deliveries.reduce((sum: number, del: any) => sum + (del.route?.totalTime || 0), 0) / deliveries.length : 0,
      totalDistance: deliveries.reduce((sum: number, del: any) => sum + (del.route?.totalDistance || 0), 0)
    };

    const statusBreakdown = deliveries.reduce((acc: any, delivery: any) => {
      if (!acc[delivery.status]) {
        acc[delivery.status] = 0;
      }
      acc[delivery.status]++;
      return acc;
    }, {});

    res.json({ 
      deliveryStats,
      statusBreakdown: Object.entries(statusBreakdown).map(([status, count]: [string, any]) => ({
        _id: status,
        count
      }))
    });
  } catch (error) {
    console.error('Get delivery analytics error:', error);
    res.status(500).json({ error: 'Failed to get delivery analytics' });
  }
});

export { router as analyticsRoutes };