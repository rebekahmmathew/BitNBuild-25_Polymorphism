import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ProgressBar } from '@/components/ProgressBar';

export default function Step1Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');

  const handleNext = () => {
    if (!name.trim() || !address.trim()) {
      return;
    }

    router.push({
      pathname: '/onboarding/step2',
      params: {
        name,
        email,
        address,
        landmark,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProgressBar currentStep={1} totalSteps={5} title="Personal Information" />

        <View style={styles.form}>
          <Input
            label="Full Name *"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            testID="name-input"
          />

          <Input
            label="Email (Optional)"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            testID="email-input"
          />

          <Input
            label="Delivery Address *"
            placeholder="Enter your complete address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
            testID="address-input"
          />

          <Input
            label="Landmark (Optional)"
            placeholder="Nearby landmark for easy delivery"
            value={landmark}
            onChangeText={setLandmark}
            testID="landmark-input"
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Next"
            onPress={handleNext}
            disabled={!name.trim() || !address.trim()}
            testID="next-button"
          />
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
  form: {
    marginTop: 24,
    gap: 8,
  },
  footer: {
    marginTop: 32,
    marginBottom: 24,
  },
});