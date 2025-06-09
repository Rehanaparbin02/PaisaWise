import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';

export default function AllCardsScreen({ route, navigation }) {
  const { cards: initialCards, setCards } = route.params;

  // Local state to immediately reflect UI changes
  const [localCards, setLocalCards] = useState(initialCards);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [titleInput, setTitleInput] = useState('');
  const [subtitleInput, setSubtitleInput] = useState('');

  // Keep localCards synced if initialCards changes (optional)
  useEffect(() => {
    setLocalCards(initialCards);
  }, [initialCards]);

  const openEditModal = (index) => {
    setCurrentIndex(index);
    setTitleInput(localCards[index].title);
    setSubtitleInput(localCards[index].subtitle);
    setEditModalVisible(true);
  };

  const saveEdit = () => {
    if (titleInput.trim()) {
      const updatedCards = [...localCards];
      updatedCards[currentIndex] = { title: titleInput, subtitle: subtitleInput };
      setLocalCards(updatedCards); // Update local state for immediate UI update
      setCards(updatedCards);      // Update global state from parent
      setEditModalVisible(false);
    }
  };

  const deleteCard = (index) => {
    const filteredCards = localCards.filter((_, i) => i !== index);
    setLocalCards(filteredCards); // Update local state immediately
    setCards(filteredCards);      // Update global state from parent
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={localCards}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.editButton]}
                onPress={() => openEditModal(index)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => deleteCard(index)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        transparent
        animationType="slide"
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Card</Text>
            <TextInput
              style={styles.input}
              value={titleInput}
              onChangeText={setTitleInput}
              placeholder="Title"
              autoFocus
            />
            <TextInput
              style={styles.input}
              value={subtitleInput}
              onChangeText={setSubtitleInput}
              placeholder="Subtitle"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveEdit}
              >
                <Text style={{ color: 'white' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles unchanged (same as your current)
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  card: {
    backgroundColor: '#e3e3e3',
    padding: 15,
    marginVertical: 8,
    borderRadius: 12,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  subtitle: { fontSize: 14, marginTop: 5, color: '#555' },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'flex-end',
  },
  button: {
    marginLeft: 15,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButton: { backgroundColor: '#007bff' },
  deleteButton: { backgroundColor: '#dc3545' },
  buttonText: { color: '#fff', fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalButton: { marginLeft: 10, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  cancelButton: { backgroundColor: '#eee' },
  saveButton: { backgroundColor: '#007bff' },
});
