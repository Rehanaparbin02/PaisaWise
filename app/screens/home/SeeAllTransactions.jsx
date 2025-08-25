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
      <Text
        style={[
          styles.transactionAmount,
          item.amount < 0 ? styles.negativeAmount : styles.positiveAmount,
        ]}
      >
        {item.amount < 0 ? '-' : '+'}₹{Math.abs(item.amount).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with back */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>All Transactions</Text>
        <View style={{ width: 60 }} /> {/* placeholder */}
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
    backgroundColor: '#1a1326', // soft dark purple
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  backButton: {
    width: 60,
  },
  backText: {
    fontSize: 18,
    color: '#FFD700', // gold back button
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFD700', // gold title
  },
  transactionCard: {
    backgroundColor: '#fffdf8', // ivory card
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    elevation: 2,
  },
  transactionLeft: {
    flexShrink: 1,
  },
  transactionDesc: {
    fontSize: 16,
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
    alignSelf: 'center',
  },
  positiveAmount: {
    color: '#B8860B', // dark gold for income
  },
  negativeAmount: {
    color: '#C0392B', // muted red for expense
  },
});
