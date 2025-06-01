import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function BudgetCard({
  title,
  subtitle,
  budgetRange,
  onBudgetChange,
  income,
  expense,
}) {
  return (
    <LinearGradient
      colors={[
        'rgba(25, 74, 99, 0.72)',
        'rgba(51, 150, 201, 0.72)',
        'rgba(25, 74, 99, 0.72)',
      ]}
      start={{ x: 0.4, y: 0 }}
      end={{ x: 0.6, y: 1 }}
      style={styles.budgetCard}>

      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>

      <View style={styles.sliderWrapper}>
        <Text style={styles.sliderLabel}>
          Set Budget Range: ₹{budgetRange[0].toLocaleString()} - ₹{budgetRange[1].toLocaleString()}
        </Text>
        <View style={styles.sliderRangeLabels}>
          <Text style={styles.sliderEndText}>₹0</Text>
          <Text style={styles.sliderEndText}>₹2,00,000</Text>
        </View>
        <MultiSlider
          values={budgetRange}
          sliderLength={300}
          onValuesChange={onBudgetChange}
          min={0}
          max={200000}
          step={1000}
          allowOverlap={false}
          snapped
          selectedStyle={{ backgroundColor: '#00756A' }}
          unselectedStyle={{ backgroundColor: '#d3d3d3' }}
          markerStyle={{
            height: 30,
            width: 30,
            borderRadius: 15,
            backgroundColor: '#00756A',
          }}
          containerStyle={{ height: 60 }}
        />
      </View>

      <View style={styles.miniCardsContainer}>
        <View style={[styles.miniCard, styles.incomeCard]}>
          <Ionicons name="cash-outline" size={24} color="#00756A" style={styles.icon} />
          <Text style={styles.cardTypeTitle}>Income</Text>
          <Text style={styles.cardTypeAmount}>₹{income.toLocaleString()}</Text>
        </View>
        <View style={[styles.miniCard, styles.expenseCard]}>
          <Ionicons name="card-outline" size={24} color="#b3301a" style={styles.icon} />
          <Text style={styles.cardTypeTitle}>Expense</Text>
          <Text style={styles.cardTypeAmount}>₹{expense.toLocaleString()}</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  budgetCard: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 10,
    marginTop: -5,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderColor: 'white',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#e0f7ec',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#b0c4c9',
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: 0,
  },
  sliderWrapper: {
    marginVertical: 10,
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  sliderRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    marginBottom: 0,
  },
  sliderEndText: {
    fontSize: 12,
    color: '#eee',
  },
  miniCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -5,
    paddingHorizontal: 4,
  },
  miniCard: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  incomeCard: {
    backgroundColor: '#e0f7ec',
    // borderLeftWidth: 6,
    // borderLeftColor: '#00756A',
  },
  expenseCard: {
    backgroundColor: '#fdecea',
    // borderLeftWidth: 6,
    // borderLeftColor: '#b3301a',
  },
  cardTypeTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#333',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  cardTypeAmount: {
    fontSize: 16,
    marginTop: 6,
    fontWeight: '600',
    color: '#444',
  },
  icon: {
    position: 'absolute',
    top: 15,
    left: 8,
  },
});
