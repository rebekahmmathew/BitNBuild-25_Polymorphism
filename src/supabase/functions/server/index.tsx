import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', logger(console.log));
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Initialize Supabase client with service role for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// User registration endpoint
app.post('/make-server-d7962973/signup', async (c) => {
  try {
    const { email, password, role, businessName, phone } = await c.req.json();

    // Validate required fields
    if (!email || !password || !role || !phone) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Validate role
    if (!['vendor', 'delivery_staff'].includes(role)) {
      return c.json({ error: 'Invalid role' }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      user_metadata: { 
        role: role,
        businessName: businessName || null,
        phone: phone,
        name: businessName || email.split('@')[0]
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Supabase auth error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user data in KV store
    const userData = {
      id: data.user.id,
      email: email,
      role: role,
      businessName: businessName || null,
      phone: phone,
      createdAt: new Date().toISOString(),
      status: 'active'
    };

    await kv.set(`user:${data.user.id}`, JSON.stringify(userData));

    // Create role-specific data
    if (role === 'vendor') {
      const vendorData = {
        userId: data.user.id,
        businessName: businessName,
        totalRevenue: 0,
        totalSubscribers: 0,
        activeOrders: 0,
        averageRating: 0,
        createdAt: new Date().toISOString()
      };
      await kv.set(`vendor:${data.user.id}`, JSON.stringify(vendorData));
    } else if (role === 'delivery_staff') {
      const deliveryStaffData = {
        userId: data.user.id,
        totalDeliveries: 0,
        todayDeliveries: 0,
        averageRating: 0,
        status: 'off_duty',
        assignedAreas: [],
        createdAt: new Date().toISOString()
      };
      await kv.set(`delivery_staff:${data.user.id}`, JSON.stringify(deliveryStaffData));
    }

    return c.json({ 
      message: 'User created successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        role: role
      }
    });

  } catch (error) {
    console.log('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Get user profile
app.get('/make-server-d7962973/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Invalid access token' }, 401);
    }

    // Get additional user data from KV store
    const userData = await kv.get(`user:${user.id}`);
    const parsedUserData = userData ? JSON.parse(userData) : null;

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.user_metadata?.role,
        ...parsedUserData
      }
    });

  } catch (error) {
    console.log('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Get vendor dashboard data
app.get('/make-server-d7962973/vendor/dashboard', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user || user.user_metadata?.role !== 'vendor') {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get vendor data from KV store
    const vendorData = await kv.get(`vendor:${user.id}`);
    const parsedVendorData = vendorData ? JSON.parse(vendorData) : {
      totalRevenue: 125000,
      totalSubscribers: 347,
      activeOrders: 89,
      averageRating: 4.7
    };

    return c.json({ data: parsedVendorData });

  } catch (error) {
    console.log('Vendor dashboard error:', error);
    return c.json({ error: 'Failed to fetch dashboard data' }, 500);
  }
});

// Get delivery staff data
app.get('/make-server-d7962973/delivery/dashboard', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user || user.user_metadata?.role !== 'delivery_staff') {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get delivery staff data from KV store
    const deliveryData = await kv.get(`delivery_staff:${user.id}`);
    const parsedDeliveryData = deliveryData ? JSON.parse(deliveryData) : {
      totalDeliveries: 0,
      todayDeliveries: 0,
      averageRating: 0,
      status: 'off_duty',
      assignedAreas: []
    };

    return c.json({ data: parsedDeliveryData });

  } catch (error) {
    console.log('Delivery dashboard error:', error);
    return c.json({ error: 'Failed to fetch dashboard data' }, 500);
  }
});

// Update delivery staff status
app.put('/make-server-d7962973/delivery/status', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user || user.user_metadata?.role !== 'delivery_staff') {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { status } = await c.req.json();

    if (!['on_duty', 'off_duty', 'out_for_delivery'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    // Get current delivery staff data
    const deliveryData = await kv.get(`delivery_staff:${user.id}`);
    const parsedData = deliveryData ? JSON.parse(deliveryData) : {};

    // Update status
    const updatedData = {
      ...parsedData,
      status: status,
      lastStatusUpdate: new Date().toISOString()
    };

    await kv.set(`delivery_staff:${user.id}`, JSON.stringify(updatedData));

    return c.json({ 
      message: 'Status updated successfully',
      status: status
    });

  } catch (error) {
    console.log('Status update error:', error);
    return c.json({ error: 'Failed to update status' }, 500);
  }
});

// Save menu data
app.post('/make-server-d7962973/vendor/menu', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user || user.user_metadata?.role !== 'vendor') {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const menuData = await c.req.json();

    // Save menu data to KV store
    await kv.set(`vendor_menu:${user.id}`, JSON.stringify({
      ...menuData,
      updatedAt: new Date().toISOString()
    }));

    return c.json({ message: 'Menu saved successfully' });

  } catch (error) {
    console.log('Menu save error:', error);
    return c.json({ error: 'Failed to save menu' }, 500);
  }
});

// Get menu data
app.get('/make-server-d7962973/vendor/menu', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user || user.user_metadata?.role !== 'vendor') {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const menuData = await kv.get(`vendor_menu:${user.id}`);
    const parsedMenuData = menuData ? JSON.parse(menuData) : null;

    return c.json({ data: parsedMenuData });

  } catch (error) {
    console.log('Menu fetch error:', error);
    return c.json({ error: 'Failed to fetch menu' }, 500);
  }
});

// Health check endpoint
app.get('/make-server-d7962973/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Default route
app.get('/make-server-d7962973/', (c) => {
  return c.json({ 
    message: 'NourishNet API Server',
    version: '1.0.0',
    endpoints: [
      'POST /signup - User registration',
      'GET /profile - Get user profile', 
      'GET /vendor/dashboard - Vendor dashboard data',
      'GET /delivery/dashboard - Delivery staff dashboard data',
      'PUT /delivery/status - Update delivery status',
      'POST /vendor/menu - Save menu data',
      'GET /vendor/menu - Get menu data',
      'GET /health - Health check'
    ]
  });
});

Deno.serve(app.fetch);