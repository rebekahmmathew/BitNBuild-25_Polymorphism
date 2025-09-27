import express from 'express';
import { storage } from '../utils/storage';
import Joi from 'joi';

const router = express.Router();

// Simple auth without JWT - just basic validation
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

// Register/Login user
router.post('/register', async (req, res) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      role: Joi.string().valid('vendor', 'consumer').required(),
      phone: Joi.string().optional(),
      address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().required(),
        coordinates: Joi.object({
          lat: Joi.number().required(),
          lng: Joi.number().required()
        }).optional()
      }).optional(),
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

    // Check if user already exists
    let user = storage.findUserByEmail(value.email);
    if (user) {
      return res.json({ user, isNew: false });
    }

    // Create new user
    user = storage.create('users', value);
    res.status(201).json({ user, isNew: true });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get current user
router.get('/me', authenticateUser, async (req: any, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user profile
router.put('/profile', authenticateUser, async (req: any, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().optional(),
      phone: Joi.string().optional(),
      address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        pincode: Joi.string().required(),
        coordinates: Joi.object({
          lat: Joi.number().required(),
          lng: Joi.number().required()
        }).optional()
      }).optional(),
      preferences: Joi.object({
        veg: Joi.boolean().optional(),
        spiceLevel: Joi.string().valid('mild', 'medium', 'hot').optional(),
        allergies: Joi.array().items(Joi.string()).optional(),
        dietaryRestrictions: Joi.array().items(Joi.string()).optional()
      }).optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = storage.update('users', req.user.id, value);
    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

export { router as authRoutes };