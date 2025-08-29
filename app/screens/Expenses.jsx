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
  Share,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const Expenses = React.memo(() => {
  const navigation = useNavigation();
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showSortModal, setShowSortModal] = useState(false);

  const categories = [
    'All', 'Food & Dining', 'Transportation', 'Shopping', 'Entertainment',
    'Bills & Utilities', 'Healthcare', 'Travel', 'Education',
    'Business', 'Personal Care', 'Home', 'Insurance', 'Other'
  ];

  const sortExpenses = useCallback((expenseList, criteria, order) => {
    return [...expenseList].sort((a, b) => {
      let comparison = 0;
      switch (criteria) {
        case 'date':
          comparison = new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
          break;
        case 'amount':
          comparison = (b.total_amount || 0) - (a.total_amount || 0);
          break;
        case 'merchant':
          comparison = (a.merchant_name || '').localeCompare(b.merchant_name || '');
          break;
        case 'category':
          comparison = (a.category || '').localeCompare(b.category || '');
          break;
        default:
          comparison = new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
      }
      return order === 'desc' ? comparison : -comparison;
    });
  }, []);

  const applyFiltersAndSort = useCallback((expenseList, category, search, criteria, order) => {
    let filtered = expenseList;
    if (category !== 'All') {
      filtered = filtered.filter(expense => expense.category === category);
    }
    if (search.trim() !== '') {
      const query = search.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.merchant_name?.toLowerCase().includes(query) ||
        expense.category?.toLowerCase().includes(query) ||
        expense.line_items?.some(item =>
          (typeof item === 'string' ? item : item.name)?.toLowerCase().includes(query)
        ) ||
        expense.total_amount?.toString().includes(query.replace('$', ''))
      );
    }
    const sorted = sortExpenses(filtered, criteria, order);
    setFilteredExpenses(sorted);
  }, [sortExpenses]);

  const loadExpenses = useCallback(async () => {
    try {
      setRefreshing(true);
      const storedExpenses = await AsyncStorage.getItem('expenses');
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        setExpenses(parsedExpenses);
        applyFiltersAndSort(parsedExpenses, selectedCategory, searchQuery, sortBy, sortOrder);
      } else {
        setExpenses([]);
        setFilteredExpenses([]);
      }
    } catch (error) {
      console.error('Failed to load expenses:', error);
      Alert.alert('Error', 'Failed to load expenses');
    } finally {
      setRefreshing(false);
    }
  }, [selectedCategory, searchQuery, sortBy, sortOrder, applyFiltersAndSort]);

  useEffect(() => {
    applyFiltersAndSort(expenses, selectedCategory, searchQuery, sortBy, sortOrder);
  }, [expenses, selectedCategory, searchQuery, sortBy, sortOrder, applyFiltersAndSort]);

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [loadExpenses])
  );

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
              setShowDetailModal(false);
              Alert.alert('Success', 'Expense deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete expense');
            }
          }
        }
      ]
    );
  };

  const handleExportExpenses = async () => {
    try {
      if (filteredExpenses.length === 0) {
        Alert.alert('No Data', 'No expenses to export');
        return;
      }
      const csvHeader = 'Date,Merchant,Category,Amount,Items,Confidence\n';
      const csvData = filteredExpenses.map(expense => {
        const date = formatDate(expense.date || expense.created_at);
        const merchant = `"${(expense.merchant_name || 'Unknown').replace(/"/g, '""')}"`;
        const category = `"${(expense.category || 'Other').replace(/"/g, '""')}"`;
        const amount = (expense.total_amount || 0).toFixed(2);
        const items = `"${(expense.line_items || [])
          .map(i => typeof i === 'string' ? i : i.name)
          .join(';')
          .replace(/"/g, '""')}"`;
        const confidence = expense.confidence ? Math.round(expense.confidence * 100) + '%' : 'N/A';
        return `${date},${merchant},${category},${amount},${items},${confidence}`;
      }).join('\n');
      const csvContent = csvHeader + csvData;

      await Share.share({
        message: csvContent,
        title: 'Expense Report',
        subject: `Expense Report - ${filteredExpenses.length} expenses`
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export expenses');
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#4CAF50';
    if (confidence >= 0.6) return '#FF9800';
    return '#F44336';
  };

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

  const getTotalAmount = () => {
    return filteredExpenses.reduce((sum, expense) => sum + (expense.total_amount || 0), 0);
  };

  const getAverageAmount = () => {
    return filteredExpenses.length > 0 ? getTotalAmount() / filteredExpenses.length : 0;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return formatDate(dateString);
  };

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
            <Text style={styles.categoryText}>{item.category || 'Other'}</Text>
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
          {getRelativeTime(item.created_at || item.date)}
        </Text>
        <View style={styles.badgeContainer}>
          {item.processed_by === 'ocr_llm' && (
            <View style={styles.ocrBadge}>
              <Ionicons name="camera" size={12} color="#007AFF" />
              <Text style={styles.ocrBadgeText}>OCR</Text>
            </View>
          )}
          {item.line_items && item.line_items.length > 0 && (
            <View style={styles.itemsBadge}>
              <Text style={styles.itemsBadgeText}>{item.line_items.length} items</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

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
          onPress={() => setSelectedCategory(category)}
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

  const renderSortModal = () => (
    <Modal
      visible={showSortModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSortModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.sortModalContainer}>
          <View style={styles.sortModalHeader}>
            <Text style={styles.sortModalTitle}>Sort Expenses</Text>
            <TouchableOpacity onPress={() => setShowSortModal(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {[
            { label: 'Date (Newest First)', criteria: 'date', order: 'desc' },
            { label: 'Date (Oldest First)', criteria: 'date', order: 'asc' },
            { label: 'Amount (Highest First)', criteria: 'amount', order: 'desc' },
            { label: 'Amount (Lowest First)', criteria: 'amount', order: 'asc' },
            { label: 'Merchant (A-Z)', criteria: 'merchant', order: 'asc' },
            { label: 'Category (A-Z)', criteria: 'category', order: 'asc' },
          ].map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.sortOption,
                sortBy === option.criteria && sortOrder === option.order && styles.selectedSortOption
              ]}
              onPress={() => {
                setSortBy(option.criteria);
                setSortOrder(option.order);
                setShowSortModal(false);
              }}
            >
              <Text style={[
                styles.sortOptionText,
                sortBy === option.criteria && sortOrder === option.order && styles.selectedSortOptionText
              ]}>
                {option.label}
              </Text>
              {sortBy === option.criteria && sortOrder === option.order && (
                <Ionicons name="checkmark" size={20} color="#F73D93" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No expenses found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedCategory !== 'All'
          ? 'Try adjusting your filters'
          : 'Start by scanning a receipt!'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Expenses</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => setShowSortModal(true)} style={styles.headerButton}>
              <Ionicons name="swap-vertical" size={24} color="#F73D93" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExportExpenses} style={styles.headerButton}>
              <Ionicons name="share" size={24} color="#F73D93" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryAmount}>${getTotalAmount().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Average</Text>
              <Text style={styles.summaryAmount}>${getAverageAmount().toFixed(2)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Count</Text>
              <Text style={styles.summaryAmount}>{filteredExpenses.length}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search expenses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {renderCategoryFilter()}

      <FlatList
        data={filteredExpenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadExpenses} />
        }
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={filteredExpenses.length === 0 ? styles.emptyList : styles.list}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ExpenseEntry')}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
      
      {renderSortModal()}

      <Modal
        visible={showDetailModal}
        animationType="slide"
        presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'formSheet'}
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
                        {selectedExpense.category || 'Other'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>
                      {formatDate(selectedExpense.date || selectedExpense.created_at)}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Added:</Text>
                    <Text style={styles.detailValue}>
                      {getRelativeTime(selectedExpense.created_at || selectedExpense.date)}
                    </Text>
                  </View>
                </View>

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

                {selectedExpense.line_items && selectedExpense.line_items.length > 0 && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>Items Purchased</Text>
                    {selectedExpense.line_items.map((item, index) => (
                      <View key={index} style={styles.lineItemContainer}>
                        <Text style={styles.lineItemBullet}>•</Text>
                        <Text style={styles.lineItemText}>
                          {typeof item === 'string' ? item : item.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20, // Adjust for iOS notch
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 15,
  },
  summaryContainer: {
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F73D93',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ocrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 6,
  },
  ocrBadgeText: {
    fontSize: 10,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  itemsBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  itemsBadgeText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#F73D93',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
  },
  sortModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
    marginBottom: 10,
  },
  sortModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedSortOption: {
    // No change, just a placeholder for potential styling
  },
  sortOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedSortOptionText: {
    color: '#F73D93',
    fontWeight: '600',
  },
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
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 16,
  },
});

export default Expenses;