import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ProgressBar } from '@/components/ProgressBar';
import { Card } from '@/components/Card';

export default function Step2Preferences() {
  const params = useLocalSearchParams();
  const [dietType, setDietType] = useState<'veg' | 'non-veg' | 'jain' | 'vegan'>('veg');
  const [spiceLevel, setSpiceLevel] = useState<'mild' | 'medium' | 'spicy'>('medium');
  const [allergies, setAllergies] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState('');

  const dietOptions = [
    { value: 'veg', label: 'Vegetarian', emoji: '🥬' },
    { value: 'non-veg', label: 'Non-Vegetarian', emoji: '🍗' },
    { value: 'jain', label: 'Jain', emoji: '🙏' },
    { value: 'vegan', label: 'Vegan', emoji: '🌱' },
  ] as const;

  const spiceOptions = [
    { value: 'mild', label: 'Mild', emoji: '😊' },
    { value: 'medium', label: 'Medium', emoji: '🌶️' },
    { value: 'spicy', label: 'Spicy', emoji: '🔥' },
  ] as const;

  const allergyOptions = [
    'Nuts', 'Dairy', 'Gluten', 'Soy', 'Eggs', 'Seafood', 'Sesame', 'Mustard'
  ];

  const toggleAllergy = (allergy: string) => {
    setAllergies(prev => 
      prev.includes(allergy) 
        ? prev.filter(a => a !== allergy)
        : [...prev, allergy]
    );
  };

  const handleNext = () => {
    router.push({
      pathname: '/onboarding/step3',
      params: {
        ...params,
        dietType,
        spiceLevel,
        allergies: JSON.stringify(allergies),
        customNotes,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProgressBar currentStep={2} totalSteps={5} title="Meal Preferences" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diet Type</Text>
          <View style={styles.optionsGrid}>
            {dietOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionCard,
                  dietType === option.value && styles.selectedOption,
                ]}
                onPress={() => setDietType(option.value)}
                testID={`diet-${option.value}`}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text style={[
                  styles.optionText,
                  dietType === option.value && styles.selectedOptionText,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spice Level</Text>
          <View style={styles.optionsRow}>
            {spiceOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionCard,
                  spiceLevel === option.value && styles.selectedOption,
                ]}
                onPress={() => setSpiceLevel(option.value)}
                testID={`spice-${option.value}`}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text style={[
                  styles.optionText,
                  spiceLevel === option.value && styles.selectedOptionText,
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allergies (Optional)</Text>
          <View style={styles.allergiesGrid}>
            {allergyOptions.map((allergy) => (
              <TouchableOpacity
                key={allergy}
                style={[
                  styles.allergyChip,
                  allergies.includes(allergy) && styles.selectedAllergy,
                ]}
                onPress={() => toggleAllergy(allergy)}
                testID={`allergy-${allergy}`}
              >
                <Text style={[
                  styles.allergyText,
                  allergies.includes(allergy) && styles.selectedAllergyText,
                ]}>
                  {allergy}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Input
            label="Special Instructions (Optional)"
            placeholder="Any special dietary requirements or preferences..."
            value={customNotes}
            onChangeText={setCustomNotes}
            multiline
            numberOfLines={3}
            testID="custom-notes-input"
          />
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 100,
  },
  selectedOption: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#F97316',
    fontWeight: '600',
  },
  allergiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergyChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedAllergy: {
    backgroundColor: '#FFF7ED',
    borderColor: '#F97316',
  },
  allergyText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedAllergyText: {
    color: '#F97316',
    fontWeight: '500',
  },
  footer: {
    marginTop: 32,
    marginBottom: 24,
  },
});