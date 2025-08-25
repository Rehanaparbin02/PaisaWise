import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Alert,
} from 'react-native';
import PrettyPinkButton from '../../components/PrettyPinkButton';
import { supabase } from '../../../supabase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogin = async () => {
    const { data,error} = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) {
      console.log('Error during login:', error);
      Alert.alert('Loging In Failed: ', error);
      return;
    }

    Alert.alert(
      'Login successful.',
    );
    navigation.replace('Home');
  };

  const handleBack = () =>{
    navigation.replace('LoginSignupPage');
  }

  return (
    <View style={styles.container}>
      <PrettyPinkButton title="Back"  onPress={handleBack} style={styles.backbtn}/>

      <Text style={styles.heading}>Welcome Back!</Text>
      <Text style={styles.subheading}>Log into your account</Text>

      <Animated.View style={[styles.formContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <PrettyPinkButton title="Login" onPress={handleLogin} />

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity style={styles.googleButton}>
          <View style={styles.googleButtonContent}>
            <Image
              source={require('../../../assets/onbaording_home/google.png')}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Login with Google</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.signupTextContainer}>
          <Text style={styles.subtitle}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.linkText}>Sign up here</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#1C1A1A',
    paddingTop: 80,
    paddingHorizontal: 24,
  },

  backbtn:{
    position: 'absolute',
    top: 680 ,
    left: -170,
    width: 50,
    height: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },


  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#EB3678',
  },
  subheading: {
    fontSize: 18,
    color: '#555',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#F8F4F4',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    height: 48,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
  },
  forgotPasswordText: {
    alignSelf: 'flex-end',
    marginBottom: 15,
    fontSize: 14,
    color: '#EB3678',
    textDecorationLine: 'underline',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#999',
    fontSize: 15,
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
    elevation: 6,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#EB3678',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 15,
    color: '#333',
  },
  linkText: {
    fontSize: 15,
    color: '#EB3678',
    textDecorationLine: 'underline',
  },
});
