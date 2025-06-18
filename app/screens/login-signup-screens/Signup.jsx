import React, { useState,useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  TouchableOpacity,
} from 'react-native';
import PrettyPinkButton from '../../components/PrettyPinkButton';
import { supabase } from '../../../supabase';
import { useSafeAreaFrame } from 'react-native-safe-area-context';
import { Alert } from 'react-native';

export default function Signup({ navigation }) {
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
   const [loading, setLoading] = useState(false)


  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 7,
      tension: 40,
    }).start();
  }, []);

  const handleBack = () =>{
    navigation.replace('LoginSignupPage');
  }

  // async function handleSignup() {
  //   setLoading(true)
  //   console.log('handleSignup()')
  //   const {
  //     data: {session},
  //     error,
  //   } = await supabase.auth.signup({
  //     email: email,
  //     password: password,
  //   })
    
  //   console.log('data:',data)
  //   if (error) {
  //     Alert.alert(error.message) 
  //     console.log('error: ', error)
  //   }   
  //   if (!session) {
  //     console.log('session not working ')
  //         Alert.alert('Please check your inbox for email verification!')
  //  } else {
  //   console.log('session working ')
  //     navigation.replace('ProfileSetup')
  //   }
  //   setLoading(false)
  //   }

async function handleSignup() {
  setLoading(true);
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message);
    } else {
      if (data.user && !data.session) {
        Alert.alert(
          'Verify your email',
          'A verification link has been sent to your inbox. Please verify before logging in.'
        );
        navigation.replace('Login'); // or wherever you want to go post-registration
      } else {
        // Only if session is immediately returned, which is rare
        navigation.replace('ProfileSetup');
      }
    }
  } catch (err) {
    console.error('Unexpected signup error:', err);
    Alert.alert('Unexpected Error', 'Please try again later.');
  } finally {
    setLoading(false);
  }
}


  return (
    <View style={styles.container}>

      <PrettyPinkButton title="Back"  onPress={handleBack} style={styles.backbtn}/>

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
          autoCapitalize={'none'}
          onChangeText={(text) => setEmail(text)}

        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
          value={password}
          autoCapitalize={'none'}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          onChangeText={(text) => setConfirmPassword(text)}
        />

        <PrettyPinkButton
          title="Complete Signup"
          onPress={() => handleSignup()}
          disabled={loading}
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

  backbtn:{
    position: 'absolute',
    top: 550 ,
    left: -180,
    width: 50,
    height: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
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
