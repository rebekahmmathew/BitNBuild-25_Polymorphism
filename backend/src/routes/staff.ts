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

// Get all staff
router.get('/', authenticateUser, async (req: any, res) => {
  try {
    const { role, isActive } = req.query;
    let staff = storage.findAll('staff');
    
    if (role) {
      staff = staff.filter((member: any) => member.role === role);
    }
    if (isActive !== undefined) {
      staff = staff.filter((member: any) => member.isActive === (isActive === 'true'));
    }
    
    res.json({ staff });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ error: 'Failed to get staff' });
  }
});

// Create staff member
router.post('/', authenticateUser, async (req: any, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      employeeId: Joi.string().required(),
      role: Joi.string().valid('delivery', 'kitchen', 'manager').required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const staff = storage.create('staff', {
      ...value,
      isActive: true,
      currentLocation: null,
      assignedDeliveries: [],
      performance: {
        totalDeliveries: 0,
        onTimeDeliveries: 0,
        rating: 0,
        lastActive: new Date().toISOString()
      }
    });

    res.status(201).json({ staff });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ error: 'Failed to create staff member' });
  }
});

// Update staff member
router.put('/:id', authenticateUser, async (req: any, res) => {
  try {
    const schema = Joi.object({
      name: Joi.string().optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string().optional(),
      role: Joi.string().valid('delivery', 'kitchen', 'manager').optional(),
      isActive: Joi.boolean().optional(),
      currentLocation: Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required()
      }).optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updateData: any = { ...value };
    if (value.currentLocation) {
      updateData.currentLocation = {
        ...value.currentLocation,
        timestamp: new Date().toISOString()
      };
    }

    const staff = storage.update('staff', req.params.id, updateData);
    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json({ staff });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ error: 'Failed to update staff member' });
  }
});

// Update staff location (for delivery tracking)
router.put('/:id/location', authenticateUser, async (req: any, res) => {
  try {
    const schema = Joi.object({
      lat: Joi.number().required(),
      lng: Joi.number().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const staff = storage.update('staff', req.params.id, {
      currentLocation: {
        lat: value.lat,
        lng: value.lng,
        timestamp: new Date().toISOString()
      },
      'performance.lastActive': new Date().toISOString()
    });

    if (!staff) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    res.json({ staff });
  } catch (error) {
    console.error('Update staff location error:', error);
    res.status(500).json({ error: 'Failed to update staff location' });
  }
});

export { router as staffRoutes };