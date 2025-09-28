import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useSubscription } from '@/context/SubscriptionContext';
import { useAuth } from '@/context/AuthContext';
import { Brain, TrendingUp, Target, Droplets, Activity, Award } from 'lucide-react-native';

interface NutritionAnalysis {
  weeklyCalories: number;
  weeklyProtein: number;
  weeklyCarbs: number;
  weeklyFat: number;
  healthScore: number;
  recommendations: string[];
  achievements: string[];
}

export default function NutritionCoachScreen() {
  const { weeklyMenu, communityImpact, updateHealthStreak } = useSubscription();
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null);
  const [dailyTips, setDailyTips] = useState<string[]>([]);

  useEffect(() => {
    generateNutritionAnalysis();
    generateDailyTips();
  }, [weeklyMenu]);

  const generateNutritionAnalysis = () => {
    // Mock AI analysis based on weekly menu
    const totalCalories = weeklyMenu.reduce((sum, menu) => sum + menu.nutritionInfo.calories, 0);
    const totalProtein = weeklyMenu.reduce((sum, menu) => sum + menu.nutritionInfo.protein, 0);
    const totalCarbs = weeklyMenu.reduce((sum, menu) => sum + menu.nutritionInfo.carbs, 0);
    const totalFat = weeklyMenu.reduce((sum, menu) => sum + menu.nutritionInfo.fat, 0);

    const avgCalories = totalCalories / weeklyMenu.length;
    const healthScore = Math.min(100, Math.max(60, 
      (avgCalories > 600 && avgCalories < 800 ? 85 : 70) +
      (totalProtein > 150 ? 10 : 0) +
      (user?.preferences.dietType === 'veg' ? 5 : 0)
    ));

    const recommendations = [
      avgCalories < 600 ? "Consider increasing portion sizes for better energy levels" : 
      avgCalories > 800 ? "Try reducing portion sizes to maintain healthy weight" : 
      "Your calorie intake is well-balanced!",
      
      totalProtein < 140 ? "Add more protein sources like paneer, dal, or chicken" :
      "Great protein intake! This supports muscle health.",
      
      user?.preferences.spiceLevel === 'spicy' ? "Spicy food can boost metabolism!" :
      "Consider adding mild spices for better digestion",
      
      "Stay hydrated - aim for 8-10 glasses of water daily",
      "Take a 10-minute walk after meals for better digestion"
    ];

    const achievements = [
      communityImpact.healthStreakPoints > 50 ? "🏆 Health Streak Champion" : null,
      totalProtein > 150 ? "💪 Protein Power User" : null,
      user?.preferences.dietType === 'veg' ? "🌱 Plant-Based Warrior" : null,
      weeklyMenu.length >= 5 ? "📅 Consistent Meal Planner" : null,
    ].filter(Boolean) as string[];

    setAnalysis({
      weeklyCalories: totalCalories,
      weeklyProtein: totalProtein,
      weeklyCarbs: totalCarbs,
      weeklyFat: totalFat,
      healthScore,
      recommendations: recommendations.slice(0, 3),
      achievements,
    });
  };

  const generateDailyTips = () => {
    const tips = [
      "🥛 Start your day with a glass of warm water and lemon",
      "🥗 Include colorful vegetables in every meal",
      "🚶‍♂️ Take the stairs instead of the elevator",
      "😴 Aim for 7-8 hours of quality sleep",
      "🧘‍♀️ Practice deep breathing for 5 minutes daily",
      "🥜 Snack on nuts instead of processed foods",
      "🍎 Eat fruits as dessert instead of sweets",
      "💧 Drink water before you feel thirsty",
    ];

    setDailyTips(tips.sort(() => 0.5 - Math.random()).slice(0, 3));
  };

  const handleFollowRecommendation = () => {
    updateHealthStreak(15);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 85) return '#22C55E';
    if (score >= 70) return '#F59E0B';
    return '#EF4444';
  };

  const getHealthScoreText = (score: number) => {
    if (score >= 85) return 'Excellent';
    if (score >= 70) return 'Good';
    return 'Needs Improvement';
  };

  if (!analysis) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Brain size={48} color="#F97316" />
          <Text style={styles.loadingText}>Analyzing your nutrition...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Health Score */}
        <Card style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <Brain size={24} color="#F97316" />
            <Text style={styles.scoreTitle}>Your Health Score</Text>
          </View>
          <View style={styles.scoreContent}>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreNumber, { color: getHealthScoreColor(analysis.healthScore) }]}>
                {analysis.healthScore}
              </Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
            <View style={styles.scoreInfo}>
              <Text style={[styles.scoreStatus, { color: getHealthScoreColor(analysis.healthScore) }]}>
                {getHealthScoreText(analysis.healthScore)}
              </Text>
              <Text style={styles.scoreDescription}>
                Based on your weekly meal analysis
              </Text>
            </View>
          </View>
        </Card>

        {/* Nutrition Breakdown */}
        <Card style={styles.nutritionCard}>
          <Text style={styles.sectionTitle}>Weekly Nutrition Breakdown</Text>
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionEmoji}>🔥</Text>
              <Text style={styles.nutritionValue}>{analysis.weeklyCalories}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionEmoji}>💪</Text>
              <Text style={styles.nutritionValue}>{analysis.weeklyProtein}g</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionEmoji}>🌾</Text>
              <Text style={styles.nutritionValue}>{analysis.weeklyCarbs}g</Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionEmoji}>🥑</Text>
              <Text style={styles.nutritionValue}>{analysis.weeklyFat}g</Text>
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>
        </Card>

        {/* AI Recommendations */}
        <Card style={styles.recommendationsCard}>
          <View style={styles.recommendationsHeader}>
            <Target size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>AI Recommendations</Text>
          </View>
          {analysis.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Text style={styles.recommendationText}>{recommendation}</Text>
              <TouchableOpacity 
                style={styles.followButton}
                onPress={handleFollowRecommendation}
              >
                <Text style={styles.followButtonText}>Follow</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card>

        {/* Daily Tips */}
        <Card style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Droplets size={20} color="#22C55E" />
            <Text style={styles.sectionTitle}>Today's Wellness Tips</Text>
          </View>
          {dailyTips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
          <Button
            title="Get More Tips"
            variant="outline"
            size="small"
            onPress={generateDailyTips}
          />
        </Card>

        {/* Achievements */}
        {analysis.achievements.length > 0 && (
          <Card style={styles.achievementsCard}>
            <View style={styles.achievementsHeader}>
              <Award size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Your Achievements</Text>
            </View>
            <View style={styles.achievementsList}>
              {analysis.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <Text style={styles.achievementText}>{achievement}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Health Streak */}
        <Card style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Activity size={20} color="#F97316" />
            <Text style={styles.sectionTitle}>Health Streak</Text>
          </View>
          <View style={styles.streakContent}>
            <Text style={styles.streakPoints}>{communityImpact.healthStreakPoints}</Text>
            <Text style={styles.streakLabel}>Points Earned</Text>
          </View>
          <Text style={styles.streakDescription}>
            Keep following AI recommendations to build your health streak!
          </Text>
          <View style={styles.streakActions}>
            <Button
              title="View Rewards"
              variant="outline"
              size="small"
              onPress={() => {/* View rewards */}}
            />
            <Button
              title="Share Progress"
              variant="ghost"
              size="small"
              onPress={() => {/* Share progress */}}
            />
          </View>
        </Card>

        {/* Personalized Insights */}
        <Card style={styles.insightsCard}>
          <Text style={styles.sectionTitle}>Personalized Insights</Text>
          <View style={styles.insightsList}>
            <Text style={styles.insightItem}>
              🎯 Your {user?.preferences.dietType} diet is providing balanced nutrition
            </Text>
            <Text style={styles.insightItem}>
              🌶️ {user?.preferences.spiceLevel} spice level may help boost metabolism
            </Text>
            <Text style={styles.insightItem}>
              📊 You're consuming {Math.round(analysis.weeklyCalories / 7)} calories per day on average
            </Text>
            <Text style={styles.insightItem}>
              💡 Consider meal timing for optimal energy throughout the day
            </Text>
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
    paddingTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  scoreCard: {
    marginBottom: 16,
    backgroundColor: '#FFF7ED',
  },
  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F97316',
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreMax: {
    fontSize: 12,
    color: '#6B7280',
  },
  scoreInfo: {
    flex: 1,
  },
  scoreStatus: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 14,
    color: '#9A3412',
  },
  nutritionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  nutritionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  recommendationsCard: {
    marginBottom: 16,
    backgroundColor: '#EFF6FF',
  },
  recommendationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    marginRight: 12,
  },
  followButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  followButtonText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  tipsCard: {
    marginBottom: 16,
    backgroundColor: '#F0FDF4',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipItem: {
    backgroundColor: '#DCFCE7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#166534',
  },
  achievementsCard: {
    marginBottom: 16,
    backgroundColor: '#FFFBEB',
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  achievementsList: {
    gap: 8,
  },
  achievementItem: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
  },
  achievementText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
  },
  streakCard: {
    marginBottom: 16,
    backgroundColor: '#FFF7ED',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  streakContent: {
    alignItems: 'center',
    marginBottom: 12,
  },
  streakPoints: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F97316',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 14,
    color: '#9A3412',
  },
  streakDescription: {
    fontSize: 14,
    color: '#9A3412',
    textAlign: 'center',
    marginBottom: 16,
  },
  streakActions: {
    flexDirection: 'row',
    gap: 12,
  },
  insightsCard: {
    marginBottom: 24,
  },
  insightsList: {
    gap: 8,
  },
  insightItem: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});