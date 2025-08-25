import React, { useState } from 'react';
import { View, Text, TextInput, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../../../supabase'; // ✅ Import your existing client

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isVisible: false, isError: false, message: '', email: '' });

  const handleSendOTP = async () => {
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setModalInfo({ isVisible: true, isError: true, message: 'Please enter a valid email.', email: '' });
      return;
    }

    setLoading(true);
    const redirectURL = `paisawise://OTPVerification?contact=${encodeURIComponent(email)}`;

    // ✅ Call real supabase client
    const { error } = await supabase.auth.resetPasswordForEmail(email, { 
      redirectTo: redirectURL 
    });

    setLoading(false);
    setModalInfo({
      isVisible: true,
      isError: !!error,
      message: error ? error.message : 'Password reset link sent to:',
      email: error ? '' : email,
    });
  };

  const closeModal = () => {
    const { isError, email } = modalInfo;
    setModalInfo({ isVisible: false, isError: false, message: '', email: '' });

    if (!isError) {
      navigation.navigate('OTPVerification', { email }); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Reset Password</Text>
        <Text style={styles.subheading}>Enter your email to receive a reset link.</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleSendOTP} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.backButton]} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalInfo.isVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalMessage, modalInfo.isError && styles.modalError]}>
              {modalInfo.message}
            </Text>
            {modalInfo.email ? <Text style={styles.modalEmail}>{modalInfo.email}</Text> : null}
            <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F8F4F4',
    padding: 24,
  },
  card: {
    backgroundColor: '#1F2937', // bg-gray-800
    borderRadius: 16, // rounded-2xl
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  heading: {
    fontSize: 28, // text-3xl
    fontWeight: 'bold',
    color: '#EC4899', // text-pink-500
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    color: '#9CA3AF', // text-gray-400
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginBottom: 16,
    color: '#111',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#EC4899', // bg-pink-500
    borderRadius: 9999, // rounded-full
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  backButton: {
    backgroundColor: '#4B5563', // A slightly darker gray for the back button
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 16, // rounded-2xl
    alignItems: 'center',
    width: '85%',
    maxWidth: 340,
  },
  modalMessage: {
    fontSize: 18,
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalError: {
    color: '#DC2626', // text-red-600
  },
  modalEmail: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#EC4899', // text-pink-500
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#EC4899', // bg-pink-500
    borderRadius: 9999, // rounded-full
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
