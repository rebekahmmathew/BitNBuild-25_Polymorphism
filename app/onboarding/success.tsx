import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { User, Address, MealPreferences } from '@/context/AuthContext';

export default function SuccessScreen() {
  const params = useLocalSearchParams();
  const { completeOnboarding } = useAuth();

  useEffect(() => {
    // Auto-complete onboarding after 3 seconds
    const timer = setTimeout(() => {
      handleComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    const userData: User = {
      id: `user_${Date.now()}`,
      name: params.name as string,
      phone: '9876543210', // This would come from auth context
      email: params.email as string,
      addresses: [{
        id: 'addr_1',
        label: 'Home',
        address: params.address as string,
        landmark: params.landmark as string,
        isDefault: true,
      }] as Address[],
      preferences: {
        dietType: params.dietType as 'veg' | 'non-veg' | 'jain' | 'vegan',
        spiceLevel: params.spiceLevel as 'mild' | 'medium' | 'spicy',
        allergies: JSON.parse(params.allergies as string || '[]'),
        customNotes: params.customNotes as string,
      } as MealPreferences,
    };

    completeOnboarding(userData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.checkmark}>✅</Text>
        </View>

        <Text style={styles.title}>Welcome to NourishNet!</Text>
        <Text style={styles.subtitle}>
          Your subscription has been activated successfully
        </Text>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Your First Delivery</Text>
          <Text style={styles.detailsText}>
            📅 Tomorrow at {params.deliveryTime}
          </Text>
          <Text style={styles.detailsText}>
            🍽️ {params.mealsPerDay} delicious {params.portionSize} meals
          </Text>
          <Text style={styles.detailsText}>
            🥗 {typeof params.dietType === 'string' ? params.dietType.charAt(0).toUpperCase() + params.dietType.slice(1) : 'Unknown'} options
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title="Start Exploring"
            onPress={handleComplete}
            testID="start-exploring-button"
          />
          
          <Text style={styles.autoRedirect}>
            Redirecting automatically in 3 seconds...
          </Text>
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
    alignItems: 'center',
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  checkmark: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  detailsText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  autoRedirect: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 16,
    textAlign: 'center',
  },
});