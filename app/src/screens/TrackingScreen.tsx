import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const { width, height } = Dimensions.get('window');

interface DeliveryStatus {
  id: string;
  status: string;
  estimatedTime: string;
  address: string;
  driverName: string;
  driverPhone: string;
  currentLocation?: {
    lat: number;
    lng: number;
  };
  route?: {
    totalDistance: number;
    totalTime: number;
    waypoints: Array<{
      address: string;
      coordinates: { lat: number; lng: number };
      order: number;
    }>;
  };
}

const TrackingScreen: React.FC = () => {
  const [delivery, setDelivery] = useState<DeliveryStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchDeliveryStatus();
  }, []);

  const fetchDeliveryStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/deliveries/active', {
        headers: { 'x-user-id': user?.id || 'consumer_1' }
      });
      const data = await response.json();
      setDelivery(data.delivery);
    } catch (error) {
      console.error('Error fetching delivery status:', error);
      // Mock data for demo
      setDelivery({
        id: 'del_1',
        status: 'out_for_delivery',
        estimatedTime: '15 minutes',
        address: '123 Main Street, Mumbai, Maharashtra 400001',
        driverName: 'Rajesh Kumar',
        driverPhone: '+91 98765 43210',
        currentLocation: {
          lat: 19.0760,
          lng: 72.8777
        },
        route: {
          totalDistance: 2.5,
          totalTime: 15,
          waypoints: [
            {
              address: 'Vendor Location',
              coordinates: { lat: 19.0760, lng: 72.8777 },
              order: 0
            },
            {
              address: '123 Main Street, Mumbai',
              coordinates: { lat: 19.0740, lng: 72.8757 },
              order: 1
            }
          ]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDeliveryStatus();
    setRefreshing(false);
  };

  const callDriver = () => {
    Alert.alert(
      'Call Driver',
      `Call ${delivery?.driverName} at ${delivery?.driverPhone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling driver...') }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return '#FFA500';
      case 'out_for_delivery': return '#2196F3';
      case 'delivered': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'Preparing Your Order';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return 'Scheduled';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return 'restaurant';
      case 'out_for_delivery': return 'bicycle';
      case 'delivered': return 'checkmark-circle';
      default: return 'time';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading delivery status...</Text>
      </View>
    );
  }

  if (!delivery) {
    return (
      <View style={styles.noDeliveryContainer}>
        <Ionicons name="bicycle" size={64} color="#9E9E9E" />
        <Text style={styles.noDeliveryTitle}>No Active Delivery</Text>
        <Text style={styles.noDeliveryText}>
          You don't have any active deliveries at the moment.
        </Text>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Order Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Track Your Delivery</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <View style={[styles.statusIcon, { backgroundColor: getStatusColor(delivery.status) }]}>
            <Ionicons name={getStatusIcon(delivery.status)} size={24} color="white" />
          </View>
          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>{getStatusText(delivery.status)}</Text>
            <Text style={styles.estimatedTime}>ETA: {delivery.estimatedTime}</Text>
          </View>
        </View>
        
        <View style={styles.progressBar}>
          <View style={[
            styles.progressFill,
            { 
              width: delivery.status === 'delivered' ? '100%' : 
                   delivery.status === 'out_for_delivery' ? '75%' : '25%'
            }
          ]} />
        </View>
      </View>

      {/* Driver Info */}
      <View style={styles.driverCard}>
        <View style={styles.driverHeader}>
          <Ionicons name="person" size={20} color="#3B82F6" />
          <Text style={styles.driverTitle}>Your Driver</Text>
        </View>
        <View style={styles.driverInfo}>
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{delivery.driverName}</Text>
            <Text style={styles.driverPhone}>{delivery.driverPhone}</Text>
          </View>
          <TouchableOpacity style={styles.callButton} onPress={callDriver}>
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.callButtonText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Delivery Address */}
      <View style={styles.addressCard}>
        <View style={styles.addressHeader}>
          <Ionicons name="location" size={20} color="#3B82F6" />
          <Text style={styles.addressTitle}>Delivery Address</Text>
        </View>
        <Text style={styles.addressText}>{delivery.address}</Text>
      </View>

      {/* Route Info */}
      {delivery.route && (
        <View style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <Ionicons name="map" size={20} color="#3B82F6" />
            <Text style={styles.routeTitle}>Route Information</Text>
          </View>
          <View style={styles.routeStats}>
            <View style={styles.routeStat}>
              <Text style={styles.routeStatValue}>{delivery.route.totalDistance} km</Text>
              <Text style={styles.routeStatLabel}>Distance</Text>
            </View>
            <View style={styles.routeStat}>
              <Text style={styles.routeStatValue}>{delivery.route.totalTime} min</Text>
              <Text style={styles.routeStatLabel}>Duration</Text>
            </View>
            <View style={styles.routeStat}>
              <Text style={styles.routeStatValue}>{delivery.route.waypoints.length}</Text>
              <Text style={styles.routeStatLabel}>Stops</Text>
            </View>
          </View>
        </View>
      )}

      {/* Map Placeholder */}
      <View style={styles.mapCard}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={48} color="#9E9E9E" />
          <Text style={styles.mapText}>Live Map View</Text>
          <Text style={styles.mapSubtext}>
            Real-time tracking will be available here
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.primaryButton}>
          <Ionicons name="refresh" size={20} color="white" />
          <Text style={styles.primaryButtonText}>Refresh Status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Ionicons name="help-circle" size={20} color="#3B82F6" />
          <Text style={styles.secondaryButtonText}>Get Help</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDeliveryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  noDeliveryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noDeliveryText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  orderButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
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
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  estimatedTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  driverCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  driverInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  driverPhone: {
    fontSize: 14,
    color: '#6B7280',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  callButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  addressCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  routeCard: {
    margin: 20,
    marginTop: 0,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  routeStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  routeStat: {
    alignItems: 'center',
  },
  routeStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  routeStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  mapCard: {
    margin: 20,
    marginTop: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  mapText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6B7280',
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default TrackingScreen;