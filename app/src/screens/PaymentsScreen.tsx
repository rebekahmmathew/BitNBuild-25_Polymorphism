import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useQuery } from 'react-query';

const { width } = Dimensions.get('window');

interface Transaction {
  id: string;
  type: 'payment' | 'refund' | 'credit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'upi' | 'card' | 'wallet' | 'netbanking';
}

interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'wallet' | 'netbanking';
  name: string;
  details: string;
  isDefault: boolean;
  icon: string;
}

const PaymentsScreen = () => {
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletAmount, setWalletAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const user = useSelector((state: RootState) => state.auth.user);

  // Mock data - in real app, this would come from API
  const walletBalance = 250;
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'payment',
      amount: 500,
      description: 'Weekly Subscription',
      date: '2023-12-15',
      status: 'completed',
      method: 'upi'
    },
    {
      id: '2',
      type: 'refund',
      amount: 80,
      description: 'Skipped Day Refund',
      date: '2023-12-14',
      status: 'completed',
      method: 'wallet'
    },
    {
      id: '3',
      type: 'credit',
      amount: 100,
      description: 'Wallet Top-up',
      date: '2023-12-13',
      status: 'completed',
      method: 'card'
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'upi',
      name: 'UPI',
      details: 'UPI ID: user@paytm',
      isDefault: true,
      icon: 'phone-portrait'
    },
    {
      id: '2',
      type: 'card',
      name: 'Credit Card',
      details: '**** 1234',
      isDefault: false,
      icon: 'card'
    },
    {
      id: '3',
      type: 'wallet',
      name: 'Paytm Wallet',
      details: '₹250.00',
      isDefault: false,
      icon: 'wallet'
    }
  ];

  const handleAddPaymentMethod = () => {
    setShowAddPaymentModal(true);
  };

  const handleTopUpWallet = () => {
    setShowWalletModal(true);
  };

  const handlePayment = (amount: number, description: string) => {
    Alert.alert(
      'Payment Confirmation',
      `Pay ₹${amount} for ${description}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pay Now', onPress: () => processPayment(amount, description) }
      ]
    );
  };

  const processPayment = (amount: number, description: string) => {
    // In real app, this would integrate with Razorpay
    Alert.alert('Success', 'Payment processed successfully!');
  };

  const handleWalletTopUp = () => {
    const amount = parseFloat(walletAmount);
    if (amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    
    Alert.alert(
      'Top-up Wallet',
      `Add ₹${amount} to your wallet?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add Money', onPress: () => {
          setShowWalletModal(false);
          setWalletAmount('');
          Alert.alert('Success', `₹${amount} added to wallet!`);
        }}
      ]
    );
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payment': return 'arrow-down-circle';
      case 'refund': return 'arrow-up-circle';
      case 'credit': return 'add-circle';
      default: return 'help-circle';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'payment': return '#EF4444';
      case 'refund': return '#10B981';
      case 'credit': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'pending': return '#F59E0B';
      case 'failed': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'upi': return 'phone-portrait';
      case 'card': return 'card';
      case 'wallet': return 'wallet';
      case 'netbanking': return 'business';
      default: return 'help-circle';
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Payments & Billing</Text>
        <Text style={styles.subtitle}>Manage your payments and wallet</Text>
      </View>

      {/* Wallet Balance Card */}
      <View style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <Ionicons name="wallet" size={24} color="#3B82F6" />
          <Text style={styles.walletTitle}>Wallet Balance</Text>
        </View>
        <Text style={styles.walletAmount}>₹{walletBalance}</Text>
        <TouchableOpacity style={styles.topUpButton} onPress={handleTopUpWallet}>
          <Ionicons name="add" size={16} color="white" />
          <Text style={styles.topUpButtonText}>Top Up</Text>
        </TouchableOpacity>
      </View>

      {/* Payment Methods */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <TouchableOpacity onPress={handleAddPaymentMethod}>
            <Ionicons name="add-circle" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
        
        {paymentMethods.map((method) => (
          <TouchableOpacity key={method.id} style={styles.paymentMethod}>
            <View style={styles.paymentMethodLeft}>
              <Ionicons name={method.icon as any} size={24} color="#3B82F6" />
              <View style={styles.paymentMethodInfo}>
                <Text style={styles.paymentMethodName}>{method.name}</Text>
                <Text style={styles.paymentMethodDetails}>{method.details}</Text>
              </View>
            </View>
            {method.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultText}>Default</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handlePayment(500, 'Weekly Subscription')}
          >
            <Ionicons name="star" size={24} color="#3B82F6" />
            <Text style={styles.actionText}>Pay Subscription</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handlePayment(100, 'Wallet Top-up')}
          >
            <Ionicons name="wallet" size={24} color="#10B981" />
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionItem}>
            <View style={styles.transactionLeft}>
              <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(transaction.type) + '20' }]}>
                <Ionicons 
                  name={getTransactionIcon(transaction.type) as any} 
                  size={20} 
                  color={getTransactionColor(transaction.type)} 
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
                <View style={styles.transactionMethod}>
                  <Ionicons name={getMethodIcon(transaction.method) as any} size={12} color="#6B7280" />
                  <Text style={styles.transactionMethodText}>{transaction.method.toUpperCase()}</Text>
                </View>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.type === 'payment' ? '#EF4444' : '#10B981' }
              ]}>
                {transaction.type === 'payment' ? '-' : '+'}₹{transaction.amount}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                  {transaction.status.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Add Payment Method Modal */}
      <Modal visible={showAddPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Payment Method</Text>
            <Text style={styles.modalText}>Choose your preferred payment method</Text>
            
            <View style={styles.paymentOptions}>
              <TouchableOpacity style={styles.paymentOption}>
                <Ionicons name="phone-portrait" size={24} color="#3B82F6" />
                <Text style={styles.paymentOptionText}>UPI</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.paymentOption}>
                <Ionicons name="card" size={24} color="#3B82F6" />
                <Text style={styles.paymentOptionText}>Credit/Debit Card</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.paymentOption}>
                <Ionicons name="business" size={24} color="#3B82F6" />
                <Text style={styles.paymentOptionText}>Net Banking</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonSecondary} 
                onPress={() => setShowAddPaymentModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonPrimary} 
                onPress={() => {
                  setShowAddPaymentModal(false);
                  Alert.alert('Success', 'Payment method added successfully!');
                }}
              >
                <Text style={styles.modalButtonPrimaryText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Wallet Top-up Modal */}
      <Modal visible={showWalletModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Top-up Wallet</Text>
            <Text style={styles.modalText}>Enter amount to add to your wallet</Text>
            
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={styles.amountInput}
                value={walletAmount}
                onChangeText={setWalletAmount}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            
            <View style={styles.quickAmounts}>
              <TouchableOpacity 
                style={styles.quickAmountButton}
                onPress={() => setWalletAmount('100')}
              >
                <Text style={styles.quickAmountText}>₹100</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickAmountButton}
                onPress={() => setWalletAmount('500')}
              >
                <Text style={styles.quickAmountText}>₹500</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickAmountButton}
                onPress={() => setWalletAmount('1000')}
              >
                <Text style={styles.quickAmountText}>₹1000</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonSecondary} 
                onPress={() => setShowWalletModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonPrimary} 
                onPress={handleWalletTopUp}
              >
                <Text style={styles.modalButtonPrimaryText}>Add Money</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  walletCard: {
    margin: 20,
    padding: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 12,
  },
  walletAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 20,
  },
  topUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  topUpButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodInfo: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  paymentMethodDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  defaultBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
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
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  transactionMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionMethodText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  paymentOptions: {
    marginBottom: 24,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 8,
  },
  paymentOptionText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    paddingVertical: 16,
  },
  quickAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAmountButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default PaymentsScreen;
