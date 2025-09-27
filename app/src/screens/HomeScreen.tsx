import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { RootState } from '../store/store'

const HomeScreen = ({ navigation }: any) => {
  const { user } = useSelector((state: RootState) => state.auth)

  const quickActions = [
    {
      title: 'Today\'s Menu',
      icon: 'restaurant',
      color: '#10b981',
      onPress: () => navigation.navigate('Menu')
    },
    {
      title: 'Track Delivery',
      icon: 'location',
      color: '#0ea5e9',
      onPress: () => navigation.navigate('Tracking')
    },
    {
      title: 'My Subscription',
      icon: 'card',
      color: '#f59e0b',
      onPress: () => navigation.navigate('Subscription')
    },
    {
      title: 'Order History',
      icon: 'time',
      color: '#8b5cf6',
      onPress: () => {}
    }
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, {user?.name}!</Text>
        <Text style={styles.subtitle}>What would you like to do today?</Text>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.actionCard, { backgroundColor: action.color }]}
              onPress={action.onPress}
            >
              <Ionicons name={action.icon as any} size={24} color="white" />
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.sectionTitle}>Current Status</Text>
        <View style={styles.statusItem}>
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <Text style={styles.statusText}>Subscription Active</Text>
        </View>
        <View style={styles.statusItem}>
          <Ionicons name="time" size={20} color="#f59e0b" />
          <Text style={styles.statusText}>Next delivery: Tomorrow 12:00 PM</Text>
        </View>
      </View>

      <View style={styles.recentActivity}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityItem}>
          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          <Text style={styles.activityText}>Order delivered successfully</Text>
          <Text style={styles.activityTime}>2 hours ago</Text>
        </View>
        <View style={styles.activityItem}>
          <Ionicons name="restaurant" size={16} color="#0ea5e9" />
          <Text style={styles.activityText}>Menu updated for today</Text>
          <Text style={styles.activityTime}>1 day ago</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
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
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#64748b',
  },
  recentActivity: {
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#64748b',
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
})

export default HomeScreen
