import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated } from 'react-native';
import PrettyPinkButton from '../../components/PrettyPinkButton';

export default function LoginSignupPage({ navigation }) {
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
      <Text style={styles.title}>Start Your Financial Journey</Text>

      <Image 
        source={require('../../../assets/login.png')} 
        style={styles.image}
      />

      <Animated.View style={[styles.subcontainer, { transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.subtitle}>
          Welcome! Please login or sign up to continue.
        </Text>

        <View style={styles.buttonWrapper}>
          <PrettyPinkButton  
            title="Go to Signup" 
            onPress={() => navigation.navigate('Signup')} 
          />
        </View>

        <Text style={styles.orText}>OR</Text>

        <View style={styles.buttonWrapper}>
          <PrettyPinkButton  
            title="Login" 
            onPress={() => navigation.navigate('Login')} 
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff' 
  },
  heading: { 
    fontSize: 34, 
    fontWeight: 'bold', 
    position: 'absolute', 
    top: 60, 
    color: '#EB3678',
  },
  title: { 
    fontSize: 20, 
    position: 'absolute', 
    top: 105, 
    color: '#555',
    fontWeight: '600',
  },
  image: {
    position: 'relative',
    top: 100,
    width: 300,
    height: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  subcontainer: {
    height: 400,
    borderTopLeftRadius: 170,
    borderTopRightRadius: 170,
    paddingHorizontal: 40,
    backgroundColor: '#1C1A1A',
    width: '95%',
    position: 'relative',
    top: 100,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#F0E3E3',
    textAlign: 'center',
    marginBottom: 20,
  },
  orText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginVertical: 2, // reduced from 8
  },
  buttonWrapper: {
    marginVertical: 4, // reduced from 10
    alignItems: 'center',
  },
});
