import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { loginUser, registerUser } from '../store/slices/authSlice'

const LoginScreen = () => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { error } = useSelector((state: RootState) => state.auth)

  const handleDemoLogin = async () => {
    try {
      setIsLoading(true)
      
      // Create a demo user
      const userData = {
        email: 'demo@nourishnet.com',
        name: 'Demo Consumer',
        role: 'consumer',
        phone: '+91 98765 43210',
        address: {
          street: '456 Consumer Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          coordinates: {
            lat: 19.0760,
            lng: 72.8777
          }
        }
      }
      
      // Try to register/login
      try {
        await dispatch(registerUser(userData)).unwrap()
        Alert.alert('Success', 'Demo login successful!')
      } catch (error) {
        // If registration fails, try to login with existing user
        const existingUser = { id: 'demo-consumer-id', ...userData }
        dispatch(loginUser(existingUser))
        Alert.alert('Success', 'Demo login successful!')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      Alert.alert('Error', error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>NourishNet</Text>
        <Text style={styles.subtitle}>Your Tiffin Service Companion</Text>
        
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleDemoLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing in...' : 'Demo Login (Consumer)'}
          </Text>
        </TouchableOpacity>
        
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        
        <Text style={styles.demoText}>
          This is a simplified MVP version for demonstration purposes
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 16,
    textAlign: 'center',
  },
  demoText: {
    color: '#64748b',
    marginTop: 20,
    textAlign: 'center',
    fontSize: 12,
  },
})

export default LoginScreen