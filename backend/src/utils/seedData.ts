import { storage } from './storage';

// Seed the database with demo data
export const seedDemoData = () => {
  console.log('Seeding demo data...');

  // Create demo users
  const vendor = storage.create('users', {
    email: 'vendor@nourishnet.com',
    name: 'Demo Vendor',
    role: 'vendor',
    phone: '+91 98765 43210',
    address: {
      street: '123 Vendor Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    isActive: true
  });

  const consumer = storage.create('users', {
    email: 'consumer@nourishnet.com',
    name: 'Demo Consumer',
    role: 'consumer',
    phone: '+91 98765 43211',
    address: {
      street: '456 Consumer Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    preferences: {
      veg: true,
      spiceLevel: 'medium',
      allergies: [],
      dietaryRestrictions: []
    },
    isActive: true
  });

  // Create demo subscriptions
  const subscription1 = storage.create('subscriptions', {
    userId: consumer.id,
    planType: 'weekly',
    status: 'active',
    price: 500,
    deliveryAddress: {
      street: '456 Consumer Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      coordinates: { lat: 19.0760, lng: 72.8777 }
    },
    deliveryTime: '12:00-13:00',
    preferences: {
      veg: true,
      spiceLevel: 'medium',
      allergies: [],
      dietaryRestrictions: []
    },
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  // Create demo staff
  const staff1 = storage.create('staff', {
    name: 'Rajesh Kumar',
    email: 'rajesh@nourishnet.com',
    phone: '+91 98765 43212',
    employeeId: 'EMP001',
    role: 'delivery',
    isActive: true,
    currentLocation: {
      lat: 19.0760,
      lng: 72.8777,
      timestamp: new Date().toISOString()
    },
    assignedDeliveries: [],
    performance: {
      totalDeliveries: 25,
      onTimeDeliveries: 23,
      rating: 4.8,
      lastActive: new Date().toISOString()
    }
  });

  // Create demo menu
  const menu1 = storage.create('menus', {
    vendorId: vendor.id,
    date: new Date().toISOString(),
    type: 'daily',
    items: [
      {
        name: 'Dal Rice',
        description: 'Fresh dal with basmati rice',
        price: 80,
        category: 'main',
        isVeg: true,
        allergens: [],
        nutritionalInfo: {
          calories: 350,
          protein: 12,
          carbs: 45,
          fat: 8
        }
      },
      {
        name: 'Chicken Curry',
        description: 'Spicy chicken curry with roti',
        price: 120,
        category: 'main',
        isVeg: false,
        allergens: [],
        nutritionalInfo: {
          calories: 420,
          protein: 25,
          carbs: 30,
          fat: 15
        }
      },
      {
        name: 'Vegetable Sabzi',
        description: 'Mixed vegetables with spices',
        price: 60,
        category: 'side',
        isVeg: true,
        allergens: [],
        nutritionalInfo: {
          calories: 180,
          protein: 6,
          carbs: 20,
          fat: 5
        }
      }
    ],
    isPublished: true,
    publishedAt: new Date().toISOString(),
    fssaiLicense: 'FSSAI123456789'
  });

  // Create demo delivery
  const delivery1 = storage.create('deliveries', {
    subscriptionId: subscription1.id,
    staffId: staff1.id,
    date: new Date().toISOString(),
    status: 'scheduled',
    route: {
      optimized: false,
      waypoints: [{
        address: '456 Consumer Street, Mumbai',
        coordinates: { lat: 19.0760, lng: 72.8777 },
        order: 1,
        estimatedTime: 15
      }],
      totalDistance: 2.5,
      totalTime: 15
    },
    tracking: {
      currentLocation: null,
      estimatedArrival: null,
      actualDeliveryTime: null,
      notes: null
    },
    payment: {
      amount: 500,
      method: 'cash',
      status: 'pending'
    }
  });

  console.log('Demo data seeded successfully!');
  console.log('Vendor ID:', vendor.id);
  console.log('Consumer ID:', consumer.id);
  console.log('Subscription ID:', subscription1.id);
  console.log('Staff ID:', staff1.id);
  console.log('Menu ID:', menu1.id);
  console.log('Delivery ID:', delivery1.id);
};
