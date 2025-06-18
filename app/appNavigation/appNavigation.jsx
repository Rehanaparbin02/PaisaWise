import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnBoarding from '../screens/OnBoarding';
import TabNavigator from './tabsNavigation';
import Income from '../screens/Income';
import Expenses from '../screens/Expenses';
import Signup from '../screens/Authscreens/Signup'; 
import LoginSignupPage from '../screens/Authscreens/LoginSignupPage';
import Login from '../screens/Authscreens/Login';
import ResetPassword from '../screens/Authscreens/ResetPassword';
import OTPVerification from '../screens/Authscreens/OTPVerification';

import MiniCarousal from '../components/MiniCarousal';
import AllCardsScreen from '../screens/home/AllCardsScreen';
import FullBreakdownScreen from '../screens/home/FullBreakdownScreen';
// Import your new screen
import SeeAllTransactions from '../screens/home/SeeAllTransactions';

import { getItem } from '../../utils/asyncStorage';
import ProfileScreen from '../screens/profile_pages/ProfileScreen';
import NotificationScreen from '../components/NotificationScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [showOnBoarding, setShowOnBoarding] = useState(null);

  useEffect(() => {
    const checkIfAlreadyOnboarded = async () => {
      const onboarded = await getItem('onboarded');
      setShowOnBoarding(onboarded !== '1');
    };
    checkIfAlreadyOnboarded();
  }, []);

  if (showOnBoarding === null) {
    return null; // Or a splash/loading screen
  }

  return (
        <Stack.Navigator initialRouteName={showOnBoarding ? 'Onboarding' : 'MainTabs'}>
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
      <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }}/>


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
