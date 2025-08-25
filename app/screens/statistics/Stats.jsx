import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Chart from './charts/Charts';
import { AntDesign } from '@expo/vector-icons';

const filterOptions = ['Last 30 Days', 'Last 3 Months', 'Yearly'];

const Stats = () => {
  const [filter, setFilter] = useState('Last 30 Days');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const getChartData = () => {
    switch (filter) {
      case 'Last 3 Months':
        return {
          labels: ['Apr', 'May', 'Jun'],
          data: [5200, 7300, 6100],
        };
      case 'Yearly':
        return {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [4200, 4800, 5200, 5900, 6100, 5700],
        };
      default:
        return {
          labels: ['1', '5', '10', '15', '20', '25', '30'],
          data: [1000, 1200, 800, 1500, 1800, 1600, 1900],
        };
    }
  };

  const chartProps = getChartData();

  // Derived data for Savings and Expenses
  const savingsData = chartProps.data.map((v) => Math.round(v * 0.4));
  const expensesData = chartProps.data.map((v) => Math.round(v * 0.6));

  // Totals
  const totalCurrent = chartProps.data.reduce((a, b) => a + b, 0);
  const totalSavings = savingsData.reduce((a, b) => a + b, 0);
  const totalExpenses = expensesData.reduce((a, b) => a + b, 0);

  // Calculate total positive and negative values from current balance
  const totalPositive = chartProps.data
    .filter((v) => v > 0)
    .reduce((a, b) => a + b, 0);
  const totalNegative = chartProps.data
    .filter((v) => v < 0)
    .reduce((a, b) => a + b, 0);

  // Average current balance
  const avgCurrent = (totalCurrent / chartProps.data.length).toFixed(0);

  // Close dropdown if user taps outside
  const dismissDropdown = () => {
    if (dropdownVisible) setDropdownVisible(false);
  };

  return (
    <SafeAreaView style={styles.main_container}>
      <TouchableWithoutFeedback onPress={dismissDropdown}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.heading}>📊 Your Statistics</Text>

            {/* Filter Dropdown */}
            <View style={{ position: 'relative', zIndex: 10 }}>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setDropdownVisible(!dropdownVisible)}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownText}>{filter}</Text>
                <AntDesign
                  name={dropdownVisible ? 'up' : 'down'}
                  size={16}
                  color="#333"
                />
              </TouchableOpacity>

              {dropdownVisible && (
                <View style={styles.dropdown}>
                  {filterOptions.map((option, index) => (
                    <Pressable
                      key={index}
                      onPress={() => {
                        setFilter(option);
                        setDropdownVisible(false);
                      }}
                      style={({ pressed }) => [
                        styles.dropdownItem,
                        pressed && { backgroundColor: '#FFE8B0' },
                      ]}
                    >
                      <Text style={styles.dropdownItemText}>{option}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Stat Cards */}
          <View style={{ zIndex: 0 }}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>💰 Current Balance</Text>
              <Chart labels={chartProps.labels} data={chartProps.data} />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>🏦 Savings Balance</Text>
              <Chart labels={chartProps.labels} data={savingsData} />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>💸 Expenses</Text>
              <Chart labels={chartProps.labels} data={expensesData} />
            </View>

            {/* Summary Title */}
            <Text style={styles.summaryText}>📈 Summary Report ({filter})</Text>

            {/* Final Report Section */}
            <View style={styles.finalReportCard}>
              <Text style={styles.finalReportTitle}>📊 Final Report Summary</Text>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Total Current Balance:</Text>
                <Text style={styles.reportValue}>₹{totalCurrent.toLocaleString()}</Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Total Savings:</Text>
                <Text style={styles.reportValue}>₹{totalSavings.toLocaleString()}</Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Total Expenses:</Text>
                <Text style={styles.reportValue}>₹{totalExpenses.toLocaleString()}</Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Total Positive Amount:</Text>
                <Text style={[styles.reportValue, { color: '#16a34a' }]}>
                  ₹{totalPositive.toLocaleString()}
                </Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Total Negative Amount:</Text>
                <Text style={[styles.reportValue, { color: '#dc2626' }]}>
                  ₹{totalNegative.toLocaleString()}
                </Text>
              </View>
              <View style={styles.reportRow}>
                <Text style={styles.reportLabel}>Average Current Balance:</Text>
                <Text style={styles.reportValue}>₹{Number(avgCurrent).toLocaleString()}</Text>
              </View>
              <View style={styles.reportSummary}>
                <Text style={styles.reportSummaryText}>
                  Your savings constitute{' '}
                  <Text style={{ fontWeight: '700' }}>
                    {((totalSavings / totalCurrent) * 100).toFixed(1)}%
                  </Text>{' '}
                  of your current balance, and your expenses are about{' '}
                  <Text style={{ fontWeight: '700' }}>
                    {((totalExpenses / totalCurrent) * 100).toFixed(1)}%
                  </Text>
                  .
                </Text>
                <Text style={[styles.reportSummaryText, { marginTop: 8 }]}>
                  Positives make up{' '}
                  <Text style={{ color: '#16a34a', fontWeight: '700' }}>
                    {((totalPositive / totalCurrent) * 100).toFixed(1)}%
                  </Text>{' '}
                  and negatives constitute{' '}
                  <Text style={{ color: '#dc2626', fontWeight: '700' }}>
                    {((Math.abs(totalNegative) / totalCurrent) * 100).toFixed(1)}%
                  </Text>{' '}
                  of your current balance.
                </Text>
                <Text style={[styles.reportSummaryText, { marginTop: 12, fontStyle: 'italic' }]}>
                  Insight: Maintaining a good balance between your savings and expenses is key. Keep
                  tracking these trends regularly to improve your financial health.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Stats;

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    backgroundColor: '#FBF6E2',
  },
  scrollContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  dropdownButton: {
    backgroundColor: '#FFCF81',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dropdownText: {
    fontWeight: '600',
    color: '#333',
  },
  dropdown: {
    position: 'absolute',
    top: 44,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
  },
  summaryText: {
    fontSize: 16,
    color: '#444',
    marginTop: 12,
    fontWeight: '500',
  },
  finalReportCard: {
    backgroundColor: '#FCE7D8', // warm light orange
    padding: 20,
    borderRadius: 16,
    marginTop: 16,
    shadowColor: '#B45309',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  finalReportTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 12,
    textAlign: 'center',
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  reportLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  reportValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400E',
  },
  reportSummary: {
    marginTop: 12,
  },
  reportSummaryText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#7C2D12',
    textAlign: 'center',
  },
});
