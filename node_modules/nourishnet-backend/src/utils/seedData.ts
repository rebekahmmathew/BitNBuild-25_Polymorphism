import { storage } from './storage';

// Seed the database with demo data
export const seedDemoData = () => {
  console.log('Seeding comprehensive demo data...');
  
  // Clear existing data
  storage.clearAll();

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

  // Create additional vendors
  const vendor2 = storage.create('users', {
    email: 'vendor2@nourishnet.com',
    name: 'Spice Kitchen',
    role: 'vendor',
    phone: '+91 98765 43213',
    address: {
      street: '789 Spice Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400003',
      coordinates: { lat: 19.0780, lng: 72.8797 }
    },
    isActive: true
  });

  // Create additional consumers
  const consumer2 = storage.create('users', {
    email: 'consumer2@nourishnet.com',
    name: 'Priya Sharma',
    role: 'consumer',
    phone: '+91 98765 43214',
    address: {
      street: '321 Garden Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400004',
      coordinates: { lat: 19.0740, lng: 72.8757 }
    },
    preferences: {
      veg: false,
      spiceLevel: 'high',
      allergies: ['nuts'],
      dietaryRestrictions: []
    },
    isActive: true
  });

  const consumer3 = storage.create('users', {
    email: 'consumer3@nourishnet.com',
    name: 'Amit Patel',
    role: 'consumer',
    phone: '+91 98765 43215',
    address: {
      street: '654 Business Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400005',
      coordinates: { lat: 19.0800, lng: 72.8817 }
    },
    preferences: {
      veg: true,
      spiceLevel: 'low',
      allergies: [],
      dietaryRestrictions: ['gluten-free']
    },
    isActive: true
  });

  const consumer4 = storage.create('users', {
    email: 'consumer4@nourishnet.com',
    name: 'Sneha Reddy',
    role: 'consumer',
    phone: '+91 98765 43216',
    address: {
      street: '987 Tech Hub',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400006',
      coordinates: { lat: 19.0820, lng: 72.8837 }
    },
    preferences: {
      veg: true,
      spiceLevel: 'medium',
      allergies: ['dairy'],
      dietaryRestrictions: []
    },
    isActive: true
  });

  // Create additional subscriptions
  const subscription2 = storage.create('subscriptions', {
    userId: consumer2.id,
    planType: 'monthly',
    status: 'active',
    price: 1800,
    deliveryAddress: {
      street: '321 Garden Lane',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400004',
      coordinates: { lat: 19.0740, lng: 72.8757 }
    },
    deliveryTime: '13:00-14:00',
    preferences: {
      veg: false,
      spiceLevel: 'high',
      allergies: ['nuts'],
      dietaryRestrictions: []
    },
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });

  const subscription3 = storage.create('subscriptions', {
    userId: consumer3.id,
    planType: 'weekly',
    status: 'active',
    price: 600,
    deliveryAddress: {
      street: '654 Business Park',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400005',
      coordinates: { lat: 19.0800, lng: 72.8817 }
    },
    deliveryTime: '12:30-13:30',
    preferences: {
      veg: true,
      spiceLevel: 'low',
      allergies: [],
      dietaryRestrictions: ['gluten-free']
    },
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  const subscription4 = storage.create('subscriptions', {
    userId: consumer4.id,
    planType: 'daily',
    status: 'active',
    price: 100,
    deliveryAddress: {
      street: '987 Tech Hub',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400006',
      coordinates: { lat: 19.0820, lng: 72.8837 }
    },
    deliveryTime: '19:00-20:00',
    preferences: {
      veg: true,
      spiceLevel: 'medium',
      allergies: ['dairy'],
      dietaryRestrictions: []
    },
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    nextBillingDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  });

  // Create additional staff
  const staff2 = storage.create('staff', {
    name: 'Vikram Singh',
    email: 'vikram@nourishnet.com',
    phone: '+91 98765 43217',
    employeeId: 'EMP002',
    role: 'delivery',
    isActive: true,
    currentLocation: {
      lat: 19.0780,
      lng: 72.8797,
      timestamp: new Date().toISOString()
    },
    assignedDeliveries: [],
    performance: {
      totalDeliveries: 18,
      onTimeDeliveries: 16,
      rating: 4.6,
      lastActive: new Date().toISOString()
    }
  });

  const staff3 = storage.create('staff', {
    name: 'Deepak Kumar',
    email: 'deepak@nourishnet.com',
    phone: '+91 98765 43218',
    employeeId: 'EMP003',
    role: 'delivery',
    isActive: true,
    currentLocation: {
      lat: 19.0820,
      lng: 72.8837,
      timestamp: new Date().toISOString()
    },
    assignedDeliveries: [],
    performance: {
      totalDeliveries: 32,
      onTimeDeliveries: 30,
      rating: 4.9,
      lastActive: new Date().toISOString()
    }
  });

  // Create additional menus for different days
  const menu2 = storage.create('menus', {
    vendorId: vendor.id,
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    type: 'daily',
    items: [
      {
        name: 'Rajma Chawal',
        description: 'Kidney beans curry with rice',
        price: 90,
        category: 'main',
        isVeg: true,
        allergens: [],
        nutritionalInfo: {
          calories: 380,
          protein: 15,
          carbs: 50,
          fat: 10
        }
      },
      {
        name: 'Fish Curry',
        description: 'Spicy fish curry with rice',
        price: 150,
        category: 'main',
        isVeg: false,
        allergens: ['fish'],
        nutritionalInfo: {
          calories: 450,
          protein: 30,
          carbs: 35,
          fat: 18
        }
      }
    ],
    isPublished: true,
    publishedAt: new Date().toISOString(),
    fssaiLicense: 'FSSAI123456789'
  });

  const menu3 = storage.create('menus', {
    vendorId: vendor2.id,
    date: new Date().toISOString(),
    type: 'daily',
    items: [
      {
        name: 'Paneer Butter Masala',
        description: 'Creamy paneer in tomato gravy',
        price: 130,
        category: 'main',
        isVeg: true,
        allergens: ['dairy'],
        nutritionalInfo: {
          calories: 420,
          protein: 18,
          carbs: 25,
          fat: 22
        }
      },
      {
        name: 'Chicken Biryani',
        description: 'Aromatic basmati rice with chicken',
        price: 180,
        category: 'main',
        isVeg: false,
        allergens: [],
        nutritionalInfo: {
          calories: 520,
          protein: 28,
          carbs: 45,
          fat: 20
        }
      }
    ],
    isPublished: true,
    publishedAt: new Date().toISOString(),
    fssaiLicense: 'FSSAI987654321'
  });

  // Create multiple deliveries for route optimization
  const deliveries = [];
  for (let i = 0; i < 5; i++) {
    const delivery = storage.create('deliveries', {
      subscriptionId: [subscription1.id, subscription2.id, subscription3.id, subscription4.id][i % 4],
      staffId: [staff1.id, staff2.id, staff3.id][i % 3],
      date: new Date().toISOString(),
      status: 'scheduled',
      route: {
        optimized: false,
        waypoints: [],
        totalDistance: 0,
        totalTime: 0
      },
      tracking: {
        currentLocation: null,
        estimatedArrival: null,
        actualDeliveryTime: null,
        notes: null
      },
      payment: {
        amount: [500, 1800, 600, 100][i % 4],
        method: 'cash',
        status: 'pending'
      }
    });
    deliveries.push(delivery);
  }

  console.log('Comprehensive demo data seeded successfully!');
  console.log('Vendors:', 2);
  console.log('Consumers:', 4);
  console.log('Subscriptions:', 4);
  console.log('Staff Members:', 3);
  console.log('Menus:', 3);
  console.log('Deliveries:', 5);
};
