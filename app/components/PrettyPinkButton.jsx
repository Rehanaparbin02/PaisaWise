// components/PrettyPinkButton.js
import React, { useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, Easing } from 'react-native';

export default function PrettyPinkButton({ title, onPress, style }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.out(Easing.circle),
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
      easing: Easing.out(Easing.circle),
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }], alignSelf: 'center' }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[styles.pinkButton, style]}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pinkButton: {
    backgroundColor: '#ff69b4',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#ff69b4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
