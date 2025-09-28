import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { User, MapPin, Bell, HelpCircle, Settings, LogOut, Edit, Star, Gift } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { subscription, communityImpact } = useSubscription();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
      ]
    );
  };

  const profileMenuItems = [
    {
      icon: Edit,
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      onPress: () => {/* Navigate to edit profile */},
    },
    {
      icon: MapPin,
      title: 'Manage Addresses',
      subtitle: `${user?.addresses.length || 0} saved addresses`,
      onPress: () => {/* Navigate to addresses */},
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      onPress: () => {/* Navigate to notifications */},
    },
    {
      icon: Star,
      title: 'Rate & Review',
      subtitle: 'Share your experience with us',
      onPress: () => {/* Navigate to reviews */},
    },
    {
      icon: Gift,
      title: 'Refer Friends',
      subtitle: 'Earn rewards by referring friends',
      onPress: () => {/* Navigate to referrals */},
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help with your account',
      onPress: () => {/* Navigate to help */},
    },
    {
      icon: Settings,
      title: 'Settings',
      subtitle: 'App preferences and privacy',
      onPress: () => {/* Navigate to settings */},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* User Info Card */}
        <Card style={styles.userCard}>
          <View style={styles.userHeader}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userPhone}>{user?.phone || 'Phone not available'}</Text>
              {user?.email && (
                <Text style={styles.userEmail}>{user.email}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit size={16} color="#F97316" />
            </TouchableOpacity>
          </View>

          {/* User Stats */}
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{communityImpact.mealsDonated}</Text>
              <Text style={styles.statLabel}>Meals Donated</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{communityImpact.loyaltyPoints}</Text>
              <Text style={styles.statLabel}>Loyalty Points</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{communityImpact.healthStreakPoints}</Text>
              <Text style={styles.statLabel}>Health Streak</Text>
            </View>
          </View>
        </Card>

        {/* Subscription Status */}
        <Card style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <Text style={styles.subscriptionTitle}>Current Subscription</Text>
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionBadgeText}>Active</Text>
            </View>
          </View>
          <View style={styles.subscriptionDetails}>
            <Text style={styles.subscriptionPlan}>
              {subscription?.planType ? subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1) : 'Unknown'} Plan
            </Text>
            <Text style={styles.subscriptionInfo}>
              {subscription?.mealsPerDay || 0} meals/day • {subscription?.portionSize || 'medium'} portion
            </Text>
            <Text style={styles.subscriptionVendor}>
              📍 {subscription?.vendorName}
            </Text>
          </View>
          <Button
            title="Manage Subscription"
            variant="outline"
            size="small"
            onPress={() => router.push('/menu')}
          />
        </Card>

        {/* Dietary Preferences */}
        <Card style={styles.preferencesCard}>
          <Text style={styles.preferencesTitle}>Dietary Preferences</Text>
          <View style={styles.preferencesGrid}>
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Diet Type</Text>
              <Text style={styles.preferenceValue}>
                {user?.preferences.dietType ? user.preferences.dietType.charAt(0).toUpperCase() + user.preferences.dietType.slice(1) : 'Not set'}
              </Text>
            </View>
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Spice Level</Text>
              <Text style={styles.preferenceValue}>
                {user?.preferences.spiceLevel ? user.preferences.spiceLevel.charAt(0).toUpperCase() + user.preferences.spiceLevel.slice(1) : 'Not set'}
              </Text>
            </View>
          </View>
          {user?.preferences.allergies && user.preferences.allergies.length > 0 && (
            <View style={styles.allergiesSection}>
              <Text style={styles.allergiesTitle}>Allergies:</Text>
              <Text style={styles.allergiesText}>
                {user.preferences.allergies.join(', ')}
              </Text>
            </View>
          )}
          <Button
            title="Update Preferences"
            variant="ghost"
            size="small"
            onPress={() => {/* Navigate to preferences */}}
          />
        </Card>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {profileMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={styles.menuItemIcon}>
                  <item.icon size={20} color="#6B7280" />
                </View>
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Community Features */}
        <Card style={styles.communityCard}>
          <Text style={styles.communityTitle}>Community Features</Text>
          <View style={styles.communityActions}>
            <TouchableOpacity 
              style={styles.communityAction}
              onPress={() => router.push('/community')}
            >
              <Text style={styles.communityActionEmoji}>🗳️</Text>
              <Text style={styles.communityActionText}>Recipe Voting</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.communityAction}
              onPress={() => router.push('/nutrition-coach')}
            >
              <Text style={styles.communityActionEmoji}>🧠</Text>
              <Text style={styles.communityActionText}>AI Nutrition Coach</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            variant="outline"
            onPress={handleLogout}
            style={styles.logoutButton}
            textStyle={styles.logoutButtonText}
          />
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>NourishNet v1.0.0</Text>
        </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
  userCard: {
    marginBottom: 16,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F97316',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    padding: 8,
  },
  userStats: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  subscriptionCard: {
    marginBottom: 16,
    backgroundColor: '#FFF7ED',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
  },
  subscriptionBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  subscriptionBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  subscriptionDetails: {
    marginBottom: 12,
  },
  subscriptionPlan: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9A3412',
    marginBottom: 4,
  },
  subscriptionInfo: {
    fontSize: 14,
    color: '#9A3412',
    marginBottom: 4,
  },
  subscriptionVendor: {
    fontSize: 14,
    color: '#9A3412',
  },
  preferencesCard: {
    marginBottom: 16,
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  preferencesGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  preferenceItem: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  preferenceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  preferenceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  allergiesSection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  allergiesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 4,
  },
  allergiesText: {
    fontSize: 14,
    color: '#DC2626',
  },
  menuSection: {
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemInfo: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  communityCard: {
    marginBottom: 16,
    backgroundColor: '#F0FDF4',
  },
  communityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 12,
  },
  communityActions: {
    flexDirection: 'row',
    gap: 12,
  },
  communityAction: {
    flex: 1,
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  communityActionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  communityActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#166534',
    textAlign: 'center',
  },
  logoutSection: {
    marginBottom: 16,
  },
  logoutButton: {
    borderColor: '#EF4444',
  },
  logoutButtonText: {
    color: '#EF4444',
  },
  versionSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});