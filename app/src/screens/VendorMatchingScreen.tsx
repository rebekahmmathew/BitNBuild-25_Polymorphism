import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Vendor {
  id: string;
  name: string;
  rating: number;
  specialties: string[];
  cost: number;
  matchPercentage: number;
  isRecommended: boolean;
  avatar: string;
  deliveryTime: string;
  cuisine: string[];
  description: string;
}

interface Preference {
  id: string;
  name: string;
  value: boolean;
  category: 'dietary' | 'spice' | 'allergies' | 'portion';
}

const VendorMatchingScreen: React.FC = () => {
  const [preferences, setPreferences] = useState<Preference[]>([
    { id: '1', name: 'Vegetarian', value: false, category: 'dietary' },
    { id: '2', name: 'Non-Vegetarian', value: true, category: 'dietary' },
    { id: '3', name: 'Vegan', value: false, category: 'dietary' },
    { id: '4', name: 'Jain', value: false, category: 'dietary' },
    { id: '5', name: 'Mild Spice', value: false, category: 'spice' },
    { id: '6', name: 'Medium Spice', value: true, category: 'spice' },
    { id: '7', name: 'Hot Spice', value: false, category: 'spice' },
    { id: '8', name: 'Nuts Allergy', value: false, category: 'allergies' },
    { id: '9', name: 'Dairy Allergy', value: false, category: 'allergies' },
    { id: '10', name: 'Gluten Free', value: false, category: 'allergies' },
    { id: '11', name: 'Small Portion', value: false, category: 'portion' },
    { id: '12', name: 'Regular Portion', value: true, category: 'portion' },
    { id: '13', name: 'Large Portion', value: false, category: 'portion' }
  ]);

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mockVendors: Vendor[] = [
    {
      id: '1',
      name: 'Spice Garden',
      rating: 4.8,
      specialties: ['North Indian', 'Tandoor', 'Curries'],
      cost: 450,
      matchPercentage: 95,
      isRecommended: true,
      avatar: 'SG',
      deliveryTime: '25-30 min',
      cuisine: ['North Indian', 'Mughlai'],
      description: 'Authentic North Indian cuisine with traditional recipes passed down through generations.'
    },
    {
      id: '2',
      name: 'Green Kitchen',
      rating: 4.6,
      specialties: ['South Indian', 'Healthy', 'Organic'],
      cost: 380,
      matchPercentage: 88,
      isRecommended: false,
      avatar: 'GK',
      deliveryTime: '20-25 min',
      cuisine: ['South Indian', 'Healthy'],
      description: 'Fresh, organic ingredients with a focus on healthy South Indian cuisine.'
    },
    {
      id: '3',
      name: 'Royal Tiffin',
      rating: 4.7,
      specialties: ['Gujarati', 'Thali', 'Traditional'],
      cost: 420,
      matchPercentage: 82,
      isRecommended: false,
      avatar: 'RT',
      deliveryTime: '30-35 min',
      cuisine: ['Gujarati', 'Rajasthani'],
      description: 'Traditional Gujarati thali with authentic flavors and home-style cooking.'
    },
    {
      id: '4',
      name: 'Bengali Bites',
      rating: 4.5,
      specialties: ['Bengali', 'Fish Curry', 'Rice'],
      cost: 400,
      matchPercentage: 75,
      isRecommended: false,
      avatar: 'BB',
      deliveryTime: '35-40 min',
      cuisine: ['Bengali', 'East Indian'],
      description: 'Authentic Bengali cuisine with fresh fish and traditional rice preparations.'
    }
  ];

  useEffect(() => {
    calculateVendorMatches();
  }, [preferences]);

  const calculateVendorMatches = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const updatedVendors = mockVendors.map(vendor => {
        let matchScore = 0;
        let totalWeight = 0;

        // Calculate match based on preferences
        preferences.forEach(pref => {
          if (pref.value) {
            totalWeight += 1;
            
            // Simple matching logic (in real app, this would be more sophisticated)
            if (pref.category === 'dietary') {
              if (pref.name === 'Vegetarian' && vendor.specialties.includes('Healthy')) {
                matchScore += 1;
              } else if (pref.name === 'Non-Vegetarian' && vendor.specialties.includes('Tandoor')) {
                matchScore += 1;
              }
            } else if (pref.category === 'spice') {
              if (pref.name === 'Medium Spice' && vendor.specialties.includes('Curries')) {
                matchScore += 1;
              }
            }
          }
        });

        const matchPercentage = totalWeight > 0 ? Math.round((matchScore / totalWeight) * 100) : 0;
        
        return {
          ...vendor,
          matchPercentage: Math.max(matchPercentage, 60) // Minimum 60% match
        };
      });

      // Sort by match percentage
      updatedVendors.sort((a, b) => b.matchPercentage - a.matchPercentage);
      updatedVendors[0].isRecommended = true; // Mark top match as recommended
      
      setVendors(updatedVendors);
      setIsLoading(false);
    }, 1000);
  };

  const handlePreferenceChange = (id: string) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, value: !pref.value } : pref
      )
    );
  };

  const handleVendorSelect = (vendorId: string) => {
    setSelectedVendor(vendorId);
  };

  const handleActivateSubscription = () => {
    if (!selectedVendor) {
      Alert.alert('Select Vendor', 'Please select a vendor before activating subscription.');
      return;
    }

    const vendor = vendors.find(v => v.id === selectedVendor);
    Alert.alert(
      'Subscription Activated!',
      `Your subscription with ${vendor?.name} has been activated. You'll receive your first meal tomorrow!`,
      [
        {
          text: 'Great!',
          onPress: () => {
            // Navigate to home screen or subscription screen
            console.log('Subscription activated with:', vendor?.name);
          }
        }
      ]
    );
  };

  const renderPreferenceCategory = (category: string) => {
    const categoryPreferences = preferences.filter(p => p.category === category);
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

    return (
      <View key={category} style={styles.preferenceCategory}>
        <Text style={styles.categoryTitle}>{categoryName} Preferences</Text>
        <View style={styles.preferencesList}>
          {categoryPreferences.map((pref) => (
            <View key={pref.id} style={styles.preferenceItem}>
              <Text style={styles.preferenceName}>{pref.name}</Text>
              <Switch
                value={pref.value}
                onValueChange={() => handlePreferenceChange(pref.id)}
                trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
                thumbColor={pref.value ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderVendorCard = (vendor: Vendor) => (
    <TouchableOpacity
      key={vendor.id}
      style={[
        styles.vendorCard,
        selectedVendor === vendor.id && styles.vendorCardSelected,
        vendor.isRecommended && styles.vendorCardRecommended
      ]}
      onPress={() => handleVendorSelect(vendor.id)}
    >
      {vendor.isRecommended && (
        <View style={styles.recommendedBadge}>
          <Ionicons name="star" size={16} color="white" />
          <Text style={styles.recommendedText}>Recommended</Text>
        </View>
      )}
      
      <View style={styles.vendorHeader}>
        <View style={styles.vendorAvatar}>
          <Text style={styles.vendorAvatarText}>{vendor.avatar}</Text>
        </View>
        <View style={styles.vendorInfo}>
          <Text style={styles.vendorName}>{vendor.name}</Text>
          <View style={styles.vendorRating}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{vendor.rating}</Text>
            <Text style={styles.deliveryTime}>• {vendor.deliveryTime}</Text>
          </View>
        </View>
        <View style={styles.matchPercentage}>
          <Text style={styles.matchPercentageText}>{vendor.matchPercentage}%</Text>
          <Text style={styles.matchLabel}>Match</Text>
        </View>
      </View>

      <Text style={styles.vendorDescription}>{vendor.description}</Text>

      <View style={styles.vendorSpecialties}>
        {vendor.specialties.map((specialty, index) => (
          <View key={index} style={styles.specialtyTag}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>

      <View style={styles.vendorFooter}>
        <View style={styles.costContainer}>
          <Text style={styles.costLabel}>Weekly Cost</Text>
          <Text style={styles.costAmount}>₹{vendor.cost}</Text>
        </View>
        <View style={styles.cuisineContainer}>
          <Text style={styles.cuisineLabel}>Cuisine</Text>
          <Text style={styles.cuisineText}>{vendor.cuisine.join(', ')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Your Perfect Vendor</Text>
        <Text style={styles.subtitle}>
          Tell us your preferences and we'll match you with the best vendor
        </Text>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Preferences</Text>
        <Text style={styles.sectionSubtitle}>
          Select your dietary preferences, spice level, and any allergies
        </Text>
        
        {['dietary', 'spice', 'allergies', 'portion'].map(renderPreferenceCategory)}
      </View>

      {/* Vendor Matches */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vendor Matches</Text>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Finding matches...</Text>
            </View>
          )}
        </View>
        
        {!isLoading && vendors.length > 0 && (
          <>
            {vendors.map(renderVendorCard)}
            
            <TouchableOpacity
              style={[
                styles.activateButton,
                !selectedVendor && styles.activateButtonDisabled
              ]}
              onPress={handleActivateSubscription}
              disabled={!selectedVendor}
            >
              <Text style={[
                styles.activateButtonText,
                !selectedVendor && styles.activateButtonTextDisabled
              ]}>
                Activate Subscription
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    paddingTop: 40,
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
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  preferenceCategory: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  preferencesList: {
    gap: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceName: {
    fontSize: 14,
    color: '#1F2937',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  vendorCard: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  vendorCardSelected: {
    borderColor: '#3B82F6',
    backgroundColor: '#F0F9FF',
  },
  vendorCardRecommended: {
    borderColor: '#10B981',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  recommendedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  vendorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vendorAvatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  vendorRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  matchPercentage: {
    alignItems: 'center',
  },
  matchPercentageText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  matchLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  vendorDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  vendorSpecialties: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  specialtyTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  vendorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  costContainer: {
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  costAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  cuisineContainer: {
    alignItems: 'center',
    flex: 1,
  },
  cuisineLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  cuisineText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  activateButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  activateButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  activateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  activateButtonTextDisabled: {
    color: '#9CA3AF',
  },
});

export default VendorMatchingScreen;
