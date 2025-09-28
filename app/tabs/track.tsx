import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useSubscription } from '@/context/SubscriptionContext';
import { MapPin, Clock, Phone, MessageCircle, Navigation } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function TrackScreen() {
  const { currentDelivery } = useSubscription();
  const [mockLocation, setMockLocation] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
  });

  // Mock delivery person movement
  useEffect(() => {
    if (!currentDelivery) return;

    const interval = setInterval(() => {
      setMockLocation(prev => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [currentDelivery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing': return '#F59E0B';
      case 'out-for-delivery': return '#3B82F6';
      case 'arriving-soon': return '#F97316';
      case 'delivered': return '#22C55E';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing': return 'Preparing your meal';
      case 'out-for-delivery': return 'Out for delivery';
      case 'arriving-soon': return 'Arriving soon';
      case 'delivered': return 'Delivered';
      default: return 'Unknown status';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'preparing': return '👨‍🍳';
      case 'out-for-delivery': return '🚗';
      case 'arriving-soon': return '📍';
      case 'delivered': return '✅';
      default: return '📦';
    }
  };

  if (!currentDelivery) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noDeliveryContainer}>
          <Text style={styles.noDeliveryEmoji}>📦</Text>
          <Text style={styles.noDeliveryTitle}>No Active Delivery</Text>
          <Text style={styles.noDeliveryText}>
            Your next delivery will appear here when it's being prepared.
          </Text>
          <Button
            title="View Menu"
            onPress={() => {/* Navigate to menu */}}
            style={styles.viewMenuButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Track Delivery</Text>
          <Text style={styles.orderId}>Order #{currentDelivery.orderId}</Text>
        </View>

        {/* Status Card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusEmoji}>
              {getStatusEmoji(currentDelivery.status)}
            </Text>
            <View style={styles.statusInfo}>
              <Text style={styles.statusText}>
                {getStatusText(currentDelivery.status)}
              </Text>
              <View style={styles.etaContainer}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.etaText}>
                  ETA: {currentDelivery.estimatedTime}
                </Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: currentDelivery.status === 'preparing' ? '25%' :
                           currentDelivery.status === 'out-for-delivery' ? '50%' :
                           currentDelivery.status === 'arriving-soon' ? '75%' : '100%',
                    backgroundColor: getStatusColor(currentDelivery.status),
                  }
                ]} 
              />
            </View>
          </View>

          {/* Status Steps */}
          <View style={styles.statusSteps}>
            {['preparing', 'out-for-delivery', 'arriving-soon', 'delivered'].map((step, index) => (
              <View key={step} style={styles.statusStep}>
                <View style={[
                  styles.statusDot,
                  {
                    backgroundColor: 
                      ['preparing', 'out-for-delivery', 'arriving-soon', 'delivered'].indexOf(currentDelivery.status) >= index
                        ? getStatusColor(currentDelivery.status)
                        : '#E5E7EB'
                  }
                ]} />
                <Text style={styles.statusStepText}>
                  {step.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Mock Map */}
        <Card style={styles.mapCard}>
          <View style={styles.mapContainer}>
            <View style={styles.mockMap}>
              <Text style={styles.mapTitle}>Live Location</Text>
              <View style={styles.mapContent}>
                <MapPin size={24} color="#F97316" />
                <Text style={styles.mapText}>
                  Delivery partner is on the way
                </Text>
                <Text style={styles.coordinatesText}>
                  📍 {mockLocation.latitude.toFixed(4)}, {mockLocation.longitude.toFixed(4)}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Delivery Person Info */}
        <Card style={styles.deliveryPersonCard}>
          <View style={styles.deliveryPersonHeader}>
            <View style={styles.deliveryPersonAvatar}>
              <Text style={styles.deliveryPersonInitial}>
                {currentDelivery.deliveryPersonName.charAt(0)}
              </Text>
            </View>
            <View style={styles.deliveryPersonInfo}>
              <Text style={styles.deliveryPersonName}>
                {currentDelivery.deliveryPersonName}
              </Text>
              <Text style={styles.deliveryPersonRole}>Delivery Partner</Text>
            </View>
          </View>

          <View style={styles.deliveryPersonActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Phone size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.messageButton]}>
              <MessageCircle size={20} color="#F97316" />
              <Text style={[styles.actionButtonText, styles.messageButtonText]}>Message</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Delivery Instructions */}
        <Card style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Delivery Instructions</Text>
          <View style={styles.instructionsList}>
            <Text style={styles.instructionItem}>
              📞 Our partner will call you before arriving
            </Text>
            <Text style={styles.instructionItem}>
              🏠 Please be available at your delivery address
            </Text>
            <Text style={styles.instructionItem}>
              🍽️ Check your meal before the partner leaves
            </Text>
            <Text style={styles.instructionItem}>
              ⭐ Don't forget to rate your experience
            </Text>
          </View>
        </Card>

        {/* Help Section */}
        <Card style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            Having issues with your delivery? We're here to help!
          </Text>
          <View style={styles.helpActions}>
            <Button
              title="Contact Support"
              variant="outline"
              size="small"
              onPress={() => {/* Contact support */}}
            />
            <Button
              title="Report Issue"
              variant="ghost"
              size="small"
              onPress={() => {/* Report issue */}}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  orderId: {
    fontSize: 14,
    color: '#6B7280',
  },
  noDeliveryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  noDeliveryEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  noDeliveryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  noDeliveryText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  viewMenuButton: {
    minWidth: 120,
  },
  statusCard: {
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  statusInfo: {
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  etaText: {
    fontSize: 14,
    color: '#6B7280',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  statusSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusStep: {
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusStepText: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
  },
  mapCard: {
    marginBottom: 16,
  },
  mapContainer: {
    height: 200,
  },
  mockMap: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapTitle: {
    position: 'absolute',
    top: 12,
    left: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  mapContent: {
    alignItems: 'center',
    gap: 8,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  coordinatesText: {
    fontSize: 12,
    color: '#6B7280',
  },
  deliveryPersonCard: {
    marginBottom: 16,
  },
  deliveryPersonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  deliveryPersonAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deliveryPersonInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  deliveryPersonInfo: {
    flex: 1,
  },
  deliveryPersonName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  deliveryPersonRole: {
    fontSize: 14,
    color: '#6B7280',
  },
  deliveryPersonActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F97316',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  messageButton: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  messageButtonText: {
    color: '#F97316',
  },
  instructionsCard: {
    marginBottom: 16,
    backgroundColor: '#F0FDF4',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 12,
  },
  instructionsList: {
    gap: 8,
  },
  instructionItem: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  helpCard: {
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  helpActions: {
    flexDirection: 'row',
    gap: 12,
  },
});