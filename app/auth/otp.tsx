import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useAuth } from '@/context/AuthContext';

export default function OTPScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const { login } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP');
      return;
    }

    setIsLoading(true);
    const result = await login(phone || '', otp);
    setIsLoading(false);

    if (!result.success) {
      Alert.alert('Error', result.error || 'Invalid OTP');
    }
  };

  const handleResendOTP = () => {
    if (timer > 0) return;
    
    setTimer(30);
    Alert.alert('Success', 'OTP sent successfully');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            We've sent a 4-digit code to {phone}
          </Text>
          <Text style={styles.hint}>
            (Use 1234 for demo)
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Enter OTP"
            placeholder="1234"
            value={otp}
            onChangeText={setOTP}
            keyboardType="number-pad"
            maxLength={4}
            testID="otp-input"
          />

          <Button
            title={isLoading ? "Verifying..." : "Verify OTP"}
            onPress={handleVerifyOTP}
            disabled={isLoading}
            testID="verify-otp-button"
          />

          <Button
            title={timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            onPress={handleResendOTP}
            variant="ghost"
            disabled={timer > 0}
            testID="resend-otp-button"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '600',
  },
  form: {
    gap: 16,
  },
});