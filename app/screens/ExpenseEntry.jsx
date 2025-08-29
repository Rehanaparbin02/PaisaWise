import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// Utility function to generate a unique ID for each line item
const generateLineItemId = () => Math.random().toString(36).substring(2, 9);

const ExpenseEntry = () => {
  const navigation = useNavigation();
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [lineItems, setLineItems] = useState([]);
  const [itemText, setItemText] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [gstAmount, setGstAmount] = useState(''); // New state for GST
  const [totalAmount, setTotalAmount] = useState(0);

  // Automatically calculate total amount whenever line items or GST change
  useEffect(() => {
    const subtotal = lineItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
    const gst = parseFloat(gstAmount || 0);
    setTotalAmount(subtotal + gst);
  }, [lineItems, gstAmount]);

  const handleAddItem = () => {
    if (itemText.trim() === '' || itemPrice.trim() === '' || isNaN(parseFloat(itemPrice))) {
      Alert.alert('Error', 'Please enter a valid item name and price.');
      return;
    }

    const newItem = {
      id: generateLineItemId(),
      name: itemText.trim(),
      price: parseFloat(itemPrice),
    };
    setLineItems([...lineItems, newItem]);
    setItemText('');
    setItemPrice('');
  };

  const handleRemoveItem = (id) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    if (!merchant || !category || lineItems.length === 0) {
      Alert.alert('Error', 'Please fill in the merchant, category, and add at least one item.');
      return;
    }

    const newExpense = {
      id: uuidv4(),
      merchant_name: merchant,
      total_amount: totalAmount, // This is now subtotal + gst
      subtotal_amount: lineItems.reduce((sum, item) => sum + item.price, 0), // Save subtotal
      gst_amount: parseFloat(gstAmount || 0), // Save GST
      category: category,
      date: new Date(date).toISOString(),
      created_at: new Date().toISOString(),
      processed_by: 'manual_entry',
      line_items: lineItems.map(i => i.name),
    };

    try {
      const storedExpenses = await AsyncStorage.getItem('expenses');
      const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      const updatedExpenses = [...expenses, newExpense];
      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      Alert.alert('Success', 'Expense saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('Failed to save expense:', error);
      Alert.alert('Error', 'Failed to save expense.');
    }
  };

  const renderLineItem = ({ item }) => (
    <View style={styles.lineItemContainer}>
      <Text style={styles.lineItemText}>{item.name}</Text>
      <Text style={styles.lineItemPrice}>₹{item.price.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
        <Ionicons name="close-circle" size={24} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Expense</Text>
        <View style={styles.backButton} />
      </View>
      <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Merchant Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Starbux"
          value={merchant}
          onChangeText={setMerchant}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Food & Dining"
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Date</Text>
        <TextInput
          style={styles.input}
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
        />

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Line Items</Text>
            <Text style={styles.totalAmountText}>Subtotal: ₹{lineItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</Text>
          </View>
          <FlatList
            data={lineItems}
            renderItem={renderLineItem}
            keyExtractor={(item) => item.id.toString()}
            listKey="lineItems"
            style={styles.lineItemsList}
          />
          <View style={styles.addItemRow}>
            <TextInput
              style={[styles.input, styles.itemInput]}
              placeholder="Item Name"
              value={itemText}
              onChangeText={setItemText}
            />
            <TextInput
              style={[styles.input, styles.priceInput]}
              placeholder="Price"
              keyboardType="numeric"
              value={itemPrice}
              onChangeText={setItemPrice}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.label}>GST Amount (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 25.50"
          keyboardType="numeric"
          value={gstAmount}
          onChangeText={setGstAmount}
        />

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Expense</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F73D93',
  },
  saveButton: {
    backgroundColor: '#F73D93',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 50,
    elevation: 2,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalAmountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F73D93',
  },
  addItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemInput: {
    flex: 2,
    marginRight: 10,
  },
  priceInput: {
    flex: 1,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
  },
  lineItemsList: {
    maxHeight: 200, // Optional: limit height to make it scrollable
  },
  lineItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lineItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  lineItemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginRight: 10,
  },
});

export default ExpenseEntry;