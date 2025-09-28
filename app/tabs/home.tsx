import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { MapPin, Clock, Heart, Gift } from 'lucide-react-native';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { subscription, weeklyMenu, communityImpact, startDeliveryTracking } = useSubscription();

  const todaysMenu = weeklyMenu.find(menu => 
    new Date(menu.date).toDateString() === new Date().toDateString()
  );

  const handleTrackDelivery = () => {
    startDeliveryTracking('order_001');
    router.push('/tabs/track');
  };

  const healthTips = [
    "💧 Stay hydrated! Drink 8-10 glasses of water daily",
    "🥗 Today&apos;s meal is rich in protein and fiber",
    "🚶‍♂️ Take a 10-minute walk after your meal",
    "🧘‍♀️ Practice mindful eating for better digestion",
  ];

  const randomTip = healthTips[Math.floor(Math.random() * healthTips.length)];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good afternoon,</Text>
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
          </View>
          <TouchableOpacity style={styles.locationButton}>
            <MapPin size={16} color="#F97316" />
            <Text style={styles.locationText}>Home</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Meal Card */}
        <Card style={styles.mealCard}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealTitle}>Today&apos;s Menu</Text>
            <View style={styles.mealTime}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.mealTimeText}>{subscription?.deliveryTime}</Text>
            </View>
          </View>

          {todaysMenu ? (
            <View style={styles.mealContent}>
              <View style={styles.mealOption}>
                <Text style={styles.mealLabel}>🥗 Vegetarian</Text>
                <Text style={styles.mealDescription}>{todaysMenu.vegOption}</Text>
              </View>
              
              {todaysMenu.nonVegOption && (
                <View style={styles.mealOption}>
                  <Text style={styles.mealLabel}>🍗 Non-Vegetarian</Text>
                  <Text style={styles.mealDescription}>{todaysMenu.nonVegOption}</Text>
                </View>
              )}

              {todaysMenu.specialDish && (
                <View style={styles.specialDish}>
                  <Text style={styles.specialLabel}>✨ Special: {todaysMenu.specialDish}</Text>
                </View>
              )}

              <View style={styles.nutritionInfo}>
                <Text style={styles.nutritionTitle}>Nutrition Info</Text>
                <View style={styles.nutritionRow}>
                  <Text style={styles.nutritionItem}>🔥 {todaysMenu.nutritionInfo.calories} cal</Text>
                  <Text style={styles.nutritionItem}>💪 {todaysMenu.nutritionInfo.protein}g protein</Text>
                  <Text style={styles.nutritionItem}>🌾 {todaysMenu.nutritionInfo.carbs}g carbs</Text>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.noMenuText}>Menu will be updated soon!</Text>
          )}
        </Card>

        {/* Track Delivery Button */}
        <Button
          title="Track My Delivery"
          onPress={handleTrackDelivery}
          style={styles.trackButton}
          testID="track-delivery-button"
        />

        {/* Health Tip Widget */}
        <Card style={styles.healthTipCard}>
          <View style={styles.healthTipHeader}>
            <Heart size={20} color="#22C55E" />
            <Text style={styles.healthTipTitle}>Daily Health Tip</Text>
          </View>
          <Text style={styles.healthTipText}>{randomTip}</Text>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/tabs/menu')}
            >
              <Text style={styles.actionEmoji}>📅</Text>
              <Text style={styles.actionText}>View Menu</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/tabs/pause')}
            >
              <Text style={styles.actionEmoji}>⏸️</Text>
              <Text style={styles.actionText}>Pause Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/community')}
            >
              <Text style={styles.actionEmoji}>🤝</Text>
              <Text style={styles.actionText}>Community</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/nutrition-coach')}
            >
              <Text style={styles.actionEmoji}>🧠</Text>
              <Text style={styles.actionText}>AI Coach</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Community Impact */}
        <Card style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <Gift size={20} color="#F97316" />
            <Text style={styles.impactTitle}>Your Impact</Text>
          </View>
          <View style={styles.impactStats}>
            <View style={styles.impactStat}>
              <Text style={styles.impactNumber}>{communityImpact.mealsDonated}</Text>
              <Text style={styles.impactLabel}>Meals Donated</Text>
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactNumber}>{communityImpact.loyaltyPoints}</Text>
              <Text style={styles.impactLabel}>Loyalty Points</Text>
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactNumber}>{communityImpact.healthStreakPoints}</Text>
              <Text style={styles.impactLabel}>Health Streak</Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '500',
  },
  mealCard: {
    marginBottom: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  mealTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mealTimeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  mealContent: {
    gap: 12,
  },
  mealOption: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  mealLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  specialDish: {
    backgroundColor: '#FFF7ED',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  specialLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F97316',
  },
  nutritionInfo: {
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    padding: 12,
  },
  nutritionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    fontSize: 12,
    color: '#166534',
  },
  noMenuText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  trackButton: {
    marginBottom: 16,
  },
  healthTipCard: {
    marginBottom: 24,
    backgroundColor: '#F0FDF4',
  },
  healthTipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  healthTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
  },
  healthTipText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  impactCard: {
    marginBottom: 24,
    backgroundColor: '#FFF7ED',
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  impactStat: {
    alignItems: 'center',
  },
  impactNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F97316',
  },
  impactLabel: {
    fontSize: 12,
    color: '#9A3412',
    textAlign: 'center',
  },
});