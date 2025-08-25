import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MiniCard({ title, amount, iconName, iconColor, cardStyle }) {
  return (
    <LinearGradient
      colors={['#a484cd', '#442277', '#19043c']}
      locations={[0, 0.5, 1]}   // smooth transition control
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.miniCard, cardStyle]}
    >
      <View style={[styles.iconWrapper, { backgroundColor: iconColor + '22' }]}>
        <Ionicons name={iconName} size={22} color={iconColor} />
      </View>
      <Text style={styles.cardTypeTitle}>{title}</Text>
      <Text style={styles.cardTypeAmount}>₹{amount.toLocaleString()}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  miniCard: {
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginHorizontal: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.15)', // soft gold hint
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    padding: 12,
    borderRadius: 50,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTypeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E0D5C3', // champagne/ivory
    textTransform: 'uppercase',
    marginBottom: 4,
    letterSpacing: 1,
  },
  cardTypeAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFD700', // premium highlight
    textShadowColor: 'rgba(255,215,0,0.15)', // subtle glow
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
