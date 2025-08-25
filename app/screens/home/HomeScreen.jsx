import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BudgetCard from '../../components/BugdetCard';
import Header from '../../components/Header';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { removeItem } from '../../../utils/asyncStorage';
import MiniCard from '../../components/MiniCards';
import MiniCarousal from '../../components/MiniCarousal';
import Transaction from '../../components/Transactions';
import MonthlyCategoryBreakdown from '../../components/MonthlyCategoryBreakdown';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [budgetRange, setBudgetRange] = useState([20000, 80000]);
  const [income, setIncome] = useState(50000);

  const restartOnboarding = async () => {
    await removeItem('onboarded');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      })
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header is now inside ScrollView to make it non-sticky */}
        <Header navigation={navigation} />
        
        <BudgetCard
          title="Monthly Budget Range"
          subtitle="October"
          budgetRange={budgetRange}
          onBudgetChange={setBudgetRange}
          income={income}
          onIncomeChange={setIncome}
          expense={8000}
        />

        <View style={styles.miniCardsContainer}>
          <MiniCard
            title="Total Balance"
            amount={125000}
            iconName="wallet-outline"
            iconColor="#2a9d8f"
            cardStyle={{ backgroundColor: '#d4f1f4' }}
          />
          <MiniCard
            title="Total Savings"
            amount={75000}
            iconName="save-outline"
            iconColor="#e76f51"
            cardStyle={{ backgroundColor: '#fbe7e6' }}
          />
        </View>

        <MiniCarousal />
        <Transaction />

        <MonthlyCategoryBreakdown
          transactions={[
            { id: '1', description: 'Groceries', amount: 2500, category: 'Food', date: '2025-05-01' },
            { id: '2', description: 'Internet Bill', amount: 1200, category: 'Utilities', date: '2025-05-03' },
            { id: '3', description: 'Gym', amount: 800, category: 'Fitness', date: '2025-05-10' },
            { id: '4', description: 'Restaurant', amount: 1500, category: 'Food', date: '2025-04-21' },
            { id: '5', description: 'Books', amount: 900, category: 'Education', date: '2025-04-12' },
          ]}
        />

        {/* Restart Button */}
        <TouchableOpacity style={styles.restartButton} onPress={restartOnboarding}>
          <Text style={styles.restartButtonText}>Restart Onboarding</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FBF6E2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 160, // space for bottom tabs / FAB
  },
  miniCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  restartButton: {
    backgroundColor: '#ffbe0b',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 30,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  restartButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});