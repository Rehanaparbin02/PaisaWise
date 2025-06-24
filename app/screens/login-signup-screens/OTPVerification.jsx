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
} from 'react-native';
import PrettyPinkButton from '../../components/PrettyPinkButton';
import { supabase } from '../../../supabase';

export default function OTPVerification({ route, navigation }) {
  const { contact } = route.params; //the email is paased here 
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(''));
  const {loading, setLoading} = useState(false);
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

    setLoading(true); 

    //verify with OTP with supabase
    const {data,error} = await supabase.auth.verifyOtp({
      email:contact,
      token: enteredOtp,
      type:'recovery' //this type is crucial for password reset
    })

    if(error) {
      Alert.alert('Verification failed', error)
    }else{
      //on success the user temporarily authenticated and can reset their password
      Alert.alert('OTP Verified','You can now set new password')
      //navigate to new password screen
      navigation.navigate('NewPassword');
    }
    setLoading(false)
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screenContainer}>
        <Animated.View style={[styles.cardContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.heading}>OTP Verification</Text>
          <Text style={styles.subheading}>
            Enter the OTP sent to <Text style={styles.contact}>{contact}</Text>
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
              />
            ))}
          </View>

          <PrettyPinkButton title="Verify OTP" onPress={handleVerify} />
        </Animated.View>
      </View>
      <PrettyPinkButton title="Back" onPress={() => navigation.goBack()} />
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
