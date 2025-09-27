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

// Get user subscriptions
router.get('/', authenticateUser, async (req: any, res) => {
  try {
    const subscriptions = storage.findSubscriptionsByUser(req.user.id);
    res.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ error: 'Failed to get subscriptions' });
  }
});

// Create new subscription
router.post('/', authenticateUser, async (req: any, res) => {
  try {
    const schema = Joi.object({
      planType: Joi.string().valid('daily', 'weekly', 'monthly').required(),
      price: Joi.number().positive().required(),
      deliveryAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().required(),
        coordinates: Joi.object({
          lat: Joi.number().required(),
          lng: Joi.number().required()
        }).required()
      }).required(),
      deliveryTime: Joi.string().required(),
      preferences: Joi.object({
        veg: Joi.boolean().default(true),
        spiceLevel: Joi.string().valid('mild', 'medium', 'hot').default('medium'),
        allergies: Joi.array().items(Joi.string()).default([]),
        dietaryRestrictions: Joi.array().items(Joi.string()).default([])
      }).optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date();
    
    switch (value.planType) {
      case 'daily':
        endDate.setDate(startDate.getDate() + 1);
        break;
      case 'weekly':
        endDate.setDate(startDate.getDate() + 7);
        break;
      case 'monthly':
        endDate.setMonth(startDate.getMonth() + 1);
        break;
    }

    const nextBillingDate = new Date(endDate);

    const subscription = storage.create('subscriptions', {
      ...value,
      userId: req.user.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      status: 'active'
    });

    res.status(201).json({ subscription });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Update subscription
router.put('/:id', authenticateUser, async (req: any, res) => {
  try {
    const schema = Joi.object({
      status: Joi.string().valid('active', 'paused', 'cancelled').optional(),
      preferences: Joi.object({
        veg: Joi.boolean().optional(),
        spiceLevel: Joi.string().valid('mild', 'medium', 'hot').optional(),
        allergies: Joi.array().items(Joi.string()).optional(),
        dietaryRestrictions: Joi.array().items(Joi.string()).optional()
      }).optional(),
      deliveryTime: Joi.string().optional(),
      deliveryAddress: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().required(),
        coordinates: Joi.object({
          lat: Joi.number().required(),
          lng: Joi.number().required()
        }).required()
      }).optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const subscription = storage.update('subscriptions', req.params.id, value);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ subscription });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Pause subscription
router.post('/:id/pause', authenticateUser, async (req: any, res) => {
  try {
    const { pauseStartDate, pauseEndDate } = req.body;
    
    const subscription = storage.update('subscriptions', req.params.id, {
      status: 'paused',
      pauseStartDate: pauseStartDate ? new Date(pauseStartDate).toISOString() : null,
      pauseEndDate: pauseEndDate ? new Date(pauseEndDate).toISOString() : null
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ subscription });
  } catch (error) {
    console.error('Pause subscription error:', error);
    res.status(500).json({ error: 'Failed to pause subscription' });
  }
});

// Resume subscription
router.post('/:id/resume', authenticateUser, async (req: any, res) => {
  try {
    const subscription = storage.update('subscriptions', req.params.id, {
      status: 'active',
      pauseStartDate: null,
      pauseEndDate: null
    });

    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    res.json({ subscription });
  } catch (error) {
    console.error('Resume subscription error:', error);
    res.status(500).json({ error: 'Failed to resume subscription' });
  }
});

export { router as subscriptionRoutes };