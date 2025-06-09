import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
} from 'react-native';

const Wallet = () => {
  // Sample data
  const [totalBalance, setTotalBalance] = useState(120000);
  const [accounts, setAccounts] = useState([
    { id: 'acc1', name: 'Savings Account', balance: 60000 },
    { id: 'acc2', name: 'Checking Account', balance: 40000 },
    { id: 'acc3', name: 'Wallet Cash', balance: 20000 },
  ]);

  // Transactions state
  const [transactions, setTransactions] = useState([
    { id: 'tx1', date: '2025-06-01', category: 'Food', amount: 1200, type: 'expense', mood: 'happy' },
    { id: 'tx2', date: '2025-06-02', category: 'Salary', amount: 50000, type: 'income', mood: 'happy' },
    { id: 'tx3', date: '2025-06-03', category: 'Bills', amount: 3000, type: 'expense', mood: 'sad' },
    { id: 'tx4', date: '2025-06-04', category: 'Entertainment', amount: 1500, type: 'expense', mood: 'angry' },
    { id: 'tx5', date: '2025-06-05', category: 'Food', amount: 700, type: 'expense', mood: 'happy' },
    { id: 'tx6', date: '2025-05-28', category: 'Salary', amount: 48000, type: 'income', mood: 'happy' },
    { id: 'tx7', date: '2025-05-20', category: 'Rent', amount: 10000, type: 'expense', mood: 'sad' },
  ]);

  const moods = [
    { id: 'all', label: 'All', color: '#ccc' },
    { id: 'happy', label: 'Happy', color: '#ffd700' },
    { id: 'sad', label: 'Sad', color: '#1e90ff' },
    { id: 'angry', label: 'Angry', color: '#e63946' },
    { id: 'neutral', label: 'Neutral', color: '#888' },
  ];

  const [selectedMood, setSelectedMood] = useState('all');

  // Filter transactions by mood
  const filteredTransactions = useMemo(() => {
    if (selectedMood === 'all') return transactions;
    return transactions.filter(tx => tx.mood === selectedMood);
  }, [selectedMood, transactions]);

  // Group transactions by category for recent transactions display
  const transactionsByCategory = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => {
      if (!acc[tx.category]) acc[tx.category] = [];
      acc[tx.category].push(tx);
      return acc;
    }, {});
  }, [filteredTransactions]);

  // Group transactions by month for monthly summary
  const monthlySummary = useMemo(() => {
    // Group by YYYY-MM string
    const summary = {};
    transactions.forEach(tx => {
      const month = tx.date.slice(0, 7); // YYYY-MM
      if (!summary[month]) {
        summary[month] = { income: 0, expense: 0 };
      }
      if (tx.type === 'income') summary[month].income += tx.amount;
      else summary[month].expense += tx.amount;
    });

    // Convert to sorted array (latest month first)
    return Object.entries(summary)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([month, totals]) => ({ month, ...totals }));
  }, [transactions]);

  // Modal and quick action states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [billType, setBillType] = useState('');

  const handleQuickAction = (type) => {
    setModalType(type.toLowerCase().replace(' ', '')); // e.g. 'Add Money' -> 'addMoney'
    setAmount('');
    setRecipient('');
    setBillType('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Helper to create unique IDs for new transactions
  const generateTxId = () => `tx${Math.floor(Math.random() * 1000000)}`;

  // Add Money - income
  const handleAddMoneySubmit = () => {
    if (!amount) return alert('Please enter amount');
    const amtNum = Number(amount);
    if (isNaN(amtNum) || amtNum <= 0) return alert('Invalid amount');

    // Add amount to Wallet Cash (id 'acc3')
    setAccounts((prev) => {
      const updated = [...prev];
      const walletIndex = updated.findIndex(acc => acc.id === 'acc3');
      if (walletIndex !== -1) updated[walletIndex].balance += amtNum;
      return updated;
    });
    setTotalBalance((prev) => prev + amtNum);

    // Add transaction as income
    const newTx = {
      id: generateTxId(),
      date: new Date().toISOString().split('T')[0],
      category: 'Add Money',
      amount: amtNum,
      type: 'income',
      mood: 'happy',
    };
    setTransactions((prev) => [newTx, ...prev]);

    closeModal();
  };

  // Transfer - expense
  const handleTransferSubmit = () => {
    if (!amount || !recipient) return alert('Please enter amount and recipient');
    const amtNum = Number(amount);
    if (isNaN(amtNum) || amtNum <= 0) return alert('Invalid amount');
    if (amtNum > accounts[0].balance) return alert('Insufficient balance');

    setAccounts((prev) => {
      const updated = [...prev];
      updated[0].balance -= amtNum;
      return updated;
    });
    setTotalBalance((prev) => prev - amtNum);

    const newTx = {
      id: generateTxId(),
      date: new Date().toISOString().split('T')[0],
      category: `Transfer to ${recipient}`,
      amount: amtNum,
      type: 'expense',
      mood: 'neutral',
    };
    setTransactions((prev) => [newTx, ...prev]);

    closeModal();
  };

  // Pay Bills - expense
  const handlePayBillsSubmit = () => {
    if (!amount || !billType) return alert('Please enter amount and bill type');
    const amtNum = Number(amount);
    if (isNaN(amtNum) || amtNum <= 0) return alert('Invalid amount');
    if (amtNum > accounts[0].balance) return alert('Insufficient balance');

    setAccounts((prev) => {
      const updated = [...prev];
      updated[0].balance -= amtNum;
      return updated;
    });
    setTotalBalance((prev) => prev - amtNum);

    const newTx = {
      id: generateTxId(),
      date: new Date().toISOString().split('T')[0],
      category: billType,
      amount: amtNum,
      type: 'expense',
      mood: 'sad',
    };
    setTransactions((prev) => [newTx, ...prev]);

    closeModal();
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Wallet Summary */}
        <View style={styles.section}>
          <Text style={styles.title}>Total Balance</Text>
          <Text style={styles.balance}>₹{totalBalance.toLocaleString()}</Text>
        </View>

        {/* Accounts Horizontal Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.section}>
          {accounts.map((acc) => (
            <View key={acc.id} style={styles.accountCard}>
              <Text style={styles.accountName}>{acc.name}</Text>
              <Text style={styles.accountBalance}>₹{acc.balance.toLocaleString()}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Monthly Transactions Summary */}
        <View style={styles.section}>
          <Text style={styles.title}>Monthly Transactions Summary</Text>
          {monthlySummary.length === 0 ? (
            <Text style={styles.noTxText}>No transaction data available.</Text>
          ) : (
            monthlySummary.map(({ month, income, expense }) => {
              const monthLabel = new Date(month + '-01').toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              });
              return (
                <View key={month} style={styles.monthSummaryRow}>
                  <Text style={styles.monthLabel}>{monthLabel}</Text>
                  <View style={styles.monthSummaryAmounts}>
                    <Text style={[styles.incomeAmount]}>+₹{income.toLocaleString()}</Text>
                    <Text style={[styles.expenseAmount]}>-₹{expense.toLocaleString()}</Text>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Mood Filter */}
        <View style={[styles.section, styles.moodRow]}>
          {moods.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={[
                styles.moodCircle,
                { backgroundColor: m.color },
                selectedMood === m.id && styles.moodSelected,
              ]}
              onPress={() => setSelectedMood(m.id)}
              accessibilityLabel={`Filter by mood ${m.label}`}
            />
          ))}
        </View>

        {/* Recent Transactions by Category */}
        <View style={styles.section}>
          <Text style={styles.title}>Recent Transactions</Text>
          {filteredTransactions.length === 0 ? (
            <Text style={styles.noTxText}>No transactions for this mood.</Text>
          ) : (
            Object.entries(transactionsByCategory).map(([category, txs]) => (
              <View key={category} style={styles.categoryGroup}>
                <Text style={styles.categoryHeader}>{category}</Text>
                {txs.map((tx) => (
                  <View key={tx.id} style={styles.txRow}>
                    <Text style={styles.txDate}>{tx.date}</Text>
                    <Text
                      style={[
                        styles.txAmount,
                        tx.type === 'expense' ? { color: '#e63946' } : { color: '#2a9d8f' },
                      ]}
                    >
                      {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString()}
                    </Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, styles.actionRow]}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleQuickAction('Add Money')}>
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleQuickAction('Transfer')}>
            <Text style={styles.actionText}>Transfer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleQuickAction('Pay Bills')}>
            <Text style={styles.actionText}>Pay Bills</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal for Quick Actions */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalWrapper}>
            <ScrollView
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.modalTitle}>
                {modalType === 'addMoney' && 'Add Money'}
                {modalType === 'transfer' && 'Transfer Money'}
                {modalType === 'payBills' && 'Pay Bills'}
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />

              {modalType === 'transfer' && (
                <TextInput
                  style={styles.input}
                  placeholder="Recipient"
                  value={recipient}
                  onChangeText={setRecipient}
                />
              )}

              {modalType === 'payBills' && (
                <TextInput
                  style={styles.input}
                  placeholder="Bill Type (e.g. Electricity)"
                  value={billType}
                  onChangeText={setBillType}
                />
              )}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                  onPress={closeModal}
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, { backgroundColor: '#007bff' }]}
                  onPress={
                    modalType === 'addMoney'
                      ? handleAddMoneySubmit
                      : modalType === 'transfer'
                      ? handleTransferSubmit
                      : handlePayBillsSubmit
                  }
                >
                  <Text style={{ color: 'white' }}>Submit</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },

  section: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },

  balance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2a9d8f',
  },

  accountCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    width: 160,
    elevation: 3,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '600',
  },
  accountBalance: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
  },

  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  moodCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.5,
  },
  moodSelected: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#000',
  },

  categoryGroup: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  categoryHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  txDate: {
    fontSize: 14,
    color: '#555',
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '600',
  },

  noTxText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionBtn: {
    backgroundColor: '#2a9d8f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalWrapper: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
  },
  modalContent: {
    flexGrow: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },

  monthSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  monthSummaryAmounts: {
    flexDirection: 'row',
    gap: 12,
  },
  incomeAmount: {
    color: '#2a9d8f',
    fontWeight: '700',
    marginRight: 12,
  },
  expenseAmount: {
    color: '#e63946',
    fontWeight: '700',
  },
});

export default Wallet;
