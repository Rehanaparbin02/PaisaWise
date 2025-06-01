import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function SeeAllTransactions() {
  const navigation = useNavigation();
  const route = useRoute();

  // Receive full transactions list from params
  const { transactions } = route.params;

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionCard}>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionDesc}>{item.description}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text style={[styles.transactionAmount, item.amount < 0 ? styles.negativeAmount : styles.positiveAmount]}>
        {item.amount < 0 ? '-' : ''}₹{Math.abs(item.amount).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with back */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>All Transactions</Text>
        <View style={{ width: 60 }} /> {/* placeholder to balance back button */}
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    width: 60,
  },
  backText: {
    fontSize: 18,
    color: '#007aff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
  },
  transactionCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  transactionLeft: {
    flexShrink: 1,
  },
  transactionDesc: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  transactionDate: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: '700',
    alignSelf: 'center',
  },
  positiveAmount: {
    color: '#007aff',
  },
  negativeAmount: {
    color: '#ff4d4d',
  },
});
