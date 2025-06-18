import { StyleSheet, Text, View, Image, Animated } from 'react-native'
import PrettyPinkButton from '../../components/PrettyPinkButton'
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef } from 'react';
import React from 'react';

export default function LoginSignupPage() {
  const navigation = useNavigation();
  const handleLogin = () => {
    console.log('Logging in');
    navigation.replace('Login');
  };
  const scaleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1.25,
        friction: 4,
        useNativeDriver: true,
      }).start();
    }, []);
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/login.png')} style={styles.loginImage} />
      <Animated.View style={[styles.headerContainer, {transform: [{ scale: scaleAnim }]}]}>
        <Text style={styles.header}>LoginSignupPage</Text>
        <PrettyPinkButton title="Signup" onPress={handleLogin} style={{width: 200}} />
        <Text>OR</Text>
        <PrettyPinkButton title="Login" onPress={handleLogin} style={{width: 200}} />
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1C1A1A',
  },
  loginImage: {
    width: 350,
    height: 300,
    position: 'relative',
    top: 20
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F8F4F4',
    height: 380,
    width: 340,
    borderTopLeftRadius: 150,
    borderTopRightRadius: 150,
    position: 'relative',
    top: 80,
  },
  header: {
    marginTop: 25,
    color: '#1C1A1A',
    fontSize: 24,
    fontWeight: 'bold',
  }
})