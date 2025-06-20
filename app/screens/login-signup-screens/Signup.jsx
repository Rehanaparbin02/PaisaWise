import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import PrettyPinkButton from '../../components/PrettyPinkButton';
import { supabase } from '../../../supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 7,
      tension: 40,
    }).start();
  }, []);

  const handleBack = () => {
    navigation.replace('LoginSignupPage');
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  async function handleSignup() {
    setLoading(true);

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill all the fields.');
      setLoading(false);
      return;
    }

    if (!isValidEmail(email.trim())) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        email: email.trim(),
        password: password.trim(), // Ideally hash this on the backend
      };
      const { data, error } = await supabase
        .from('user_data')
        .insert([payload]);

  //     if (error) throw error;

  //     console.log('Submitted form: ', payload);
  //     Alert.alert('Success', 'Successfully created account');

  //     setEmail('');
  //     setPassword('');
  //     setConfirmPassword('');
  //   } catch (error) {
  //     console.error('Signup error:', error);
  //     Alert.alert('Error', error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
        error? (() => {
        console.error('Signup error:', error);
        Alert.alert('Error', error.message);
      })()
    : (() => {
        console.log('Submitted form: ', payload);
        Alert.alert('Success', 'Successfully created account');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        navigation.replace('Login');
      })();
      } catch (error) {
        console.error('Unexpected signup error:', error);
        Alert.alert('Unexpected Error', error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
  }
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <PrettyPinkButton title="Back" onPress={handleBack} style={styles.backbtn} />

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
          value={email}
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          autoCapitalize="none"
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <PrettyPinkButton
          title={loading ? 'Creating...' : 'Complete Signup'}
          onPress={handleSignup}
          disabled={loading}
        />

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => Alert.alert('Coming Soon', 'Google Sign-in not yet implemented')}
        >
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
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  backbtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 60,
    height: 30,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#EB3678',
    marginTop: 90,
  },
  title: {
    fontSize: 20,
    color: '#555',
    fontWeight: '600',
    marginTop: 8,
  },
  subcontainer: {
    width: '90%',
    marginTop: 40,
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
  },
});
