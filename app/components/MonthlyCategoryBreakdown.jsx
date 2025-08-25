import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

export default function MonthlyCategoryBreakdown({ transactions = [], showAll = false }) {
  const navigation = useNavigation();
  if (!Array.isArray(transactions)) return null;

  const groupedByMonth = {};
  transactions.forEach((tx) => {
    const month = moment(tx.date).format('MMMM YYYY');
    if (!groupedByMonth[month]) groupedByMonth[month] = {};
    const category = tx.category || 'Uncategorized';
    if (!groupedByMonth[month][category]) groupedByMonth[month][category] = 0;
    groupedByMonth[month][category] += tx.amount;
  });

  const monthEntries = Object.entries(groupedByMonth);
  const visibleMonths = showAll ? monthEntries : monthEntries.slice(0, 2);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Monthly Category Breakdown</Text>
        {!showAll && (
          <TouchableOpacity
            onPress={() => navigation.navigate('FullBreakdown', { transactions })}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {visibleMonths.map(([month, categories]) => (
        <View key={month} style={styles.monthBlock}>
          <Text style={styles.month}>{month}</Text>
          {Object.entries(categories).map(([category, total]) => (
            <View key={category} style={styles.categoryItem}>
              <Text style={styles.category}>{category}</Text>
              <Text style={styles.amount}>₹{total.toFixed(2)}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fafafa', // light neutral for sunlight readability
    marginTop: 12,
    marginRight: 12,
    marginLeft: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333', // dark readable text
  },
  seeAll: {
    fontSize: 14,
    color: '#6a1b9a', // muted purple accent
    fontWeight: '600',
  },
  monthBlock: {
    marginBottom: 18,
  },
  month: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#444', // neutral strong text
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 2,
  },
  category: {
    fontSize: 15,
    color: '#555',
  },
  amount: {
    fontWeight: '600',
    fontSize: 15,
    color: '#b8860b', // muted gold for values
  },
});
