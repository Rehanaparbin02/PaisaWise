import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Animated, TouchableOpacity } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

//function to get realtime date and time
const getCurrentMonthAndDate = () => {
  const date = new Date();
  const month = date.toLocaleString('default', {month:'long'})
  const day = date.getDate()
  return `${month} ${day}`
}

export default function BudgetCard({
  title,
  subtitle,
  budgetRange,
  onBudgetChange,
  income,
  onIncomeChange,
  expense,
}) {
  const [isIncomeEditing, setIsIncomeEditing] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  // Handle income change with proper validation
  const handleIncomeChange = (value) => {
    const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    onIncomeChange(numericValue);
  };

  // Animation for card press
  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Calculate budget utilization percentage
  const budgetUtilization = expense / budgetRange[1] * 100;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <LinearGradient
        colors={[
          'rgba(30, 17, 51, 0.98)',
          'rgba(49, 22, 82, 0.95)',
          'rgba(65, 25, 108, 0.92)',
          'rgba(74, 28, 118, 0.95)',
          'rgba(45, 20, 75, 0.98)',
        ]}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.budgetCard}>

        {/* Luxury border accent */}
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FF8C00', '#FFA500', '#FFD700']}
          style={styles.luxuryBorder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />

        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.dateText}>{getCurrentMonthAndDate()}</Text>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
          
          {/* <View style={styles.budgetBadge}>
            <Text style={styles.badgeText}>PREMIUM</Text>
            <Ionicons name="diamond" size={16} color="#FFD700" />
          </View> */}
        </View>

        {/* Budget Range Slider Section */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Budget Range</Text>
            <View style={styles.rangeDisplay}>
              <Text style={styles.rangeText}>
                ₹{budgetRange[0].toLocaleString()} - ₹{budgetRange[1].toLocaleString()}
              </Text>
            </View>
          </View>
          
          <View style={styles.sliderWrapper}>
            <View style={styles.sliderRangeLabels}>
              <Text style={styles.sliderEndText}>₹0</Text>
              <Text style={styles.sliderEndText}>₹2,00,000</Text>
            </View>
            <MultiSlider
              values={budgetRange}
              sliderLength={280}
              onValuesChange={onBudgetChange}
              min={0}
              max={200000}
              step={1000}
              allowOverlap={false}
              snapped
              selectedStyle={{ 
                backgroundColor: '#FFD700',
                height: 8,
                borderRadius: 4,
                shadowColor: '#FFD700',
                shadowOpacity: 0.6,
                shadowRadius: 8,
                elevation: 4,
              }}
              unselectedStyle={{ 
                backgroundColor: 'rgba(255,255,255,0.2)',
                height: 8,
                borderRadius: 4,
              }}
              markerStyle={{
                height: 28,
                width: 28,
                borderRadius: 14,
                backgroundColor: '#FFD700',
                borderWidth: 6,
                borderColor: '#1e1133',
                shadowColor: '#FFD700',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
                elevation: 12,
              }}
              containerStyle={{ height: 50, alignItems: 'center' }}
            />
          </View>
        </View>

        {/* Financial Cards Section */}
        <View style={styles.miniCardsContainer}>
          <TouchableOpacity
            style={[styles.miniCard, styles.incomeCard]}
            onPress={() => setIsIncomeEditing(!isIncomeEditing)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255,215,0,0.05)', 'rgba(255,215,0,0.02)']}
              style={styles.cardGradientOverlay}
            />
            
            <View style={styles.cardIconContainer}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.iconGradient}
              >
                <Ionicons name="trending-up" size={22} color="#1e1133" />
              </LinearGradient>
            </View>
            
            <View style={styles.cardContent}>
              <Text style={styles.cardTypeTitle}>INCOME</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={[
                    styles.cardTypeAmountInput,
                    isIncomeEditing && styles.editingInput
                  ]}
                  value={income.toLocaleString()}
                  onChangeText={handleIncomeChange}
                  onFocus={() => setIsIncomeEditing(true)}
                  onBlur={() => setIsIncomeEditing(false)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#999"
                />
              </View>
              <Text style={styles.cardSubText}>Monthly Revenue</Text>
            </View>
            
            {isIncomeEditing && (
              <View style={styles.editIndicator}>
                <Ionicons name="create-outline" size={14} color="#FFD700" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.miniCard, styles.expenseCard]}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(138,43,226,0.05)', 'rgba(138,43,226,0.02)']}
              style={styles.cardGradientOverlay}
            />
            
            <View style={styles.cardIconContainer}>
              <LinearGradient
                colors={['#8A2BE2', '#9932CC']}
                style={styles.iconGradient}
              >
                <Ionicons name="trending-down" size={22} color="#ffffff" />
              </LinearGradient>
            </View>
            
            <View style={styles.cardContent}>
              <Text style={styles.cardTypeTitle}>EXPENSE</Text>
              <Text style={styles.cardTypeAmount}>₹{expense.toLocaleString()}</Text>
              <Text style={styles.cardSubText}>Current Period</Text>
            </View>
            
            {/* Budget utilization indicator */}
            <View style={styles.utilizationContainer}>
              <View style={styles.utilizationBar}>
                <LinearGradient
                  colors={
                    budgetUtilization > 80 ? ['#8A2BE2', '#9932CC'] : 
                    budgetUtilization > 60 ? ['#FF8C00', '#FFA500'] : ['#FFD700', '#FFA500']
                  }
                  style={[
                    styles.utilizationFill, 
                    { width: `${Math.min(budgetUtilization, 100)}%` }
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              <Text style={styles.utilizationText}>{budgetUtilization.toFixed(0)}%</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Luxury shimmer effect */}
        <LinearGradient
          colors={['transparent', 'rgba(255,215,0,0.1)', 'transparent']}
          style={styles.shimmerOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          pointerEvents="none"
        />

        {/* Bottom gradient overlay for depth */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.2)']}
          style={styles.bottomOverlay}
          pointerEvents="none"
        />
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  budgetCard: {
    borderRadius: 28,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    elevation: 20,
    shadowColor: '#1e1133',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  
  luxuryBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  
  titleContainer: {
    flex: 1,
  },
  
  dateText: {
    fontSize: 11,
    color: 'rgba(255,215,0,0.8)',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  
  cardTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFD700',
    textShadowColor: 'rgba(255,215,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 1,
    marginBottom: 6,
  },
  
  cardSubtitle: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
    letterSpacing: 1,
  },
  
  budgetBadge: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,215,0,0.4)',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  
  badgeText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '800',
    marginRight: 6,
    letterSpacing: 1,
  },
  
  sliderSection: {
    marginBottom: 28,
  },
  
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  sliderLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  
  rangeDisplay: {
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  
  rangeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  
  sliderWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  
  sliderRangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
    marginBottom: 12,
  },
  
  sliderEndText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  
  miniCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  
  miniCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    padding: 12,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.1)',
  },
  
  cardGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  incomeCard: {
    backgroundColor: 'rgba(255,255,255,0.98)',
  },
  
  expenseCard: {
    backgroundColor: 'rgba(255,255,255,0.98)',
  },
  
  cardIconContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  
  iconGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  
  cardContent: {
    paddingRight: 45,
    zIndex: 1,
  },
  
  cardTypeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  currencySymbol: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1e1133',
    marginRight: 3,
  },
  
  cardTypeAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e1133',
    marginBottom: 6,
  },
  
  cardTypeAmountInput: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e1133',
    padding: 0,
    minWidth: 90,
    borderBottomWidth: 0,
  },
  
  editingInput: {
    borderBottomWidth: 3,
    borderBottomColor: '#FFD700',
    paddingBottom: 3,
  },
  
  cardSubText: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  editIndicator: {
    position: 'absolute',
    top: 80,
    left: 100,
    backgroundColor: 'rgba(255,215,0,0.15)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  
  utilizationContainer: {
    position: 'absolute',
    bottom: 5,
    left: 10,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  utilizationBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  utilizationFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  utilizationText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#666',
    minWidth: 35,
    textAlign: 'right',
  },
  
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    opacity: 0.3,
  },
  
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
});