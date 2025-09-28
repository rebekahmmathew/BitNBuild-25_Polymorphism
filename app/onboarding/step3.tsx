import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';

export default function Step3Plan() {
  const params = useLocalSearchParams();
  const [planType, setPlanType] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [mealsPerDay, setMealsPerDay] = useState(2);
  const [portionSize, setPortionSize] = useState<'small' | 'medium' | 'large'>('medium');

  const planOptions = [
    { value: 'daily', label: 'Daily', price: 120, description: 'Pay per day', popular: false },
    { value: 'weekly', label: 'Weekly', price: 800, description: '7 days plan', popular: false },
    { value: 'monthly', label: 'Monthly', price: 3000, description: '30 days plan', popular: true },
  ] as const;

  const portionOptions = [
    { value: 'small', label: 'Small', description: 'Light appetite' },
    { value: 'medium', label: 'Medium', description: 'Regular appetite' },
    { value: 'large', label: 'Large', description: 'Heavy appetite' },
  ] as const;

  const handleNext = () => {
    router.push({
      pathname: '/onboarding/step4',
      params: {
        ...params,
        planType,
        mealsPerDay: mealsPerDay.toString(),
        portionSize,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProgressBar currentStep={3} totalSteps={5} title="Subscription Plan" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          <View style={styles.planGrid}>
            {planOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.planCard,
                  planType === option.value && styles.selectedPlan,
                ]}
                onPress={() => setPlanType(option.value)}
                testID={`plan-${option.value}`}
              >
                {option.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
                <Text style={styles.planLabel}>{option.label}</Text>
                <Text style={styles.planPrice}>₹{option.price}</Text>
                <Text style={styles.planDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meals Per Day</Text>
          <View style={styles.mealsRow}>
            {[1, 2, 3].map((count) => (
              <TouchableOpacity
                key={count}
                style={[
                  styles.mealOption,
                  mealsPerDay === count && styles.selectedMeal,
                ]}
                onPress={() => setMealsPerDay(count)}
                testID={`meals-${count}`}
              >
                <Text style={[
                  styles.mealText,
                  mealsPerDay === count && styles.selectedMealText,
                ]}>
                  {count} {count === 1 ? 'Meal' : 'Meals'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portion Size</Text>
          <View style={styles.portionGrid}>
            {portionOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.portionCard,
                  portionSize === option.value && styles.selectedPortion,
                ]}
                onPress={() => setPortionSize(option.value)}
                testID={`portion-${option.value}`}
              >
                <Text style={[
                  styles.portionLabel,
                  portionSize === option.value && styles.selectedPortionText,
                ]}>
                  {option.label}
                </Text>
                <Text style={[
                  styles.portionDescription,
                  portionSize === option.value && styles.selectedPortionText,
                ]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <Button
            title="Next"
            onPress={handleNext}
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  planGrid: {
    gap: 12,
  },
  planCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  selectedPlan: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#F97316',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  planLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  mealsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  mealOption: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  selectedMeal: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  mealText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedMealText: {
    color: '#F97316',
    fontWeight: '600',
  },
  portionGrid: {
    gap: 12,
  },
  portionCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
  },
  selectedPortion: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  portionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  portionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedPortionText: {
    color: '#F97316',
  },
  footer: {
    marginTop: 32,
    marginBottom: 24,
  },
});