import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import PrettyPinkButton from '../../components/PrettyPinkButton';

export default function ResetPassword({ navigation }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  const handleSendOTP = () => {
    if (!emailOrPhone.trim()) {
      setErrorModalVisible(true);
      return;
    }
    setModalVisible(true);
  };

  const closeSuccessModal = () => {
    setModalVisible(false);
    navigation.navigate('OTPVerification', { contact: emailOrPhone });
  };

  const closeErrorModal = () => {
    setErrorModalVisible(false);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.cardContainer}>
        <Text style={styles.heading}>Reset Password</Text>
        <Text style={styles.subheading}>Enter your email or phone to receive an OTP</Text>

        <TextInput
          style={styles.input}
          placeholder="Email or Phone Number"
          placeholderTextColor="#999"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="default"
        />

        <PrettyPinkButton title="Send OTP" onPress={handleSendOTP} />

        {/* Success Modal */}
        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>OTP sent successfully to:</Text>
              <Text style={styles.modalContact}>{emailOrPhone}</Text>

              <TouchableOpacity style={styles.modalButton} onPress={closeSuccessModal}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Error Modal */}
        <Modal
          transparent
          animationType="fade"
          visible={errorModalVisible}
          onRequestClose={() => setErrorModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalBox, { backgroundColor: '#FDECEA' }]}>
              <Text style={[styles.modalText, { color: '#D93025' }]}>
                Please enter your email or phone number
              </Text>

              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#D93025' }]} onPress={closeErrorModal}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      <PrettyPinkButton title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#1C1A1A',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
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
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#EB3678',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#F8F4F4',
    width: '80%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalContact: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EB3678',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#EB3678',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
