import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { Ionicons } from '@expo/vector-icons'

// Screens
import LoginScreen from '../screens/LoginScreen'
import HomeScreen from '../screens/HomeScreen'
import MenuScreen from '../screens/MenuScreen'
import TrackingScreen from '../screens/TrackingScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SubscriptionScreen from '../screens/SubscriptionScreen'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Menu') {
            iconName = focused ? 'restaurant' : 'restaurant-outline'
          } else if (route.name === 'Tracking') {
            iconName = focused ? 'location' : 'location-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#0ea5e9',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Tracking" component={TrackingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator
