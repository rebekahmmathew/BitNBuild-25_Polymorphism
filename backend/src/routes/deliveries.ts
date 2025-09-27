import express from 'express';
import { storage } from '../utils/storage';
import Joi from 'joi';

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

// Get all deliveries
router.get('/', authenticateUser, async (req: any, res) => {
  try {
    const { date, status, staffId } = req.query;
    let deliveries = storage.findAll('deliveries');
    
    if (date) {
      deliveries = deliveries.filter((delivery: any) => delivery.date === date);
    }
    if (status) {
      deliveries = deliveries.filter((delivery: any) => delivery.status === status);
    }
    if (staffId) {
      deliveries = deliveries.filter((delivery: any) => delivery.staffId === staffId);
    }
    
    res.json({ deliveries });
  } catch (error) {
    console.error('Get deliveries error:', error);
    res.status(500).json({ error: 'Failed to get deliveries' });
  }
});

// Create delivery
router.post('/', authenticateUser, async (req: any, res) => {
  try {
    const schema = Joi.object({
      subscriptionId: Joi.string().required(),
      date: Joi.date().required(),
      staffId: Joi.string().optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const subscription = storage.findById('subscriptions', value.subscriptionId);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const delivery = storage.create('deliveries', {
      ...value,
      route: {
        optimized: false,
        waypoints: [{
          address: `${subscription.deliveryAddress.street}, ${subscription.deliveryAddress.city}`,
          coordinates: subscription.deliveryAddress.coordinates,
          order: 1,
          estimatedTime: 15
        }],
        totalDistance: 0,
        totalTime: 15
      },
      tracking: {
        currentLocation: null,
        estimatedArrival: null,
        actualDeliveryTime: null,
        notes: null
      },
      payment: {
        amount: subscription.price,
        method: 'cash',
        status: 'pending'
      },
      status: 'scheduled'
    });

    res.status(201).json({ delivery });
  } catch (error) {
    console.error('Create delivery error:', error);
    res.status(500).json({ error: 'Failed to create delivery' });
  }
});

// Update delivery status
router.put('/:id/status', authenticateUser, async (req: any, res) => {
  try {
    const schema = Joi.object({
      status: Joi.string().valid('scheduled', 'in_progress', 'delivered', 'failed', 'cancelled').required(),
      currentLocation: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required()
      }).optional(),
      notes: Joi.string().optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updateData: any = { status: value.status };
    
    if (value.currentLocation) {
      updateData['tracking.currentLocation'] = {
        ...value.currentLocation,
        timestamp: new Date().toISOString()
      };
    }
    
    if (value.notes) {
      updateData['tracking.notes'] = value.notes;
    }

    if (value.status === 'delivered') {
      updateData['tracking.actualDeliveryTime'] = new Date().toISOString();
    }

    const delivery = storage.update('deliveries', req.params.id, updateData);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    res.json({ delivery });
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});

// Get delivery tracking (for consumers)
router.get('/track/:subscriptionId', authenticateUser, async (req: any, res) => {
  try {
    const deliveries = storage.findAll('deliveries', (delivery: any) => 
      delivery.subscriptionId === req.params.subscriptionId && 
      ['scheduled', 'in_progress'].includes(delivery.status)
    );

    if (deliveries.length === 0) {
      return res.status(404).json({ error: 'No active delivery found' });
    }

    res.json({ delivery: deliveries[0] });
  } catch (error) {
    console.error('Get delivery tracking error:', error);
    res.status(500).json({ error: 'Failed to get delivery tracking' });
  }
});

export { router as deliveryRoutes };