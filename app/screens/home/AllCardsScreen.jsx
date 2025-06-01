import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function AllCardsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { cards, setCards } = route.params;

  // Modal state for edit/add
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [titleInput, setTitleInput] = useState('');
  const [subtitleInput, setSubtitleInput] = useState('');

  const openEditModal = (index) => {
    setIsEditMode(true);
    setCurrentIndex(index);
    setTitleInput(cards[index].title);
    setSubtitleInput(cards[index].subtitle);
    setModalVisible(true);
  };

  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentIndex(null);
    setTitleInput('');
    setSubtitleInput('');
    setModalVisible(true);
  };

  const saveCard = () => {
    if (!titleInput.trim()) {
      Alert.alert('Validation', 'Title cannot be empty');
      return;
    }
    if (isEditMode) {
      // Edit existing card
      const newCards = [...cards];
      newCards[currentIndex] = { title: titleInput, subtitle: subtitleInput };
      setCards(newCards);
    } else {
      // Add new card
      setCards([...cards, { title: titleInput, subtitle: subtitleInput }]);
    }
    setModalVisible(false);
  };

  const removeCard = (index) => {
    Alert.alert(
      'Delete Card',
      'Are you sure you want to delete this card?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newCards = [...cards];
            newCards.splice(index, 1);
            setCards(newCards);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => openEditModal(index)}
          style={[styles.button, styles.editButton]}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => removeCard(index)}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
{/* 
        <TouchableOpacity
          onPress={openAddModal}
          style={[styles.button, styles.addButton]}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <FlatList
        data={cards}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal for add/edit card */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {isEditMode ? 'Edit Card' : 'Add New Card'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={titleInput}
              onChangeText={setTitleInput}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Subtitle"
              value={subtitleInput}
              onChangeText={setSubtitleInput}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveCard}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                  {isEditMode ? 'Save' : 'Add'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    marginBottom: 15,
  },
  backText: {
    fontSize: 18,
    color: '#007AFF',
  },
  card: {
    backgroundColor: '#e3e3e3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
  },
  cardSubtitle: {
    color: '#555',
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  editButton: {
    backgroundColor: '#4caf50',
    marginRight: 6,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    marginRight: 6,
  },
  addButton: {
    backgroundColor: '#2196f3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
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
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#333',
  },
  modalButtonText: {
    fontWeight: '600',
  },
});
