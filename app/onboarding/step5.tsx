import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { Card } from '@/components/Card';

export default function Step5Payment() {
  const params = useLocalSearchParams();
  const [autoRenew, setAutoRenew] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const planPrice = params.planType === 'daily' ? 120 : 
                   params.planType === 'weekly' ? 800 : 3000;

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Mock payment processing
    setTimeout(() => {
      setIsProcessing(false);
      router.push({
        pathname: '/onboarding/success',
        params: {
          ...params,
          autoRenew: autoRenew.toString(),
        },
      });
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProgressBar currentStep={5} totalSteps={5} title="Payment & Confirmation" />

        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Plan:</Text>
            <Text style={styles.summaryValue}>
              {typeof params.planType === 'string' ? params.planType.charAt(0).toUpperCase() + params.planType.slice(1) : 'Unknown'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Meals per day:</Text>
            <Text style={styles.summaryValue}>{params.mealsPerDay}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Portion size:</Text>
            <Text style={styles.summaryValue}>
              {typeof params.portionSize === 'string' ? params.portionSize.charAt(0).toUpperCase() + params.portionSize.slice(1) : 'Unknown'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery time:</Text>
            <Text style={styles.summaryValue}>{params.deliveryTime}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount:</Text>
            <Text style={styles.totalValue}>₹{planPrice}</Text>
          </View>
        </Card>

        <Card style={styles.autoRenewCard}>
          <View style={styles.autoRenewHeader}>
            <Text style={styles.autoRenewTitle}>Auto-Renewal</Text>
            <Switch
              value={autoRenew}
              onValueChange={setAutoRenew}
              trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
              thumbColor={autoRenew ? '#F97316' : '#9CA3AF'}
              testID="auto-renew-switch"
            />
          </View>
          <Text style={styles.autoRenewDescription}>
            Automatically renew your subscription to avoid interruption in service
          </Text>
        </Card>

        <Card style={styles.paymentCard}>
          <Text style={styles.paymentTitle}>Payment Method</Text>
          <View style={styles.paymentMethod}>
            <Text style={styles.paymentMethodText}>💳 Razorpay (Demo)</Text>
            <Text style={styles.paymentMethodSubtext}>
              Secure payment via UPI, Cards, Net Banking
            </Text>
          </View>
        </Card>

        <View style={styles.footer}>
          <Button
            title={isProcessing ? "Processing Payment..." : `Pay ₹${planPrice}`}
            onPress={handlePayment}
            disabled={isProcessing}
            testID="pay-button"
          />
          
          <Text style={styles.disclaimer}>
            By proceeding, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    marginTop: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F97316',
  },
  autoRenewCard: {
    marginTop: 16,
  },
  autoRenewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  autoRenewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  autoRenewDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  paymentCard: {
    marginTop: 16,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  paymentMethod: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  paymentMethodSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  footer: {
    marginTop: 32,
    marginBottom: 24,
  },
  disclaimer: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 18,
  },
});