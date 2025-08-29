import React, { useEffect, useState, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking } from 'react-native';

import OnBoarding from '../screens/OnBoarding';
import TabNavigator from './tabsNavigation';
import Income from '../screens/Income';
import Expenses from '../screens/Expenses';
import Signup from '../screens/login-signup-screens/Signup'; 
import LoginSignupPage from '../screens/login-signup-screens/LoginSignupPage';
import Login from '../screens/login-signup-screens/Login';
import ResetPassword from '../screens/login-signup-screens/ResetPassword';
import OTPVerification from '../screens/login-signup-screens/OTPVerification';
import ExpenseEntry from '../screens/ExpenseEntry';
import MiniCarousal from '../components/MiniCarousal';
import AllCardsScreen from '../screens/home/AllCardsScreen';
import FullBreakdownScreen from '../screens/home/FullBreakdownScreen';
// Import your new screen
import SeeAllTransactions from '../screens/home/SeeAllTransactions';

import { getItem } from '../../utils/asyncStorage';
import ProfileScreen from '../screens/profile_pages/ProfileScreen';
import NotificationScreen from '../components/NotificationScreen';
import ProfileSetup from '../screens/profile_pages/ProfileSetup';
import HomeScreen from '../screens/home/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [showOnBoarding, setShowOnBoarding] = useState(null);
  const navigationRef = useRef();

  useEffect(() => {
    const checkIfAlreadyOnboarded = async () => {
      const onboarded = await getItem('onboarded');
      setShowOnBoarding(onboarded !== '1');
    };
    checkIfAlreadyOnboarded();
  }, []);

  // Deep link handling
  useEffect(() => {
    const handleDeepLink = (url) => {
      if (url && navigationRef.current) {
        console.log('Deep link received:', url);
        
        // Handle paisawise:// scheme
        if (url.startsWith('paisawise://')) {
          const route = url.replace('paisawise://', '');
          const [screenName, queryString] = route.split('?');
          
          if (screenName === 'OTPVerification' && queryString) {
            const params = new URLSearchParams(queryString);
            const contact = params.get('contact');
            
            if (contact) {
              console.log('Navigating to OTP verification with contact:', contact);
              navigationRef.current.navigate('OTPVerification', { 
                contact: decodeURIComponent(contact) 
              });
            }
          }
        }
        // Handle expo development URLs
        else if (url.includes('OTPVerification')) {
          const urlParts = url.split('?');
          if (urlParts[1]) {
            const params = new URLSearchParams(urlParts[1]);
            const contact = params.get('contact');
            
            if (contact) {
              console.log('Navigating to OTP verification with contact:', contact);
              navigationRef.current.navigate('OTPVerification', { 
                contact: decodeURIComponent(contact) 
              });
            }
          }
        }
      }
    };

    // Handle deep link when app is opened from a link
    const handleInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log('Initial URL:', initialUrl);
          // Add a small delay to ensure navigation is ready
          setTimeout(() => {
            handleDeepLink(initialUrl);
          }, 1000);
        }
      } catch (error) {
        console.error('Error handling initial URL:', error);
      }
    };

    // Handle deep link when app is already running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    handleInitialURL();

    return () => subscription?.remove();
  }, []);

  if (showOnBoarding === null) {
    return null; // Or a splash/loading screen
  }

  return (
    <Stack.Navigator 
      ref={navigationRef}
      initialRouteName={showOnBoarding ? 'Onboarding' : 'MainTabs'}
    >
      {/* ✅ Always register Onboarding */}
      <Stack.Screen
        name="Onboarding"
        component={OnBoarding}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: true, title: 'Profile' }}    //modified false to true
      />

      <Stack.Screen
        name="ProfileSetup"
        component={ProfileSetup}
        options={{ headerShown: true, title: 'Profile-Setup' }}    //modified false to true
      />

      <Stack.Screen 
        name="Notification" 
        component={NotificationScreen} 
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="LoginSignupPage"
        component={LoginSignupPage}
        options={{ headerShown: false, title: 'Login / Signup' }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ headerShown: false, title: 'Sign Up' }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ headerShown: false, title: 'Reset Password' }}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerification}
        options={{ headerShown: false, title: 'OTP Verification' }}
      />

      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen 
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false, title: 'Home' }}
      />

      <Stack.Screen
        name="Income"
        component={Income}
        options={{ headerShown: true, title: 'Income' }}
      />
      <Stack.Screen
        name="Expenses"
        component={Expenses}
        options={{ headerShown: true, title: 'Expenses' }}
      />
      <Stack.Screen
          name="ExpenseEntry"
          component={ExpenseEntry}
          options={{ headerShown: false }} // We'll use a custom header in the component
        />
      <Stack.Screen
        name="MiniCarousal"
        component={MiniCarousal}
        options={{ headerShown: false, title: 'Cards Carousel' }}
      />
      <Stack.Screen
        name="AllCardsScreen"
        component={AllCardsScreen}
        options={{ headerShown: false, title: 'All Cards' }}
      />
      <Stack.Screen
        name="SeeAllTransactions"
        component={SeeAllTransactions}
        options={{ headerShown: false, title: 'All Transactions' }}
      />
      <Stack.Screen
        name="FullBreakdown"
        component={FullBreakdownScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}