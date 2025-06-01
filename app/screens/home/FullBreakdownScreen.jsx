import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';

export default function FullBreakdownScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const transactions = route.params?.transactions || [];

  const grouped = {};
  transactions.forEach((tx) => {
    const month = moment(tx.date).format('MMMM YYYY');
    if (!grouped[month]) grouped[month] = {};
    const category = tx.category || 'Uncategorized';
    grouped[month][category] = (grouped[month][category] || 0) + tx.amount;
  });

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Total Expenses</Text>
      </View>

      <ScrollView style={styles.scroll}>
        {Object.entries(grouped).map(([month, categories]) => {
          const total = Object.values(categories).reduce((sum, val) => sum + val, 0);

          return (
            <View key={month} style={styles.card}>
              <Text style={styles.monthHeader}>{month}</Text>
              <View style={styles.tableHeader}>
                <Text style={styles.cellLeft}>Category</Text>
                <Text style={styles.cellRight}>Amount (₹)</Text>
              </View>

              {Object.entries(categories).map(([category, amount]) => (
                <View key={category} style={styles.row}>
                  <Text style={styles.cellLeft}>{category}</Text>
                  <Text style={styles.cellRight}>{amount.toFixed(2)}</Text>
                </View>
              ))}

              <View style={[styles.row, styles.totalRow]}>
                <Text style={[styles.cellLeft, styles.totalText]}>Total</Text>
                <Text style={[styles.cellRight, styles.totalText]}>
                  ₹{total.toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f4ed',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#333',
  },
  scroll: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fffefb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#ccc',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#007a5e',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 6,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  cellLeft: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  cellRight: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  totalRow: {
    borderTopWidth: 1,
    borderColor: '#aaa',
    marginTop: 10,
    paddingTop: 8,
  },
  totalText: {
    fontWeight: '700',
    color: '#000',
  },
});
