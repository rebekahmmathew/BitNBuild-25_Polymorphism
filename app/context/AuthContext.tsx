import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await AsyncStorage.getItem('auth:user');
        if (data) setUser(JSON.parse(data));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (phone: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    // Demo auth: accept OTP 1234
    if (!phone || otp !== '1234') {
      return { success: false, error: 'Invalid OTP' };
    }
    const demoUser: AuthUser = {
      id: 'user_001',
      name: `+91 ${phone.slice(0, 5)}****`,
      phone,
    };
    setUser(demoUser);
    await AsyncStorage.setItem('auth:user', JSON.stringify(demoUser));
    router.replace('/tabs/home');
    return { success: true };
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('auth:user');
    router.replace('/auth/login');
  };

  return {
    user,
    loading,
    login,
    logout,
  };
});