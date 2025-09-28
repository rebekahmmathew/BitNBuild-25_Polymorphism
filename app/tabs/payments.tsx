import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useSubscription } from '@/context/SubscriptionContext';
import { CreditCard, Wallet, History, Settings, Download, RefreshCw } from 'lucide-react-native';

export default function PaymentsScreen() {
  const { subscription } = useSubscription();
  const [autoRenew, setAutoRenew] = useState<boolean>(subscription?.autoRenew || true);
  const [walletBalance] = useState(250);

  const transactions = [
    {
      id: 'txn_001',
      type: 'payment',
      amount: 3000,
      description: 'Monthly Subscription - January 2024',
      date: '2024-01-01',
      status: 'completed',
    },
    {
      id: 'txn_002',
      type: 'refund',
      amount: 120,
      description: 'Refund for skipped day',
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: 'txn_003',
      type: 'payment',
      amount: 240,
      description: 'Extra meals - Weekend',
      date: '2024-01-20',
      status: 'completed',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment': return '💳';
      case 'refund': return '💰';
      default: return '📄';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'payment': return '#EF4444';
      case 'refund': return '#22C55E';
      default: return '#6B7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Payments</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Wallet Balance */}
        <Card style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <Wallet size={24} color="#F97316" />
            <Text style={styles.walletTitle}>Wallet Balance</Text>
          </View>
          <Text style={styles.walletBalance}>₹{walletBalance}</Text>
          <View style={styles.walletActions}>
            <Button
              title="Add Money"
              size="small"
              onPress={() => {/* Add money */}}
            />
            <Button
              title="Withdraw"
              variant="outline"
              size="small"
              onPress={() => {/* Withdraw */}}
            />
          </View>
        </Card>

        {/* Current Subscription */}
        <Card style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <CreditCard size={20} color="#3B82F6" />
            <Text style={styles.subscriptionTitle}>Current Subscription</Text>
          </View>
          
          <View style={styles.subscriptionDetails}>
            <View style={styles.subscriptionRow}>
              <Text style={styles.subscriptionLabel}>Plan:</Text>
              <Text style={styles.subscriptionValue}>
                {subscription?.planType ? subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1) : 'Unknown'}
              </Text>
            </View>
            <View style={styles.subscriptionRow}>
              <Text style={styles.subscriptionLabel}>Amount:</Text>
              <Text style={styles.subscriptionValue}>₹{subscription?.price}</Text>
            </View>
            <View style={styles.subscriptionRow}>
              <Text style={styles.subscriptionLabel}>Next billing:</Text>
              <Text style={styles.subscriptionValue}>Feb 1, 2024</Text>
            </View>
          </View>

          <View style={styles.autoRenewSection}>
            <View style={styles.autoRenewHeader}>
              <RefreshCw size={16} color="#6B7280" />
              <Text style={styles.autoRenewLabel}>Auto-renewal</Text>
            </View>
            <Switch
              value={autoRenew}
              onValueChange={setAutoRenew}
              trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
              thumbColor={autoRenew ? '#F97316' : '#9CA3AF'}
            />
          </View>
        </Card>

        {/* Payment Methods */}
        <Card style={styles.paymentMethodsCard}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          
          <TouchableOpacity style={styles.paymentMethod}>
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodIcon}>💳</Text>
              <View>
                <Text style={styles.paymentMethodName}>Razorpay</Text>
                <Text style={styles.paymentMethodDescription}>UPI, Cards, Net Banking</Text>
              </View>
            </View>
            <Text style={styles.paymentMethodStatus}>Default</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentMethod}>
            <View style={styles.paymentMethodInfo}>
              <Text style={styles.paymentMethodIcon}>👛</Text>
              <View>
                <Text style={styles.paymentMethodName}>Wallet</Text>
                <Text style={styles.paymentMethodDescription}>Use wallet balance</Text>
              </View>
            </View>
          </TouchableOpacity>

          <Button
            title="Add Payment Method"
            variant="outline"
            size="small"
            onPress={() => {/* Add payment method */}}
          />
        </Card>

        {/* Transaction History */}
        <Card style={styles.transactionCard}>
          <View style={styles.transactionHeader}>
            <View style={styles.transactionTitleSection}>
              <History size={20} color="#6B7280" />
              <Text style={styles.sectionTitle}>Transaction History</Text>
            </View>
            <TouchableOpacity>
              <Download size={16} color="#F97316" />
            </TouchableOpacity>
          </View>

          <View style={styles.transactionList}>
            {transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <Text style={styles.transactionIcon}>
                    {getTransactionIcon(transaction.type)}
                  </Text>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionDate}>
                      {formatDate(transaction.date)}
                    </Text>
                  </View>
                </View>
                <View style={styles.transactionRight}>
                  <Text style={[
                    styles.transactionAmount,
                    { color: getTransactionColor(transaction.type) }
                  ]}>
                    {transaction.type === 'refund' ? '+' : '-'}₹{transaction.amount}
                  </Text>
                  <View style={styles.transactionStatus}>
                    <Text style={styles.transactionStatusText}>
                      {transaction.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <Button
            title="View All Transactions"
            variant="ghost"
            size="small"
            onPress={() => {/* View all transactions */}}
          />
        </Card>

        {/* Billing Information */}
        <Card style={styles.billingCard}>
          <Text style={styles.sectionTitle}>Billing Information</Text>
          
          <View style={styles.billingInfo}>
            <Text style={styles.billingText}>
              📧 Bills are sent to your registered email
            </Text>
            <Text style={styles.billingText}>
              📱 SMS notifications for all transactions
            </Text>
            <Text style={styles.billingText}>
              🔒 All payments are secured with 256-bit encryption
            </Text>
          </View>

          <Button
            title="Update Billing Details"
            variant="outline"
            size="small"
            onPress={() => {/* Update billing */}}
          />
        </Card>

        {/* Help Section */}
        <Card style={styles.helpCard}>
          <Text style={styles.helpTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            Having issues with payments or billing? Our support team is here to help.
          </Text>
          <View style={styles.helpActions}>
            <Button
              title="Contact Support"
              variant="outline"
              size="small"
              onPress={() => {/* Contact support */}}
            />
            <Button
              title="FAQ"
              variant="ghost"
              size="small"
              onPress={() => {/* Open FAQ */}}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
  settingsButton: {
    padding: 8,
  },
  walletCard: {
    marginBottom: 16,
    backgroundColor: '#FFF7ED',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  walletTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
  },
  walletBalance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 16,
  },
  walletActions: {
    flexDirection: 'row',
    gap: 12,
  },
  subscriptionCard: {
    marginBottom: 16,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  subscriptionDetails: {
    gap: 8,
    marginBottom: 16,
  },
  subscriptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subscriptionLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  subscriptionValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  autoRenewSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  autoRenewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  autoRenewLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  paymentMethodsCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  paymentMethodIcon: {
    fontSize: 20,
  },
  paymentMethodName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 12,
    color: '#6B7280',
  },
  paymentMethodStatus: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: '500',
  },
  transactionCard: {
    marginBottom: 16,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  transactionList: {
    gap: 12,
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionIcon: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionStatus: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  transactionStatusText: {
    fontSize: 10,
    color: '#166534',
    fontWeight: '500',
  },
  billingCard: {
    marginBottom: 16,
  },
  billingInfo: {
    gap: 8,
    marginBottom: 16,
  },
  billingText: {
    fontSize: 14,
    color: '#6B7280',
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