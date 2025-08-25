import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

// Helper to format ISO datetime to "YYYY-MM-DD HH:mm"
function formatTimestamp(isoString) {
  const dateObj = new Date(isoString);
  const date = dateObj.toISOString().slice(0, 10);
  const time = dateObj.toTimeString().slice(0, 5); // "HH:mm"
  return `${date} ${time}`;
}

export default function Transaction() {
  const navigation = useNavigation();

  const [transactions, setTransactions] = useState([
    { id: '1', description: 'Groceries', amount: 45.67, timestamp: '2025-05-01T14:30:00Z' },
    { id: '2', description: 'Electricity Bill', amount: 89.9, timestamp: '2025-05-03T10:15:00Z' },
    { id: '3', description: 'Dinner', amount: 27.5, timestamp: '2025-05-05T19:45:00Z' },
    { id: '4', description: 'Movie Tickets', amount: 35.0, timestamp: '2025-05-06T21:00:00Z' },
    { id: '5', description: 'Uber', amount: 15.25, timestamp: '2025-05-07T09:20:00Z' },
    { id: '6', description: 'Book Purchase', amount: 12.99, timestamp: '2025-05-10T16:00:00Z' },
    { id: '7', description: 'Coffee', amount: 4.75, timestamp: '2025-05-12T08:30:00Z' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [descInput, setDescInput] = useState('');
  const [amountInput, setAmountInput] = useState('');

  const maxVisibleTransactions = 5;
  const visibleTransactions = transactions.slice(0, maxVisibleTransactions);

  const addTransaction = () => {
    if (!descInput.trim() || !amountInput.trim() || isNaN(parseFloat(amountInput))) return;

    const newTransaction = {
      id: (transactions.length + 1).toString(),
      description: descInput.trim(),
      amount: parseFloat(amountInput),
      timestamp: new Date().toISOString(),
    };

    setTransactions([newTransaction, ...transactions]);
    setDescInput('');
    setAmountInput('');
    setModalVisible(false);
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionDesc}>{item.description}</Text>
        <Text style={styles.transactionDate}>{formatTimestamp(item.timestamp)}</Text>
      </View>
      <Text style={styles.transactionAmount}>₹{item.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with title and add button */}
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.addButton}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>＋ Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={visibleTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />

      {transactions.length > maxVisibleTransactions && (
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() => navigation.navigate('SeeAllTransactions', { transactions })}
          activeOpacity={0.8}
        >
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      )}

      {/* Modal for adding transaction */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Transaction</Text>

            <TextInput
              style={styles.input}
              placeholder="Description"
              placeholderTextColor="#999"
              value={descInput}
              onChangeText={setDescInput}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Amount (₹)"
              placeholderTextColor="#999"
              value={amountInput}
              onChangeText={setAmountInput}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={addTransaction}
                style={[styles.modalButton, styles.addButtonModal]}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight:12,
    marginLeft:12,
    marginTop: 12,
    padding: 20,
    backgroundColor: '#1a1326', // soft dark purple/charcoal
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFD700', // gold title
  },
  addButton: {
    backgroundColor: '#2a1b3d',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  addButtonText: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 15,
  },
  transactionCard: {
    backgroundColor: '#fffdf8', // light ivory card
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 2,
  },
  transactionLeft: {
    flexShrink: 1,
  },
  transactionDesc: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
  },
  transactionDate: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#B8860B', // dark gold for amount
    alignSelf: 'center',
  },
  seeAllButton: {
    marginTop: -25,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#2a1b3d',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  seeAllText: {
    color: '#FFD700',
    fontWeight: '600',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fffdf8',
    borderRadius: 14,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#222',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
    color: '#222',
    backgroundColor: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  addButtonModal: {
    backgroundColor: '#2a1b3d',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  modalButtonText: {
    fontWeight: '600',
    fontSize: 15,
    color: '#333',
  },
});
