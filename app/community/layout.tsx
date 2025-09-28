import { Stack } from 'expo-router';
import React from 'react';

export default function CommunityLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, headerBackTitle: "Back" }}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Community Hub",
          headerStyle: { backgroundColor: '#F0FDF4' },
          headerTintColor: '#166534',
        }} 
      />
    </Stack>
  );
}