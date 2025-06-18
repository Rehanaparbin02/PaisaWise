import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
} from 'react-native';
import PrettyPinkButton from '../../components/PrettyPinkButton';

export default function Signup({ navigation }) {
  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 7,
      tension: 40,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>PaisaWise</Text>
      <Text style={styles.title}>Create Your Account</Text>

      <Animated.View style={[styles.subcontainer, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.subtitle}>
          No credit card required. Your data stays private and secure.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#ccc"
          secureTextEntry
        />

        <PrettyPinkButton
          title="Complete Signup"
          onPress={() => navigation.replace('Maintabs')}
        />

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Sign up with Google</Text>
        </TouchableOpacity>

        <Text style={styles.subtitleSmall}>
          Already have an account?{' '}
          <Text
            style={{ color: '#EB3678', textDecorationLine: 'underline' }}
            onPress={() => navigation.navigate('Login')}
          >
            Back to Login
          </Text>
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#EB3678',
    position: 'absolute',
    top: 60,
  },
  title: {
    fontSize: 20,
    color: '#555',
    fontWeight: '600',
    position: 'absolute',
    top: 105,
  },
  subcontainer: {
    width: '90%',
    padding: 24,
    backgroundColor: '#1C1A1A',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  subtitle: {
    fontSize: 16,
    color: '#F0E3E3',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 48,
    backgroundColor: '#2B2727',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  orText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginVertical: 12,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  googleButtonText: {
    color: '#EB3678',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitleSmall: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 15,
  },
});
