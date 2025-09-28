import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useSubscription } from '@/context/SubscriptionContext';
import { ThumbsUp, ThumbsDown, Plus, TrendingUp, Users, Award } from 'lucide-react-native';

interface Recipe {
  id: string;
  title: string;
  description: string;
  votes: number;
  userVoted: boolean;
  category: 'veg' | 'non-veg';
  submittedBy: string;
  submittedAt: string;
}

export default function CommunityScreen() {
  const { communityImpact, updateHealthStreak } = useSubscription();
  const [activeTab, setActiveTab] = useState<'vote' | 'suggest'>('vote');
  const [newRecipe, setNewRecipe] = useState({ title: '', description: '', category: 'veg' as 'veg' | 'non-veg' });

  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      title: 'Quinoa Biryani',
      description: 'A healthy twist on traditional biryani using quinoa instead of rice',
      votes: 45,
      userVoted: false,
      category: 'veg',
      submittedBy: 'Priya S.',
      submittedAt: '2024-01-10',
    },
    {
      id: '2',
      title: 'Grilled Chicken Tikka Bowl',
      description: 'Protein-rich grilled chicken with mixed vegetables and mint chutney',
      votes: 38,
      userVoted: true,
      category: 'non-veg',
      submittedBy: 'Rahul K.',
      submittedAt: '2024-01-12',
    },
    {
      id: '3',
      title: 'Millet Khichdi',
      description: 'Nutritious millet-based khichdi with seasonal vegetables',
      votes: 29,
      userVoted: false,
      category: 'veg',
      submittedBy: 'Anjali M.',
      submittedAt: '2024-01-14',
    },
  ]);

  const handleVote = (recipeId: string) => {
    setRecipes(prev => prev.map(recipe => {
      if (recipe.id === recipeId) {
        const newVotes = recipe.userVoted ? recipe.votes - 1 : recipe.votes + 1;
        return { ...recipe, votes: newVotes, userVoted: !recipe.userVoted };
      }
      return recipe;
    }));

    // Award health streak points for community participation
    updateHealthStreak(5);
  };

  const handleSubmitRecipe = () => {
    if (!newRecipe.title.trim() || !newRecipe.description.trim()) return;

    const recipe: Recipe = {
      id: Date.now().toString(),
      title: newRecipe.title,
      description: newRecipe.description,
      votes: 1,
      userVoted: true,
      category: newRecipe.category,
      submittedBy: 'You',
      submittedAt: new Date().toISOString().split('T')[0],
    };

    setRecipes(prev => [recipe, ...prev]);
    setNewRecipe({ title: '', description: '', category: 'veg' });
    
    // Award health streak points for contributing
    updateHealthStreak(10);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Community Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Users size={20} color="#166534" />
            <Text style={styles.statsTitle}>Community Impact</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{communityImpact.mealsDonated}</Text>
              <Text style={styles.statLabel}>Meals Donated</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{communityImpact.loyaltyPoints}</Text>
              <Text style={styles.statLabel}>Foodie Credits</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{recipes.length}</Text>
              <Text style={styles.statLabel}>Recipe Suggestions</Text>
            </View>
          </View>
        </Card>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'vote' && styles.activeTab]}
            onPress={() => setActiveTab('vote')}
          >
            <TrendingUp size={16} color={activeTab === 'vote' ? '#166534' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'vote' && styles.activeTabText]}>
              Vote on Recipes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'suggest' && styles.activeTab]}
            onPress={() => setActiveTab('suggest')}
          >
            <Plus size={16} color={activeTab === 'suggest' ? '#166534' : '#6B7280'} />
            <Text style={[styles.tabText, activeTab === 'suggest' && styles.activeTabText]}>
              Suggest Recipe
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'vote' ? (
          /* Recipe Voting */
          <View style={styles.votingSection}>
            <Text style={styles.sectionTitle}>Vote for Next Week's Menu</Text>
            <Text style={styles.sectionSubtitle}>
              Help us decide what delicious meals to prepare next week!
            </Text>

            {recipes.map((recipe) => (
              <Card key={recipe.id} style={styles.recipeCard}>
                <View style={styles.recipeHeader}>
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                    <View style={styles.recipeMetadata}>
                      <View style={[
                        styles.categoryBadge,
                        recipe.category === 'veg' ? styles.vegBadge : styles.nonVegBadge
                      ]}>
                        <Text style={[
                          styles.categoryText,
                          recipe.category === 'veg' ? styles.vegText : styles.nonVegText
                        ]}>
                          {recipe.category === 'veg' ? '🥗 Veg' : '🍗 Non-Veg'}
                        </Text>
                      </View>
                      <Text style={styles.submissionInfo}>
                        by {recipe.submittedBy} • {formatDate(recipe.submittedAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.voteSection}>
                    <TouchableOpacity
                      style={[styles.voteButton, recipe.userVoted && styles.votedButton]}
                      onPress={() => handleVote(recipe.id)}
                    >
                      <ThumbsUp 
                        size={16} 
                        color={recipe.userVoted ? '#FFFFFF' : '#166534'} 
                      />
                    </TouchableOpacity>
                    <Text style={styles.voteCount}>{recipe.votes}</Text>
                  </View>
                </View>
                <Text style={styles.recipeDescription}>{recipe.description}</Text>
              </Card>
            ))}
          </View>
        ) : (
          /* Recipe Suggestion */
          <View style={styles.suggestionSection}>
            <Text style={styles.sectionTitle}>Suggest a Recipe</Text>
            <Text style={styles.sectionSubtitle}>
              Share your favorite recipe ideas with the community!
            </Text>

            <Card style={styles.suggestionForm}>
              <TextInput
                style={styles.titleInput}
                placeholder="Recipe title (e.g., Healthy Paneer Curry)"
                value={newRecipe.title}
                onChangeText={(text) => setNewRecipe(prev => ({ ...prev, title: text }))}
              />

              <TextInput
                style={styles.descriptionInput}
                placeholder="Describe your recipe idea..."
                value={newRecipe.description}
                onChangeText={(text) => setNewRecipe(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={4}
              />

              <View style={styles.categorySelector}>
                <Text style={styles.categoryLabel}>Category:</Text>
                <View style={styles.categoryOptions}>
                  <TouchableOpacity
                    style={[
                      styles.categoryOption,
                      newRecipe.category === 'veg' && styles.selectedCategory
                    ]}
                    onPress={() => setNewRecipe(prev => ({ ...prev, category: 'veg' }))}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      newRecipe.category === 'veg' && styles.selectedCategoryText
                    ]}>
                      🥗 Vegetarian
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.categoryOption,
                      newRecipe.category === 'non-veg' && styles.selectedCategory
                    ]}
                    onPress={() => setNewRecipe(prev => ({ ...prev, category: 'non-veg' }))}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      newRecipe.category === 'non-veg' && styles.selectedCategoryText
                    ]}>
                      🍗 Non-Vegetarian
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Button
                title="Submit Recipe"
                onPress={handleSubmitRecipe}
                disabled={!newRecipe.title.trim() || !newRecipe.description.trim()}
              />
            </Card>

            {/* Rewards Info */}
            <Card style={styles.rewardsCard}>
              <View style={styles.rewardsHeader}>
                <Award size={20} color="#F97316" />
                <Text style={styles.rewardsTitle}>Earn Foodie Credits</Text>
              </View>
              <View style={styles.rewardsList}>
                <Text style={styles.rewardItem}>🗳️ Vote on recipes: +5 credits</Text>
                <Text style={styles.rewardItem}>💡 Suggest a recipe: +10 credits</Text>
                <Text style={styles.rewardItem}>🏆 Recipe gets selected: +50 credits</Text>
              </View>
              <Text style={styles.rewardsNote}>
                Use credits for discounts or donate meals to NGO partners!
              </Text>
            </Card>
          </View>
        )}
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
  statsCard: {
    marginBottom: 16,
    backgroundColor: '#F0FDF4',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#166534',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#166534',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#F0FDF4',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#166534',
  },
  votingSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  recipeCard: {
    marginBottom: 12,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  recipeInfo: {
    flex: 1,
    marginRight: 12,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  recipeMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  vegBadge: {
    backgroundColor: '#DCFCE7',
  },
  nonVegBadge: {
    backgroundColor: '#FEE2E2',
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
  },
  vegText: {
    color: '#166534',
  },
  nonVegText: {
    color: '#DC2626',
  },
  submissionInfo: {
    fontSize: 12,
    color: '#6B7280',
  },
  voteSection: {
    alignItems: 'center',
  },
  voteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  votedButton: {
    backgroundColor: '#166534',
    borderColor: '#166534',
  },
  voteCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  recipeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  suggestionSection: {
    marginBottom: 24,
  },
  suggestionForm: {
    marginBottom: 16,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  categorySelector: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  categoryOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryOption: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedCategoryText: {
    color: '#166534',
    fontWeight: '500',
  },
  rewardsCard: {
    backgroundColor: '#FFF7ED',
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F97316',
  },
  rewardsList: {
    gap: 4,
    marginBottom: 12,
  },
  rewardItem: {
    fontSize: 14,
    color: '#9A3412',
  },
  rewardsNote: {
    fontSize: 12,
    color: '#9A3412',
    fontStyle: 'italic',
  },
});