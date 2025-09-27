import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const SubscriptionScreen = () => {
  const [selectedPlan, setSelectedPlan] = useState('weekly')
  const [isSubscribed, setIsSubscribed] = useState(true)

  const plans = [
    {
      id: 'daily',
      name: 'Daily Plan',
      price: 80,
      description: 'Fresh meals every day',
      features: ['Daily delivery', 'Flexible timing', 'Cancel anytime']
    },
    {
      id: 'weekly',
      name: 'Weekly Plan',
      price: 500,
      description: 'Best value for regular customers',
      features: ['7 days delivery', '10% discount', 'Priority support']
    },
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 1800,
      description: 'Maximum savings',
      features: ['30 days delivery', '20% discount', 'Free delivery']
    }
  ]

  const handleSubscribe = () => {
    Alert.alert(
      'Subscribe',
      `Are you sure you want to subscribe to the ${plans.find(p => p.id === selectedPlan)?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Subscribe', onPress: () => setIsSubscribed(true) }
      ]
    )
  }

  const handlePause = () => {
    Alert.alert(
      'Pause Subscription',
      'Your subscription will be paused. You can resume anytime.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pause', onPress: () => {} }
      ]
    )
  }

  const handleCancel = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription?',
      [
        { text: 'Keep Subscription', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => setIsSubscribed(false) }
      ]
    )
  }

  if (isSubscribed) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text style={styles.statusTitle}>Active Subscription</Text>
            </View>
            <Text style={styles.statusDescription}>
              You're subscribed to the Weekly Plan
            </Text>
          </View>
        </View>

        <View style={styles.subscriptionDetails}>
          <Text style={styles.sectionTitle}>Subscription Details</Text>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Plan</Text>
            <Text style={styles.detailValue}>Weekly Plan</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Price</Text>
            <Text style={styles.detailValue}>₹500/week</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Next Billing</Text>
            <Text style={styles.detailValue}>Dec 15, 2023</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={[styles.detailValue, { color: '#10b981' }]}>Active</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.pauseButton} onPress={handlePause}>
            <Ionicons name="pause" size={20} color="#f59e0b" />
            <Text style={styles.pauseButtonText}>Pause Subscription</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Ionicons name="close-circle" size={20} color="#ef4444" />
            <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>Select the perfect plan for your needs</Text>
      </View>

      <View style={styles.plansContainer}>
        {plans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.selectedPlan
            ]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planPrice}>₹{plan.price}</Text>
            </View>
            
            <Text style={styles.planDescription}>{plan.description}</Text>
            
            <View style={styles.featuresContainer}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark" size={16} color="#10b981" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            
            {selectedPlan === plan.id && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark-circle" size={20} color="#0ea5e9" />
                <Text style={styles.selectedText}>Selected</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.subscribeContainer}>
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>
            Subscribe to {plans.find(p => p.id === selectedPlan)?.name}
          </Text>
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
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  statusCard: {
    backgroundColor: 'white',
    padding: 20,
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
    marginBottom: 8,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
  },
  statusDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  subscriptionDetails: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  actionsContainer: {
    padding: 20,
  },
  pauseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  pauseButtonText: {
    color: '#f59e0b',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    padding: 16,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  plansContainer: {
    padding: 20,
  },
  planCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedPlan: {
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  planDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 8,
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    padding: 8,
    borderRadius: 6,
  },
  selectedText: {
    color: '#0ea5e9',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  subscribeContainer: {
    padding: 20,
  },
  subscribeButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default SubscriptionScreen
