import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function MiniCard({ title, amount, iconName, iconColor, cardStyle }) {
  return (
    <View style={[styles.miniCard, cardStyle]}>
      <View style={[styles.iconWrapper, { backgroundColor: iconColor + '22' }]}>
        <Ionicons name={iconName} size={24} color={iconColor} />
      </View>
      <Text style={styles.cardTypeTitle}>{title}</Text>
      <Text style={styles.cardTypeAmount}>₹{amount.toLocaleString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  miniCard: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: 16,
    marginHorizontal: 8,
    backgroundColor: '#f5f7fa',  // soft light gray background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 1,
  },
  iconWrapper: {
    padding: 14,
    borderRadius: 50,
    marginBottom: 10,
    backgroundColor: '#d1d9e6',  // subtle pastel behind icon
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',  // dark gray text
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  cardTypeAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e1e1e', // almost black, strong but not harsh
  },
});
