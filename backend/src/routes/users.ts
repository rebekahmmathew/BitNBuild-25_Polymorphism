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

// Get all users (vendors only)
router.get('/', authenticateUser, async (req: any, res) => {
  try {
    const { role, isActive, search } = req.query;
    let users = storage.findAll('users');
    
    if (role) {
      users = users.filter((user: any) => user.role === role);
    }
    if (isActive !== undefined) {
      users = users.filter((user: any) => user.isActive === (isActive === 'true'));
    }
    if (search) {
      users = users.filter((user: any) => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get user by ID
router.get('/:id', authenticateUser, async (req: any, res) => {
  try {
    const user = storage.findById('users', req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user status
router.put('/:id/status', authenticateUser, async (req: any, res) => {
  try {
    const schema = Joi.object({
      isActive: Joi.boolean().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = storage.update('users', req.params.id, { isActive: value.isActive });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

export { router as userRoutes };