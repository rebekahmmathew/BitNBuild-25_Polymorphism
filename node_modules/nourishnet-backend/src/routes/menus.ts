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

// Get all menus
router.get('/', authenticateUser, async (req: any, res) => {
  try {
    const { date, type, isPublished } = req.query;
    let menus = storage.findAll('menus');
    
    if (date) {
      menus = menus.filter((menu: any) => menu.date === date);
    }
    if (type) {
      menus = menus.filter((menu: any) => menu.type === type);
    }
    if (isPublished !== undefined) {
      menus = menus.filter((menu: any) => menu.isPublished === (isPublished === 'true'));
    }
    
    res.json({ menus });
  } catch (error) {
    console.error('Get menus error:', error);
    res.status(500).json({ error: 'Failed to get menus' });
  }
});

// Create new menu
router.post('/', authenticateUser, async (req: any, res) => {
  try {
    const schema = Joi.object({
      date: Joi.date().required(),
      type: Joi.string().valid('daily', 'weekly').required(),
      items: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().positive().required(),
        category: Joi.string().valid('main', 'side', 'dessert', 'beverage').required(),
        isVeg: Joi.boolean().required(),
        allergens: Joi.array().items(Joi.string()).default([]),
        nutritionalInfo: Joi.object({
          calories: Joi.number().optional(),
          protein: Joi.number().optional(),
          carbs: Joi.number().optional(),
          fat: Joi.number().optional()
        }).optional()
      })).min(1).required(),
      fssaiLicense: Joi.string().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const menu = storage.create('menus', {
      ...value,
      vendorId: req.user.id,
      isPublished: false
    });

    res.status(201).json({ menu });
  } catch (error) {
    console.error('Create menu error:', error);
    res.status(500).json({ error: 'Failed to create menu' });
  }
});

// Update menu
router.put('/:id', authenticateUser, async (req: any, res) => {
  try {
    const schema = Joi.object({
      items: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().positive().required(),
        category: Joi.string().valid('main', 'side', 'dessert', 'beverage').required(),
        isVeg: Joi.boolean().required(),
        allergens: Joi.array().items(Joi.string()).default([]),
        nutritionalInfo: Joi.object({
          calories: Joi.number().optional(),
          protein: Joi.number().optional(),
          carbs: Joi.number().optional(),
          fat: Joi.number().optional()
        }).optional()
      })).min(1).optional(),
      isPublished: Joi.boolean().optional()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updateData: any = { ...value };
    if (value.isPublished) {
      updateData.publishedAt = new Date().toISOString();
    }

    const menu = storage.update('menus', req.params.id, updateData);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    res.json({ menu });
  } catch (error) {
    console.error('Update menu error:', error);
    res.status(500).json({ error: 'Failed to update menu' });
  }
});

// Publish menu
router.post('/:id/publish', authenticateUser, async (req: any, res) => {
  try {
    const menu = storage.update('menus', req.params.id, {
      isPublished: true,
      publishedAt: new Date().toISOString()
    });

    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }

    res.json({ menu });
  } catch (error) {
    console.error('Publish menu error:', error);
    res.status(500).json({ error: 'Failed to publish menu' });
  }
});

// Get published menus (for consumers)
router.get('/published', async (req, res) => {
  try {
    const { date, type } = req.query;
    let menus = storage.findAll('menus', (menu: any) => menu.isPublished);
    
    if (date) {
      menus = menus.filter((menu: any) => menu.date === date);
    }
    if (type) {
      menus = menus.filter((menu: any) => menu.type === type);
    }
    
    res.json({ menus });
  } catch (error) {
    console.error('Get published menus error:', error);
    res.status(500).json({ error: 'Failed to get published menus' });
  }
});

export { router as menuRoutes };