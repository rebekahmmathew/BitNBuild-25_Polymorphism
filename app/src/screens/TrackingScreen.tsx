import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { Ionicons } from '@expo/vector-icons'
import * as Location from 'expo-location'

const TrackingScreen = () => {
  const [deliveryStatus, setDeliveryStatus] = useState('preparing')
  const [estimatedTime, setEstimatedTime] = useState(25)
  const [deliveryLocation, setDeliveryLocation] = useState({
    latitude: 19.0760,
    longitude: 72.8777,
  })
  const [userLocation, setUserLocation] = useState({
    latitude: 19.0760,
    longitude: 72.8777,
  })

  useEffect(() => {
    getCurrentLocation()
    // Simulate delivery tracking updates
    const interval = setInterval(() => {
      updateDeliveryStatus()
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required for tracking')
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
    } catch (error) {
      console.error('Error getting location:', error)
    }
  }

  const updateDeliveryStatus = () => {
    // Simulate status updates
    const statuses = ['preparing', 'out_for_delivery', 'nearby', 'delivered']
    const currentIndex = statuses.indexOf(deliveryStatus)
    if (currentIndex < statuses.length - 1) {
      setDeliveryStatus(statuses[currentIndex + 1])
      setEstimatedTime(Math.max(0, estimatedTime - 5))
    }
  }

  const getStatusInfo = () => {
    switch (deliveryStatus) {
      case 'preparing':
        return {
          title: 'Preparing your order',
          description: 'Your tiffin is being prepared with fresh ingredients',
          color: '#f59e0b',
          icon: 'restaurant'
        }
      case 'out_for_delivery':
        return {
          title: 'Out for delivery',
          description: 'Your order is on its way to you',
          color: '#0ea5e9',
          icon: 'bicycle'
        }
      case 'nearby':
        return {
          title: 'Almost there!',
          description: 'Your delivery person is nearby',
          color: '#10b981',
          icon: 'location'
        }
      case 'delivered':
        return {
          title: 'Delivered',
          description: 'Your order has been delivered successfully',
          color: '#10b981',
          icon: 'checkmark-circle'
        }
      default:
        return {
          title: 'Unknown status',
          description: 'Status not available',
          color: '#64748b',
          icon: 'help-circle'
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons 
            name={statusInfo.icon as any} 
            size={32} 
            color={statusInfo.color} 
          />
          <View style={styles.statusText}>
            <Text style={[styles.statusTitle, { color: statusInfo.color }]}>
              {statusInfo.title}
            </Text>
            <Text style={styles.statusDescription}>
              {statusInfo.description}
            </Text>
          </View>
        </View>
        
        {deliveryStatus !== 'delivered' && (
          <View style={styles.etaContainer}>
            <Text style={styles.etaText}>
              Estimated delivery time: {estimatedTime} minutes
            </Text>
          </View>
        )}
      </View>

      <View style={styles.mapContainer}>
        <Text style={styles.sectionTitle}>Live Tracking</Text>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
          <Marker
            coordinate={deliveryLocation}
            title="Delivery Person"
            pinColor="red"
          />
          {deliveryStatus === 'out_for_delivery' && (
            <Polyline
              coordinates={[userLocation, deliveryLocation]}
              strokeColor="#0ea5e9"
              strokeWidth={3}
            />
          )}
        </MapView>
      </View>

      <View style={styles.deliveryInfo}>
        <Text style={styles.sectionTitle}>Delivery Information</Text>
        
        <View style={styles.infoItem}>
          <Ionicons name="person" size={20} color="#64748b" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Delivery Person</Text>
            <Text style={styles.infoValue}>Rajesh Kumar</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="call" size={20} color="#64748b" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Contact</Text>
            <Text style={styles.infoValue}>+91 98765 43210</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="time" size={20} color="#64748b" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Order Time</Text>
            <Text style={styles.infoValue}>12:00 PM</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.callButton}>
          <Ionicons name="call" size={20} color="white" />
          <Text style={styles.callButtonText}>Call Delivery Person</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  statusCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusText: {
    marginLeft: 16,
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  etaContainer: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  etaText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  mapContainer: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  map: {
    height: 200,
    borderRadius: 12,
  },
  deliveryInfo: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  callButton: {
    backgroundColor: '#0ea5e9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  callButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
})

export default TrackingScreen
