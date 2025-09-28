import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useSubscription } from '@/context/SubscriptionContext';
import { Calendar, Clock, Utensils, Heart } from 'lucide-react-native';
import { router } from 'expo-router';

export default function MenuScreen() {
  const { subscription, weeklyMenu, pauseSubscription } = useSubscription();
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [showPauseOptions, setShowPauseOptions] = useState(false);

  const toggleDateSelection = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handlePauseSubscription = async (donate: boolean = false) => {
    if (selectedDates.length === 0) return;
    
    await pauseSubscription(selectedDates, donate);
    setSelectedDates([]);
    setShowPauseOptions(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isToday = (dateString: string) => {
    return new Date(dateString).toDateString() === new Date().toDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Weekly Menu</Text>
          <TouchableOpacity 
            style={styles.pauseButton}
            onPress={() => setShowPauseOptions(!showPauseOptions)}
          >
            <Text style={styles.pauseButtonText}>Manage Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Subscription Info */}
        <Card style={styles.subscriptionCard}>
          <View style={styles.subscriptionHeader}>
            <Utensils size={20} color="#F97316" />
            <Text style={styles.subscriptionTitle}>Active Subscription</Text>
          </View>
          <View style={styles.subscriptionDetails}>
            <Text style={styles.subscriptionText}>
              {subscription?.planType ? subscription.planType.charAt(0).toUpperCase() + subscription.planType.slice(1) : 'Unknown'} Plan
            </Text>
            <Text style={styles.subscriptionText}>
              {subscription?.mealsPerDay || 0} meals/day • {subscription?.portionSize || 'medium'} portion
            </Text>
            <Text style={styles.subscriptionText}>
              Delivery at {subscription?.deliveryTime}
            </Text>
          </View>
        </Card>

        {/* Pause Options */}
        {showPauseOptions && (
          <Card style={styles.pauseOptionsCard}>
            <Text style={styles.pauseOptionsTitle}>Select dates to pause:</Text>
            <Text style={styles.pauseOptionsSubtitle}>
              Tap on the dates below to select them
            </Text>
            <Button
              title="Open Calendar"
              onPress={() => router.push('/tabs/pause')}
              variant="outline"
              size="small"
            />
            
            {selectedDates.length > 0 && (
              <View style={styles.pauseActions}>
                <Button
                  title={`Pause ${selectedDates.length} day(s)`}
                  onPress={() => handlePauseSubscription(false)}
                  variant="outline"
                  size="small"
                />
                <Button
                  title={`Pause & Donate ${selectedDates.length} meal(s)`}
                  onPress={() => handlePauseSubscription(true)}
                  variant="secondary"
                  size="small"
                />
              </View>
            )}
          </Card>
        )}

        {/* Weekly Menu */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>This Week's Menu</Text>
          
          {weeklyMenu.map((menu, index) => (
            <TouchableOpacity
              key={menu.date}
              style={[
                styles.menuCard,
                isToday(menu.date) && styles.todayCard,
                selectedDates.includes(menu.date) && styles.selectedCard,
              ]}
              onPress={() => showPauseOptions && toggleDateSelection(menu.date)}
              disabled={!showPauseOptions}
            >
              <View style={styles.menuHeader}>
                <View style={styles.dateSection}>
                  <Calendar size={16} color={isToday(menu.date) ? "#F97316" : "#6B7280"} />
                  <Text style={[
                    styles.dateText,
                    isToday(menu.date) && styles.todayText,
                  ]}>
                    {formatDate(menu.date)}
                  </Text>
                  {isToday(menu.date) && (
                    <View style={styles.todayBadge}>
                      <Text style={styles.todayBadgeText}>Today</Text>
                    </View>
                  )}
                </View>
                
                {selectedDates.includes(menu.date) && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>Selected</Text>
                  </View>
                )}
              </View>

              <View style={styles.menuOptions}>
                <View style={styles.menuOption}>
                  <Text style={styles.menuOptionLabel}>🥗 Vegetarian</Text>
                  <Text style={styles.menuOptionText}>{menu.vegOption}</Text>
                </View>

                {menu.nonVegOption && (
                  <View style={styles.menuOption}>
                    <Text style={styles.menuOptionLabel}>🍗 Non-Vegetarian</Text>
                    <Text style={styles.menuOptionText}>{menu.nonVegOption}</Text>
                  </View>
                )}

                {menu.specialDish && (
                  <View style={styles.specialDish}>
                    <Text style={styles.specialDishText}>✨ Special: {menu.specialDish}</Text>
                  </View>
                )}
              </View>

              <View style={styles.nutritionBar}>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Calories</Text>
                  <Text style={styles.nutritionValue}>{menu.nutritionInfo.calories}</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Protein</Text>
                  <Text style={styles.nutritionValue}>{menu.nutritionInfo.protein}g</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Carbs</Text>
                  <Text style={styles.nutritionValue}>{menu.nutritionInfo.carbs}g</Text>
                </View>
                <View style={styles.nutritionItem}>
                  <Text style={styles.nutritionLabel}>Fat</Text>
                  <Text style={styles.nutritionValue}>{menu.nutritionInfo.fat}g</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Menu Preferences */}
        <Card style={styles.preferencesCard}>
          <View style={styles.preferencesHeader}>
            <Heart size={20} color="#EF4444" />
            <Text style={styles.preferencesTitle}>Your Preferences</Text>
          </View>
          <Text style={styles.preferencesText}>
            All meals are prepared according to your dietary preferences and spice level.
          </Text>
          <Button
            title="Update Preferences"
            variant="outline"
            size="small"
            onPress={() => {/* Navigate to preferences */}}
          />
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
  pauseButton: {
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  pauseButtonText: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '500',
  },
  subscriptionCard: {
    marginBottom: 16,
    backgroundColor: '#FFF7ED',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  subscriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
  },
  subscriptionDetails: {
    gap: 4,
  },
  subscriptionText: {
    fontSize: 14,
    color: '#9A3412',
  },
  pauseOptionsCard: {
    marginBottom: 16,
    backgroundColor: '#F0FDF4',
  },
  pauseOptionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 4,
  },
  pauseOptionsSubtitle: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 12,
  },
  pauseActions: {
    flexDirection: 'row',
    gap: 8,
  },
  menuSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  todayCard: {
    borderColor: '#F97316',
    backgroundColor: '#FFF7ED',
  },
  selectedCard: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  todayText: {
    color: '#F97316',
  },
  todayBadge: {
    backgroundColor: '#F97316',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  todayBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  selectedBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  selectedBadgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  menuOptions: {
    gap: 8,
    marginBottom: 12,
  },
  menuOption: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
  },
  menuOptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  menuOptionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  specialDish: {
    backgroundColor: '#FFF7ED',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  specialDishText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F97316',
  },
  nutritionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 8,
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  nutritionValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  preferencesCard: {
    marginBottom: 24,
  },
  preferencesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  preferencesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  preferencesText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
});