import { Stack } from 'expo-router';
import React from 'react';

export default function NutritionCoachLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerBackTitle: "Back" }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "AI Nutrition Coach",
          headerStyle: { backgroundColor: '#FFF7ED' },
          headerTintColor: '#F97316',
        }} 
      />
    </Stack>
  );
}