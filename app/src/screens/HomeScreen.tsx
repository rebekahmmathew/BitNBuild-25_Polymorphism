import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  Dimensions
} from 'react-native';
import { useQuery } from 'react-query';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const { width } = Dimensions.get('window');

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image?: string;
}

interface Delivery {
  id: string;
  status: string;
  estimatedTime: string;
  address: string;
  driverName: string;
  driverPhone: string;
}

const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);

  // Fetch today's menu
  const { data: menuData, isLoading: menuLoading, refetch: refetchMenu } = useQuery(
    'today-menu',
    async () => {
      const response = await fetch('http://localhost:3001/api/menus/today', {
        headers: { 'x-user-id': user?.id || 'consumer_1' }
      });
      return response.json();
    }
  );

  // Fetch active delivery
  const { data: deliveryData, isLoading: deliveryLoading, refetch: refetchDelivery } = useQuery(
    'active-delivery',
    async () => {
      const response = await fetch('http://localhost:3001/api/deliveries/active', {
        headers: { 'x-user-id': user?.id || 'consumer_1' }
      });
      return response.json();
    }
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchMenu(), refetchDelivery()]);
    setRefreshing(false);
  };

  const handleOrderNow = (item: MenuItem) => {
    Alert.alert(
      'Order Confirmed!',
      `You've ordered ${item.name} for ₹${item.price}. Your order will be delivered soon!`,
      [{ text: 'OK' }]
    );
  };

  const handleTrackDelivery = () => {
    Alert.alert(
      'Track Delivery',
      'Your delivery is on the way! You can track it in real-time.',
      [{ text: 'OK' }]
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
      case 'preparing': return 'Preparing';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return 'Scheduled';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good {new Date().getHours() < 12 ? 'Morning' : 'Evening'}!</Text>
          <Text style={styles.userName}>{user?.name || 'Welcome'}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-circle-outline" size={32} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Active Delivery Card */}
      {deliveryData?.delivery && (
        <View style={styles.deliveryCard}>
          <View style={styles.deliveryHeader}>
            <Ionicons name="bicycle" size={24} color="#3B82F6" />
            <Text style={styles.deliveryTitle}>Your Delivery</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(deliveryData.delivery.status) }
            ]}>
              <Text style={styles.statusText}>
                {getStatusText(deliveryData.delivery.status)}
              </Text>
            </View>
          </View>
          <Text style={styles.deliveryAddress}>{deliveryData.delivery.address}</Text>
          <Text style={styles.deliveryTime}>
            ETA: {deliveryData.delivery.estimatedTime || '30 minutes'}
          </Text>
          <TouchableOpacity style={styles.trackButton} onPress={handleTrackDelivery}>
            <Text style={styles.trackButtonText}>Track Delivery</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* Today's Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Menu</Text>
        <Text style={styles.sectionSubtitle}>Fresh and delicious meals prepared just for you</Text>
        
        {menuLoading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading menu...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuScroll}>
            {menuData?.menu?.items?.map((item: MenuItem) => (
              <View key={item.id} style={styles.menuItem}>
                <View style={styles.menuItemImage}>
                  <Ionicons 
                    name={item.isVeg ? "leaf" : "restaurant"} 
                    size={40} 
                    color={item.isVeg ? "#4CAF50" : "#FF5722"} 
                  />
                </View>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.menuItemFooter}>
                  <Text style={styles.menuItemPrice}>₹{item.price}</Text>
                  <TouchableOpacity 
                    style={styles.orderButton}
                    onPress={() => handleOrderNow(item)}
                  >
                    <Text style={styles.orderButtonText}>Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="calendar" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>My Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart" size={24} color="#E91E63" />
            <Text style={styles.actionText}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="location" size={24} color="#4CAF50" />
            <Text style={styles.actionText}>Addresses</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="help-circle" size={24} color="#FF9800" />
            <Text style={styles.actionText}>Support</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subscription Status */}
      <View style={styles.subscriptionCard}>
        <View style={styles.subscriptionHeader}>
          <Ionicons name="star" size={24} color="#FFD700" />
          <Text style={styles.subscriptionTitle}>Premium Member</Text>
        </View>
        <Text style={styles.subscriptionDescription}>
          You're enjoying unlimited access to our premium tiffin service
        </Text>
        <TouchableOpacity style={styles.subscriptionButton}>
          <Text style={styles.subscriptionButtonText}>Manage Subscription</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  profileButton: {
    padding: 4,
  },
  deliveryCard: {
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
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 16,
  },
  trackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  trackButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  menuScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  menuItem: {
    width: width * 0.7,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemImage: {
    alignItems: 'center',
    marginBottom: 12,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  orderButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  orderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    width: (width - 60) / 2,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  subscriptionCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  subscriptionDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  subscriptionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  subscriptionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;