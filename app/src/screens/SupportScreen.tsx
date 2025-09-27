import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  TextInput,
  Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Feedback {
  id: string;
  type: 'meal' | 'delivery' | 'service';
  rating: number;
  comment: string;
  date: string;
}

const SupportScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'meal' | 'delivery' | 'service'>('meal');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const categories = [
    { id: 'all', name: 'All', icon: 'list' },
    { id: 'billing', name: 'Billing', icon: 'card' },
    { id: 'delivery', name: 'Delivery', icon: 'bicycle' },
    { id: 'subscription', name: 'Subscription', icon: 'star' },
    { id: 'technical', name: 'Technical', icon: 'settings' }
  ];

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I pause my subscription?',
      answer: 'Go to your Subscription tab, tap on "Pause Subscription", and select the dates you want to pause. You can also donate your meals to partnered organizations.',
      category: 'subscription'
    },
    {
      id: '2',
      question: 'Can I change my delivery address?',
      answer: 'Yes! Go to Profile > Delivery Addresses to add, edit, or change your delivery address. You can have multiple addresses saved.',
      category: 'delivery'
    },
    {
      id: '3',
      question: 'How do I skip a day?',
      answer: 'On the Home screen, tap "Skip Day" in Quick Actions. You can also do this from the Menu screen for specific days.',
      category: 'subscription'
    },
    {
      id: '4',
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI, credit/debit cards, digital wallets, and net banking. All payments are processed securely through Razorpay.',
      category: 'billing'
    },
    {
      id: '5',
      question: 'How do I track my delivery?',
      answer: 'Go to the Tracking tab to see real-time delivery status, driver location, and estimated arrival time.',
      category: 'delivery'
    },
    {
      id: '6',
      question: 'Can I change my vendor?',
      answer: 'Yes! Go to Profile > Change Vendor to see available vendors with match percentages and costs.',
      category: 'subscription'
    },
    {
      id: '7',
      question: 'How do I contact support?',
      answer: 'You can call us at +91 98765 43210, use the chat feature, or email us at support@nourishnet.com',
      category: 'technical'
    },
    {
      id: '8',
      question: 'What if I have food allergies?',
      answer: 'Please update your meal preferences in Profile > Meal Preferences and specify your allergies. We\'ll ensure your meals are prepared safely.',
      category: 'subscription'
    }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const handleCallSupport = () => {
    Linking.openURL('tel:+919876543210');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@nourishnet.com');
  };

  const handleChatSupport = () => {
    Alert.alert('Chat Support', 'Opening chat support...');
  };

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a rating before submitting feedback.');
      return;
    }

    Alert.alert(
      'Feedback Submitted',
      'Thank you for your feedback! We appreciate your input.',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowFeedbackModal(false);
            setRating(0);
            setComment('');
          }
        }
      ]
    );
  };

  const renderStars = (currentRating: number, onPress: (rating: number) => void) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress(star)}
            style={styles.star}
          >
            <Ionicons
              name={star <= currentRating ? 'star' : 'star-outline'}
              size={24}
              color={star <= currentRating ? '#FFD700' : '#D1D5DB'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Support & Community</Text>
        <Text style={styles.subtitle}>Get help and share feedback</Text>
      </View>

      {/* Contact Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Support</Text>
        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.contactButton} onPress={handleCallSupport}>
            <Ionicons name="call" size={24} color="#3B82F6" />
            <Text style={styles.contactButtonText}>Call Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={handleEmailSupport}>
            <Ionicons name="mail" size={24} color="#3B82F6" />
            <Text style={styles.contactButtonText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={handleChatSupport}>
            <Ionicons name="chatbubble" size={24} color="#3B82F6" />
            <Text style={styles.contactButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feedback */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Share Feedback</Text>
          <TouchableOpacity 
            style={styles.feedbackButton}
            onPress={() => setShowFeedbackModal(true)}
          >
            <Ionicons name="add" size={20} color="white" />
            <Text style={styles.feedbackButtonText}>Add Feedback</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionSubtitle}>
          Help us improve by rating your meals and delivery experience
        </Text>
      </View>

      {/* FAQ Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={20} 
                color={selectedCategory === category.id ? 'white' : '#6B7280'} 
              />
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FAQ List */}
      <View style={styles.section}>
        {filteredFAQs.map((faq) => (
          <View key={faq.id} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          </View>
        ))}
      </View>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share Your Feedback</Text>
            
            <Text style={styles.modalLabel}>Type of Feedback</Text>
            <View style={styles.feedbackTypeContainer}>
              {(['meal', 'delivery', 'service'] as const).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.feedbackTypeButton,
                    feedbackType === type && styles.feedbackTypeButtonActive
                  ]}
                  onPress={() => setFeedbackType(type)}
                >
                  <Text style={[
                    styles.feedbackTypeText,
                    feedbackType === type && styles.feedbackTypeTextActive
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.modalLabel}>Rating</Text>
            {renderStars(rating, setRating)}

            <Text style={styles.modalLabel}>Comments (Optional)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Tell us more about your experience..."
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowFeedbackModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={handleSubmitFeedback}
              >
                <Text style={styles.modalButtonPrimaryText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    minWidth: 80,
  },
  contactButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  feedbackButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  categoriesContainer: {
    marginTop: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
  },
  categoryButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  faqItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    margin: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
    marginTop: 16,
  },
  feedbackTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  feedbackTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    alignItems: 'center',
  },
  feedbackTypeButtonActive: {
    backgroundColor: '#3B82F6',
  },
  feedbackTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  feedbackTypeTextActive: {
    color: 'white',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    padding: 4,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButtonSecondary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalButtonPrimary: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default SupportScreen;
