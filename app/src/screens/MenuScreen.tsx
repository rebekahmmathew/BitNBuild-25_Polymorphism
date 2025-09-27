import React from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const MenuScreen = () => {
  const menuItems = [
    {
      id: 1,
      name: 'Dal Rice',
      description: 'Fresh dal with basmati rice',
      price: 80,
      category: 'main',
      isVeg: true,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Chicken Curry',
      description: 'Spicy chicken curry with roti',
      price: 120,
      category: 'main',
      isVeg: false,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 3,
      name: 'Vegetable Sabzi',
      description: 'Mixed vegetables with spices',
      price: 60,
      category: 'side',
      isVeg: true,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 4,
      name: 'Raita',
      description: 'Fresh yogurt with cucumber',
      price: 30,
      category: 'side',
      isVeg: true,
      image: 'https://via.placeholder.com/150'
    }
  ]

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'main':
        return 'restaurant'
      case 'side':
        return 'leaf'
      case 'dessert':
        return 'ice-cream'
      default:
        return 'restaurant'
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Menu</Text>
        <Text style={styles.subtitle}>Fresh and delicious meals prepared daily</Text>
      </View>

      <View style={styles.menuGrid}>
        {menuItems.map((item) => (
          <View key={item.id} style={styles.menuItem}>
            <View style={styles.itemImage}>
              <Ionicons name="restaurant" size={40} color="#64748b" />
            </View>
            
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemBadges}>
                  {item.isVeg && (
                    <View style={styles.vegBadge}>
                      <Text style={styles.vegText}>VEG</Text>
                    </View>
                  )}
                  <View style={styles.categoryBadge}>
                    <Ionicons 
                      name={getCategoryIcon(item.category) as any} 
                      size={12} 
                      color="#64748b" 
                    />
                    <Text style={styles.categoryText}>
                      {item.category.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.itemDescription}>{item.description}</Text>
              
              <View style={styles.itemFooter}>
                <Text style={styles.itemPrice}>₹{item.price}</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹290</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Delivery</Text>
          <Text style={styles.summaryValue}>Free</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryTotal}>Total</Text>
          <Text style={styles.summaryTotalValue}>₹290</Text>
        </View>
        
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  menuGrid: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  itemBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  vegBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  vegText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  addButton: {
    backgroundColor: '#0ea5e9',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0ea5e9',
  },
  orderButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default MenuScreen
