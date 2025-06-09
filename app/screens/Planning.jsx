

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const ProgressBar = ({ progress, color }) => (
  <View style={styles.progressBarBackground}>
    <View style={[styles.progressBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
  </View>
);

const Planning = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // Budgets stored by date, key is date string e.g. '2025-06-01'
  const [budgetsByDate, setBudgetsByDate] = useState({
    // Example default date budget
    '2025-06-01': {
      Food: 2000,
      Rent: 8000,
      Transport: 1500,
      Entertainment: 1000,
      Others: 500,
    },
    // You can pre-fill more dates if needed
  });

  // Store current budgets loaded for selectedDate
  const [currentBudget, setCurrentBudget] = useState({});

  // Inputs for adding budget item
  const [newBudgetCat, setNewBudgetCat] = useState('');
  const [newBudgetAmt, setNewBudgetAmt] = useState('');

  // Goals (assuming global, can extend to per-date if needed)
  const [goals, setGoals] = useState([
    { id: 1, title: 'Trip to Goa', target: 10000, saved: 3500 },
    { id: 2, title: 'Emergency Fund', target: 20000, saved: 8000 },
    { id: 3, title: 'New Laptop', target: 50000, saved: 12000 },
  ]);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', saved: '' });

  const [extraSpend, setExtraSpend] = useState('');

  // Update currentBudget whenever selectedDate changes
  useEffect(() => {
    if (selectedDate && budgetsByDate[selectedDate]) {
      setCurrentBudget(budgetsByDate[selectedDate]);
    } else if (selectedDate) {
      // If no budget for selected date, fallback to empty or default
      setCurrentBudget({});
    }
  }, [selectedDate, budgetsByDate]);

  // Computed values based on currentBudget
  const totalBudget = Object.values(currentBudget).reduce((a, b) => a + b, 0);
  const estimatedSpent = totalBudget * 0.75; // estimated spent 75%
  const extraSpendNum = Number(extraSpend) || 0;
  const projectedSpent = estimatedSpent + extraSpendNum;
  const remaining = totalBudget - projectedSpent;
  const totalSaved = goals.reduce((sum, goal) => sum + goal.saved, 0);

  const past3MonthsSpending = [14000, 15000, 15500];
  const avgSpend = past3MonthsSpending.reduce((a, b) => a + b, 0) / past3MonthsSpending.length;
  const predictedNextMonth = avgSpend * 1.05;

  const colors = {
    background: darkMode ? '#121212' : '#FBF6E2',
    textPrimary: darkMode ? '#E0E0E0' : '#333',
    cardBackground: darkMode ? '#1E1E1E' : '#fff',
    accent: '#D9A028',
    success: '#16a34a',
    danger: '#dc2626',
    secondaryText: darkMode ? '#BBBBBB' : '#5A432E',
  };

  // Add budget item for current selected date
  const handleAddBudget = () => {
    if (!selectedDate) {
      return Alert.alert('Select a date', 'Please select a date first to add budget.');
    }
    const name = newBudgetCat.trim();
    const amount = parseInt(newBudgetAmt);
    if (!name || isNaN(amount)) {
      return Alert.alert('Invalid input', 'Please enter valid category and amount.');
    }
    const updatedBudget = { ...(budgetsByDate[selectedDate] || {}), [name]: amount };
    setBudgetsByDate({ ...budgetsByDate, [selectedDate]: updatedBudget });
    setCurrentBudget(updatedBudget);
    setNewBudgetCat('');
    setNewBudgetAmt('');
  };

  // Delete budget item for current selected date
  const handleDeleteBudget = (cat) => {
    if (!selectedDate) return;
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete the budget category "${cat}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedBudget = { ...(budgetsByDate[selectedDate] || {}) };
            delete updatedBudget[cat];
            const newBudgetsByDate = { ...budgetsByDate, [selectedDate]: updatedBudget };
            setBudgetsByDate(newBudgetsByDate);
            setCurrentBudget(updatedBudget);
          },
        },
      ]
    );
  };

  // Goal handlers unchanged, but can extend if needed
  const handleAddGoal = () => {
    const { title, target, saved } = newGoal;
    if (!title.trim() || isNaN(target) || isNaN(saved)) {
      Alert.alert('Invalid input', 'Please enter valid goal details.');
      return;
    }
    const newId = goals.length > 0 ? goals[goals.length - 1].id + 1 : 1;
    setGoals([...goals, { id: newId, title: title.trim(), target: Number(target), saved: Number(saved) }]);
    setNewGoal({ title: '', target: '', saved: '' });
  };

  const handleDeleteGoal = (id) => {
    Alert.alert(
      'Delete Goal',
      `Are you sure you want to delete this goal?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setGoals(goals.filter(goal => goal.id !== id));
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingBottom: 100 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.heading, { color: colors.textPrimary }]}>Planning</Text>
        <View style={styles.darkModeToggle}>
          <Text style={{ color: colors.textPrimary, marginRight: 8 }}>Dark Mode</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} />
        </View>
      </View>

      {/* Calendar Tracker */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Calendar Tracker</Text>
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: colors.accent },
          }}
          theme={{
            backgroundColor: colors.cardBackground,
            calendarBackground: colors.cardBackground,
            dayTextColor: colors.textPrimary,
            monthTextColor: colors.textPrimary,
            arrowColor: colors.accent,
            selectedDayBackgroundColor: colors.accent,
            todayTextColor: colors.accent,
          }}
        />
        {selectedDate !== '' && (
          <Text style={{ color: colors.textPrimary, marginTop: 8 }}>
            Selected Date: <Text style={{ fontWeight: '700' }}>{selectedDate}</Text>
          </Text>
        )}
      </View>

      {/* Budget Overview */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Budget Overview</Text>
        {Object.entries(currentBudget).length === 0 && (
          <Text style={{ color: colors.secondaryText, fontStyle: 'italic' }}>
            No budget data for selected date.
          </Text>
        )}
        {Object.entries(currentBudget).map(([cat, amount]) => (
          <View key={cat} style={styles.budgetRow}>
            <Text style={[styles.category, { color: colors.textPrimary }]}>{cat}</Text>
            <Text style={[styles.amount, { color: colors.textPrimary }]}>₹{amount.toLocaleString()}</Text>
            <TouchableOpacity onPress={() => handleDeleteBudget(cat)}>
              <Text style={{ color: colors.danger, fontWeight: '700' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Category"
            placeholderTextColor={colors.secondaryText}
            value={newBudgetCat}
            onChangeText={setNewBudgetCat}
            style={[styles.inputSmall, { color: colors.textPrimary, borderColor: colors.accent }]}
          />
          <TextInput
            placeholder="Amount"
            placeholderTextColor={colors.secondaryText}
            value={newBudgetAmt}
            onChangeText={setNewBudgetAmt}
            keyboardType="numeric"
            style={[styles.inputSmall, { color: colors.textPrimary, borderColor: colors.accent }]}
          />
          <TouchableOpacity onPress={handleAddBudget}>
            <Text style={{ color: colors.accent, fontWeight: '700' }}>+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Goal Tracking */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Goal Tracking</Text>
        {goals.length === 0 && <Text style={{ color: colors.secondaryText, fontStyle: 'italic' }}>No goals yet.</Text>}
        {goals.map((goal) => {
          const progress = goal.saved / goal.target;
          return (
            <View key={goal.id} style={{ marginBottom: 12 }}>
              <View style={styles.budgetRow}>
                <Text style={[styles.category, { color: colors.textPrimary }]}>{goal.title}</Text>
                <Text style={[styles.amount, { color: colors.textPrimary }]}>₹{goal.saved.toLocaleString()} / ₹{goal.target.toLocaleString()}</Text>
                <TouchableOpacity onPress={() => handleDeleteGoal(goal.id)}>
                  <Text style={{ color: colors.danger, fontWeight: '700' }}>Delete</Text>
                </TouchableOpacity>
              </View>
              <ProgressBar progress={progress > 1 ? 1 : progress} color={colors.accent} />
            </View>
          );
        })}
        <View style={{ marginTop: 12 }}>
          <TextInput
            placeholder="Goal Title"
            placeholderTextColor={colors.secondaryText}
            value={newGoal.title}
            onChangeText={(text) => setNewGoal(g => ({ ...g, title: text }))}
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.accent, marginBottom: 8 }]}
          />
          <TextInput
            placeholder="Target Amount"
            placeholderTextColor={colors.secondaryText}
            value={newGoal.target}
            onChangeText={(text) => setNewGoal(g => ({ ...g, target: text }))}
            keyboardType="numeric"
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.accent, marginBottom: 8 }]}
          />
          <TextInput
            placeholder="Saved Amount"
            placeholderTextColor={colors.secondaryText}
            value={newGoal.saved}
            onChangeText={(text) => setNewGoal(g => ({ ...g, saved: text }))}
            keyboardType="numeric"
            style={[styles.input, { color: colors.textPrimary, borderColor: colors.accent, marginBottom: 8 }]}
          />
          <TouchableOpacity onPress={handleAddGoal} style={{ alignSelf: 'flex-start' }}>
            <Text style={{ color: colors.accent, fontWeight: '700' }}>+ Add Goal</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* What-if Spending */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>What-if Spending?</Text>
        <TextInput
          style={[styles.input, { color: colors.textPrimary, borderColor: colors.accent }]}
          placeholder="Add extra spending amount"
          placeholderTextColor={colors.secondaryText}
          keyboardType="numeric"
          value={extraSpend}
          onChangeText={setExtraSpend}
        />
        <Text style={{ color: colors.textPrimary, marginTop: 8 }}>
          Projected Spending: <Text style={{ fontWeight: '700' }}>₹{projectedSpent.toLocaleString()}</Text>
        </Text>
        <Text style={{ color: remaining < 0 ? colors.danger : colors.success, marginTop: 4 }}>
          Remaining Budget: ₹{remaining.toLocaleString()}
        </Text>
        {projectedSpent > totalBudget && (
          <Text style={[styles.warningText, { color: colors.danger }]}>Warning: This exceeds your total budget!</Text>
        )}
        <TouchableOpacity style={{ marginTop: 12, alignSelf: 'flex-start' }}>
          <Text style={{ color: colors.accent, textDecorationLine: 'underline' }}>
            Export to CSV (Coming soon)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Expense Prediction */}
      <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.sectionTitle, { color: colors.accent }]}>Expense Prediction</Text>
        <Text style={{ color: colors.textPrimary }}>
          Based on your last 3 months spending trend, your predicted spending for next month is:
        </Text>
        <Text style={{ color: colors.accent, fontWeight: '700', marginTop: 6, fontSize: 18 }}>
          ₹{Math.round(predictedNextMonth).toLocaleString()}
        </Text>
        {predictedNextMonth > totalBudget && (
          <Text style={[styles.warningText, { color: colors.danger }]}>Your predicted spending exceeds your budget!</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Planning;

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
  },
  darkModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  category: { fontSize: 16 },
  amount: { fontSize: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  inputSmall: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 70,
    marginRight: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarFill: {
    height: 10,
    borderRadius: 12,
  },
  warningText: { marginTop: 8, fontWeight: '600' },
});
