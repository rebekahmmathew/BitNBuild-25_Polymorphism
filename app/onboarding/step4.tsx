import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';

export default function Step4Timing() {
  const params = useLocalSearchParams();
  const [deliveryTime, setDeliveryTime] = useState('12:30 PM');
  const [isFlexible, setIsFlexible] = useState(true);

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM'
  ];

  const handleNext = () => {
    router.push({
      pathname: '/onboarding/step5',
      params: {
        ...params,
        deliveryTime,
        isFlexible: isFlexible.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ProgressBar currentStep={4} totalSteps={5} title="Delivery Timing" />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferred Delivery Time</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeSlot,
                  deliveryTime === time && styles.selectedTime,
                ]}
                onPress={() => setDeliveryTime(time)}
                testID={`time-${time}`}
              >
                <Text style={[
                  styles.timeText,
                  deliveryTime === time && styles.selectedTimeText,
                ]}>
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.flexibilityCard}>
            <View style={styles.flexibilityHeader}>
              <Text style={styles.flexibilityTitle}>Flexible Delivery</Text>
              <Switch
                value={isFlexible}
                onValueChange={setIsFlexible}
                trackColor={{ false: '#E5E7EB', true: '#FED7AA' }}
                thumbColor={isFlexible ? '#F97316' : '#9CA3AF'}
                testID="flexibility-switch"
              />
            </View>
            <Text style={styles.flexibilityDescription}>
              Allow delivery within ±30 minutes of your preferred time for better service
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Instructions</Text>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionsText}>
              • Our delivery partner will call you before arriving
            </Text>
            <Text style={styles.instructionsText}>
              • Please be available during your selected time slot
            </Text>
            <Text style={styles.instructionsText}>
              • You can track your delivery in real-time
            </Text>
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
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedTime: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedTimeText: {
    color: '#F97316',
    fontWeight: '600',
  },
  flexibilityCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  flexibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  flexibilityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  flexibilityDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  instructionsCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
  },
  footer: {
    marginTop: 32,
    marginBottom: 24,
  },
});