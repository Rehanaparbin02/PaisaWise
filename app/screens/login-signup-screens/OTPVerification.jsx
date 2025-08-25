import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Linking,
} from 'react-native';
import PrettyPinkButton from '../../components/PrettyPinkButton';
import { supabase } from '../../../supabase';

export default function OTPVerification({ route, navigation }) {
  const { contact } = route.params || {}; // Handle case where route.params might be undefined
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false); // Fixed: Changed from destructuring to array destructuring
  const [currentContact, setCurrentContact] = useState(contact); // State to handle contact from deep link
  const inputsRef = useRef([]);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 150,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handle deep link contact parameter if not passed via navigation
  useEffect(() => {
    if (!currentContact) {
      const getContactFromDeepLink = async () => {
        try {
          const url = await Linking.getInitialURL();
          if (url && url.includes('contact=')) {
            const params = new URLSearchParams(url.split('?')[1]);
            const emailFromLink = params.get('contact');
            if (emailFromLink) {
              setCurrentContact(decodeURIComponent(emailFromLink));
              console.log('Email retrieved from deep link:', decodeURIComponent(emailFromLink));
            }
          }
        } catch (error) {
          console.error('Error getting contact from deep link:', error);
        }
      };
      getContactFromDeepLink();
    }
  }, [currentContact]);

  const handleChangeText = (text, index) => {
    if (/^\d*$/.test(text)) {
      let newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < OTP_LENGTH) {
      Alert.alert('Invalid OTP', 'Please enter the full 6-digit OTP.');
      return;
    }

    if (!currentContact) {
      Alert.alert('Error', 'Email address not found. Please go back and try again.');
      return;
    }

    setLoading(true); 

    try {
      // Verify OTP with Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email: currentContact,
        token: enteredOtp,
        type: 'recovery' // This type is crucial for password reset
      });

      if (error) {
        Alert.alert('Verification Failed', error.message || 'Invalid OTP. Please try again.');
      } else {
        // On success the user is temporarily authenticated and can reset their password
        Alert.alert('OTP Verified', 'You can now set a new password', [
          {
            text: 'Continue',
            onPress: () => navigation.navigate('NewPassword')
          }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('OTP verification error:', error);
    }
    
    setLoading(false);
  };

  // Show loading or error state if contact is not available
  if (!currentContact) {
    return (
      <View style={styles.screenContainer}>
        <View style={styles.cardContainer}>
          <Text style={styles.heading}>Loading...</Text>
          <Text style={styles.subheading}>
            Retrieving email information...
          </Text>
          <PrettyPinkButton 
            title="Go Back" 
            onPress={() => navigation.goBack()} 
          />
        </View>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screenContainer}>
        <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.heading}>OTP Verification</Text>
          <Text style={styles.subheading}>
            Enter the OTP sent to <Text style={styles.contact}>{currentContact}</Text>
          </Text>

          <View style={styles.otpBoxContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => (inputsRef.current[index] = ref)}
                style={styles.otpBox}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={text => handleChangeText(text, index)}
                onKeyPress={e => handleKeyPress(e, index)}
                value={digit}
                autoFocus={index === 0}
                returnKeyType="done"
                textAlign="center"
                selectionColor="#EB3678"
                placeholder="-"
                placeholderTextColor="#ccc"
                editable={!loading} // Disable input when loading
              />
            ))}
          </View>

          <PrettyPinkButton 
            title={loading ? "Verifying..." : "Verify OTP"} 
            onPress={handleVerify} 
            disabled={loading}
          />
        </Animated.View>
        
        <PrettyPinkButton 
          title="Back" 
          onPress={() => navigation.goBack()} 
          disabled={loading}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#2A2727',
    padding: 24,
    // Center vertically & horizontally
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#fff0f5', // soft pastel pink
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 28,
    shadowColor: '#EB3678',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    alignItems: 'center',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EB3678',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  subheading: {
    fontSize: 18,
    color: '#D3C4C4',
    marginBottom: 36,
    alignSelf: 'flex-start',
  },
  contact: {
    color: '#EB3678',
    fontWeight: '600',
  },
  otpBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 40,
  },
  otpBox: {
    width: 50,
    height: 58,
    backgroundColor: '#fff',
    borderRadius: 12,
    fontSize: 24,
    color: '#333',
    borderWidth: 1,
    borderColor: '#EB3678',
  },
});