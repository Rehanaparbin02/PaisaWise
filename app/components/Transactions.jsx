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
          <Text style={styles.seeAllText}>See All Transactions</Text>
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
              value={descInput}
              onChangeText={setDescInput}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Amount (₹)"
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
    marginTop: 12,
    padding: 20,
    backgroundColor: '#000000',
    borderRadius: 25
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F11A7B',
  },
  addButton: {
    backgroundColor: '#007aff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#007aff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  transactionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
    color: '#999',
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007aff',
    alignSelf: 'center',
  },
  seeAllButton: {
    marginTop: -25,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    backgroundColor: '#007aff',
    borderRadius: 25,
    elevation: 4,
  },
  seeAllText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 25,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    color: '#222',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    marginLeft: 12,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  addButtonModal: {
    backgroundColor: '#007aff',
  },
  modalButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
});
