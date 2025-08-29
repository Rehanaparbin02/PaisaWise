import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const categories = [
    'All', 'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Travel', 'Education',
    'Business', 'Personal Care', 'Home', 'Insurance', 'Other'
  ];

  // Load expenses from storage
  const loadExpenses = async () => {
    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        // Sort by date, newest first
        const sortedExpenses = parsedExpenses.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setExpenses(sortedExpenses);
        filterExpenses(sortedExpenses, selectedCategory, searchQuery);
      }
    } catch (error) {
      console.error('Failed to load expenses:', error);
      Alert.alert('Error', 'Failed to load expenses');
    }
  };

  // Filter expenses based on category and search
  const filterExpenses = (expenseList, category, search) => {
    let filtered = expenseList;

    // Filter by category
    if (category !== 'All') {
      filtered = filtered.filter(expense => expense.category === category);
    }

    // Filter by search query
    if (search.trim() !== '') {
      const query = search.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.merchant_name?.toLowerCase().includes(query) ||
        expense.category?.toLowerCase().includes(query) ||
        expense.line_items?.some(item => item.toLowerCase().includes(query))
      );
    }

    setFilteredExpenses(filtered);
  };

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterExpenses(expenses, category, searchQuery);
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterExpenses(expenses, selectedCategory, query);
  };

  // Handle expense deletion
  const handleDeleteExpense = async (expenseId) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
              await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
              setExpenses(updatedExpenses);
              filterExpenses(updatedExpenses, selectedCategory, searchQuery);
              setShowDetailModal(false);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          }
        }
      ]
    );
  };

  // Refresh expenses
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  }, [selectedCategory, searchQuery]);

  // Load expenses when screen focuses
  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  // Get confidence color based on score
  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#4CAF50';
    if (confidence >= 0.6) return '#FF9800';
    return '#F44336';
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food & Dining': 'restaurant',
      'Transportation': 'car',
      'Shopping': 'bag',
      'Entertainment': 'musical-notes',
      'Bills & Utilities': 'receipt',
      'Healthcare': 'medical',
      'Travel': 'airplane',
      'Education': 'school',
      'Business': 'briefcase',
      'Personal Care': 'person',
      'Home': 'home',
      'Insurance': 'shield-checkmark',
      'Other': 'ellipsis-horizontal'
    };
    return iconMap[category] || 'ellipsis-horizontal';
  };

  // Calculate total for filtered expenses
  const getTotalAmount = () => {
    return filteredExpenses.reduce((sum, expense) => sum + (expense.total_amount || 0), 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render expense item
  const renderExpenseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.expenseCard}
      onPress={() => {
        setSelectedExpense(item);
        setShowDetailModal(true);
      }}
      activeOpacity={0.7}
    >
      <View style={styles.expenseHeader}>
        <View style={styles.merchantContainer}>
          <Ionicons 
            name={getCategoryIcon(item.category)} 
            size={24} 
            color="#F73D93" 
            style={styles.categoryIcon}
          />
          <View style={styles.merchantInfo}>
            <Text style={styles.merchantName} numberOfLines={1}>
              {item.merchant_name || 'Unknown Merchant'}
            </Text>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        
        <View style={styles.amountContainer}>
          <Text style={styles.amountText}>
            ${(item.total_amount || 0).toFixed(2)}
          </Text>
          {item.processed_by === 'ocr_llm' && (
            <View style={[
              styles.confidenceBadge,
              { backgroundColor: getConfidenceColor(item.confidence) }
            ]}>
              <Text style={styles.confidenceText}>
                {Math.round((item.confidence || 0) * 100)}%
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.expenseFooter}>
        <Text style={styles.dateText}>
          {formatDate(item.date || item.created_at)}
        </Text>
        
        {item.processed_by === 'ocr_llm' && (
          <View style={styles.ocrBadge}>
            <Ionicons name="camera" size={12} color="#007AFF" />
            <Text style={styles.ocrBadgeText}>OCR</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render category filter
  const renderCategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryFilter}
      contentContainerStyle={styles.categoryFilterContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.categoryButton,
            selectedCategory === category && styles.selectedCategoryButton
          ]}
          onPress={() => handleCategoryChange(category)}
        >
          <Text style={[
            styles.categoryButtonText,
            selectedCategory === category && styles.selectedCategoryButtonText
          ]}>
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Expenses</Text>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Total: </Text>
          <Text style={styles.summaryAmount}>${getTotalAmount().toFixed(2)}</Text>
          <Text style={styles.summaryCount}>({filteredExpenses.length} items)</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      {renderCategoryFilter()}

      {/* Expenses List */}
      <FlatList
        data={filteredExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No expenses found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery || selectedCategory !== 'All' 
                ? 'Try adjusting your filters' 
                : 'Start by scanning a receipt!'}
            </Text>
          </View>
        }
        contentContainerStyle={expenses.length === 0 ? styles.emptyList : styles.list}
      />

      {/* Detailed Expense Modal */}
      <Modal
        visible={showDetailModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowDetailModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Expense Details</Text>
            <TouchableOpacity
              onPress={() => handleDeleteExpense(selectedExpense?.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash" size={24} color="#F44336" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedExpense && (
              <>
                {/* Receipt Image */}
                {selectedExpense.image_uri && (
                  <View style={styles.imageContainer}>
                    <Text style={styles.sectionTitle}>Receipt Image</Text>
                    <Image 
                      source={{ uri: selectedExpense.image_uri }} 
                      style={styles.receiptImage}
                      resizeMode="contain"
                    />
                  </View>
                )}

                {/* Basic Info */}
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Basic Information</Text>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Merchant:</Text>
                    <Text style={styles.detailValue}>
                      {selectedExpense.merchant_name || 'Unknown'}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount:</Text>
                    <Text style={[styles.detailValue, styles.amountValue]}>
                      ${(selectedExpense.total_amount || 0).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category:</Text>
                    <View style={styles.categoryContainer}>
                      <Ionicons 
                        name={getCategoryIcon(selectedExpense.category)} 
                        size={16} 
                        color="#F73D93" 
                      />
                      <Text style={styles.categoryDetailText}>
                        {selectedExpense.category}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedExpense.date || selectedExpense.created_at)}
                    </Text>
                  </View>
                </View>

                {/* OCR Specific Information */}
                {selectedExpense.processed_by === 'ocr_llm' && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>OCR Processing Details</Text>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Confidence Score:</Text>
                      <View style={[
                        styles.confidenceContainer,
                        { backgroundColor: getConfidenceColor(selectedExpense.confidence) }
                      ]}>
                        <Text style={styles.confidenceDetailText}>
                          {Math.round((selectedExpense.confidence || 0) * 100)}%
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>AI Reasoning:</Text>
                      <Text style={styles.reasoningText}>
                        {selectedExpense.reasoning || 'No reasoning provided'}
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Processing Method:</Text>
                      <View style={styles.processingBadge}>
                        <Ionicons name="camera" size={16} color="#007AFF" />
                        <Text style={styles.processingText}>OCR + AI</Text>
                      </View>
                    </View>
                  </View>
                )}

                {/* Line Items */}
                {selectedExpense.line_items && selectedExpense.line_items.length > 0 && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Items Purchased</Text>
                    {selectedExpense.line_items.map((item, index) => (
                      <View key={index} style={styles.lineItemContainer}>
                        <Text style={styles.lineItemBullet}>•</Text>
                        <Text style={styles.lineItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Raw OCR Text (for debugging/verification) */}
                {selectedExpense.fullText && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Extracted Text (OCR)</Text>
                    <View style={styles.rawTextContainer}>
                      <Text style={styles.rawText}>
                        {selectedExpense.fullText}
                      </Text>
                    </View>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: 60,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },

  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F73D93',
  },

  summaryCount: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 2,
  },

  searchIcon: {
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  categoryFilter: {
    maxHeight: 50,
    marginBottom: 10,
  },

  categoryFilterContent: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },

  categoryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    elevation: 1,
  },

  selectedCategoryButton: {
    backgroundColor: '#F73D93',
  },

  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  selectedCategoryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },

  expenseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  merchantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  categoryIcon: {
    marginRight: 12,
  },

  merchantInfo: {
    flex: 1,
  },

  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },

  categoryText: {
    fontSize: 14,
    color: '#666',
  },

  amountContainer: {
    alignItems: 'flex-end',
  },

  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  confidenceBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },

  confidenceText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },

  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateText: {
    fontSize: 12,
    color: '#999',
  },

  ocrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },

  ocrBadgeText: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 4,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingTop: 60,
  },

  closeButton: {
    padding: 8,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  deleteButton: {
    padding: 8,
  },

  modalContent: {
    flex: 1,
    padding: 20,
  },

  imageContainer: {
    marginBottom: 20,
  },

  receiptImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginTop: 10,
  },

  detailSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },

  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },

  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F73D93',
  },

  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  categoryDetailText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    marginLeft: 6,
  },

  confidenceContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  confidenceDetailText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },

  reasoningText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },

  processingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  processingText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 4,
  },

  lineItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },

  lineItemBullet: {
    fontSize: 14,
    color: '#F73D93',
    marginRight: 8,
    marginTop: 2,
  },

  lineItemText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },

  rawTextContainer: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },

  rawText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});

export default Expenses;