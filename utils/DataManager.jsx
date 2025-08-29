// utils/DataManager.jsx - Development utility for managing expenses data
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const DataManager = () => {
  const [expenseCount, setExpenseCount] = useState(0);
  const [ocrCount, setOcrCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const expenses = await AsyncStorage.getItem('expenses');
      if (expenses) {
        const parsed = JSON.parse(expenses);
        setExpenseCount(parsed.length);
        setOcrCount(parsed.filter(e => e.processed_by === 'ocr_llm').length);
        setTotalAmount(parsed.reduce((sum, e) => sum + (e.total_amount || 0), 0));
      } else {
        setExpenseCount(0);
        setOcrCount(0);
        setTotalAmount(0);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all expenses. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await AsyncStorage.removeItem('expenses');
              await loadStats();
              Alert.alert('Success', 'All expenses cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear expenses');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const exportData = async () => {
    try {
      const expenses = await AsyncStorage.getItem('expenses');
      if (expenses) {
        // In a real app, you'd export this to a file or share it
        console.log('Expense data:', JSON.stringify(JSON.parse(expenses), null, 2));
        Alert.alert('Data Exported', 'Check console for exported data (in development)');
      } else {
        Alert.alert('No Data', 'No expenses to export');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const addTestExpense = async () => {
    try {
      setLoading(true);
      
      const testExpense = {
        id: Date.now().toString(),
        merchant_name: "Test Store",
        total_amount: 25.99,
        date: new Date().toISOString().split('T')[0],
        category: "Shopping",
        confidence: 0.95,
        line_items: ["Test Item 1", "Test Item 2"],
        reasoning: "Manual test expense",
        image_uri: null,
        created_at: new Date().toISOString(),
        processed_by: 'manual_test',
        fullText: "TEST STORE\nTest Item 1 $12.99\nTest Item 2 $13.00\nTOTAL $25.99"
      };

      const existingExpenses = await AsyncStorage.getItem('expenses');
      const expenses = existingExpenses ? JSON.parse(existingExpenses) : [];
      expenses.unshift(testExpense);
      
      await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
      await loadStats();
      
      Alert.alert('Success', 'Test expense added');
    } catch (error) {
      Alert.alert('Error', 'Failed to add test expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="construct" size={32} color="#F73D93" />
        <Text style={styles.title}>Data Manager</Text>
        <Text style={styles.subtitle}>Development Utility</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Current Statistics</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Expenses:</Text>
          <Text style={styles.statValue}>{expenseCount}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>OCR Processed:</Text>
          <Text style={styles.statValue}>{ocrCount}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Amount:</Text>
          <Text style={styles.statValue}>${totalAmount.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadStats}
        >
          <Ionicons name="refresh" size={16} color="#007AFF" />
          <Text style={styles.refreshText}>Refresh Stats</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.testButton]}
          onPress={addTestExpense}
          disabled={loading}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.buttonText}>Add Test Expense</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.exportButton]}
          onPress={exportData}
          disabled={loading}
        >
          <Ionicons name="share" size={20} color="#fff" />
          <Text style={styles.buttonText}>Export Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={clearAllData}
          disabled={loading}
        >
          <Ionicons name="trash" size={20} color="#fff" />
          <Text style={styles.buttonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Development Notes</Text>
        <Text style={styles.infoText}>
          • Use "Add Test Expense" to add sample data for testing
        </Text>
        <Text style={styles.infoText}>
          • OCR processing will add expenses with processed_by: 'ocr_llm'
        </Text>
        <Text style={styles.infoText}>
          • All data is stored locally in AsyncStorage
        </Text>
        <Text style={styles.infoText}>
          • Clear data to start fresh with live OCR only
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },

  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },

  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  statLabel: {
    fontSize: 16,
    color: '#666',
  },

  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F73D93',
  },

  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    paddingVertical: 8,
  },

  refreshText: {
    color: '#007AFF',
    marginLeft: 5,
    fontSize: 14,
  },

  actionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },

  testButton: {
    backgroundColor: '#34C759',
  },

  exportButton: {
    backgroundColor: '#007AFF',
  },

  clearButton: {
    backgroundColor: '#FF3B30',
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },

  infoContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },

  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default DataManager;