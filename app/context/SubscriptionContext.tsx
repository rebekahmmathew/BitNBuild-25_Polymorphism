import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export interface Subscription {
  id: string;
  planType: 'daily' | 'weekly' | 'monthly';
  mealsPerDay: number;
  portionSize: 'small' | 'medium' | 'large';
  deliveryTime: string;
  isFlexible: boolean;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
  price: number;
  vendorId: string;
  vendorName: string;
}

export interface DailyMenu {
  date: string;
  vegOption: string;
  nonVegOption?: string;
  specialDish?: string;
  nutritionInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface DeliveryTracking {
  orderId: string;
  status: 'preparing' | 'out-for-delivery' | 'arriving-soon' | 'delivered';
  deliveryPersonName: string;
  deliveryPersonPhone: string;
  estimatedTime: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  };
}

export const [SubscriptionProvider, useSubscription] = createContextHook(() => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [weeklyMenu, setWeeklyMenu] = useState<DailyMenu[]>([]);
  const [currentDelivery, setCurrentDelivery] = useState<DeliveryTracking | null>(null);
  const [communityImpact, setCommunityImpact] = useState({
    mealsDonated: 0,
    loyaltyPoints: 0,
    healthStreakPoints: 0,
  });

  useEffect(() => {
    loadSubscriptionData();
    loadWeeklyMenu();
    loadCommunityImpact();
  }, []);

  const loadSubscriptionData = async () => {
    try {
      const data = await AsyncStorage.getItem('subscription');
      if (data) {
        setSubscription(JSON.parse(data));
      } else {
        // Mock subscription data
        const mockSubscription: Subscription = {
          id: 'sub_001',
          planType: 'monthly',
          mealsPerDay: 2,
          portionSize: 'medium',
          deliveryTime: '12:30 PM',
          isFlexible: true,
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          isActive: true,
          autoRenew: true,
          price: 3000,
          vendorId: 'vendor_001',
          vendorName: 'Sharma Tiffin Service',
        };
        setSubscription(mockSubscription);
        await AsyncStorage.setItem('subscription', JSON.stringify(mockSubscription));
      }
    } catch (error) {
      console.error('Error loading subscription:', error);
    }
  };

  const loadWeeklyMenu = async () => {
    try {
      const data = await AsyncStorage.getItem('weeklyMenu');
      if (data) {
        setWeeklyMenu(JSON.parse(data));
      } else {
        // Mock weekly menu
        const mockMenu: DailyMenu[] = [
          {
            date: '2024-01-15',
            vegOption: 'Dal Tadka, Roti, Rice, Sabzi',
            nonVegOption: 'Chicken Curry, Roti, Rice',
            specialDish: 'Gulab Jamun',
            nutritionInfo: { calories: 650, protein: 25, carbs: 85, fat: 18 },
          },
          {
            date: '2024-01-16',
            vegOption: 'Rajma, Roti, Rice, Aloo Gobi',
            nonVegOption: 'Mutton Curry, Roti, Rice',
            nutritionInfo: { calories: 680, protein: 28, carbs: 82, fat: 20 },
          },
          // Add more days...
        ];
        setWeeklyMenu(mockMenu);
        await AsyncStorage.setItem('weeklyMenu', JSON.stringify(mockMenu));
      }
    } catch (error) {
      console.error('Error loading menu:', error);
    }
  };

  const loadCommunityImpact = async () => {
    try {
      const data = await AsyncStorage.getItem('communityImpact');
      if (data) {
        setCommunityImpact(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading community impact:', error);
    }
  };

  const pauseSubscription = async (dates: string[], donate: boolean = false) => {
    if (!subscription) return;

    if (donate) {
      const newImpact = {
        ...communityImpact,
        mealsDonated: communityImpact.mealsDonated + dates.length,
        loyaltyPoints: communityImpact.loyaltyPoints + (dates.length * 10),
      };
      setCommunityImpact(newImpact);
      await AsyncStorage.setItem('communityImpact', JSON.stringify(newImpact));
    }

    // Mock pause logic
    console.log(`Paused subscription for dates: ${dates.join(', ')}`);
    if (donate) {
      console.log('Meals donated to NGO partners');
    }
  };

  const startDeliveryTracking = (orderId: string) => {
    const mockTracking: DeliveryTracking = {
      orderId,
      status: 'preparing',
      deliveryPersonName: 'Raj Kumar',
      deliveryPersonPhone: '+91 98765 43210',
      estimatedTime: '25 mins',
      currentLocation: {
        latitude: 28.6139,
        longitude: 77.2090,
      },
    };
    setCurrentDelivery(mockTracking);

    // Mock status updates
    setTimeout(() => {
      setCurrentDelivery(prev => prev ? { ...prev, status: 'out-for-delivery', estimatedTime: '15 mins' } : null);
    }, 5000);

    setTimeout(() => {
      setCurrentDelivery(prev => prev ? { ...prev, status: 'arriving-soon', estimatedTime: '5 mins' } : null);
    }, 15000);

    setTimeout(() => {
      setCurrentDelivery(prev => prev ? { ...prev, status: 'delivered', estimatedTime: '0 mins' } : null);
    }, 25000);
  };

  const updateHealthStreak = async (points: number) => {
    const newImpact = {
      ...communityImpact,
      healthStreakPoints: communityImpact.healthStreakPoints + points,
    };
    setCommunityImpact(newImpact);
    await AsyncStorage.setItem('communityImpact', JSON.stringify(newImpact));
  };

  return {
    subscription,
    weeklyMenu,
    currentDelivery,
    communityImpact,
    pauseSubscription,
    startDeliveryTracking,
    updateHealthStreak,
    setSubscription,
  };
});