import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

export default function MiniCarousal() {
  const navigation = useNavigation();

  // Softer, eye-friendly light gradients
  const CARD_GRADIENTS = [
    ['#fdfcfb', '#e2d1c3'], // ivory → champagne beige
    ['#fafafaff', '#eaeaeaff'], // light gray → softer gray
    ['#fffaf0', '#f0e6d2'], // off-white → warm beige
  ];

  const [cards, setCards] = useState([
    { title: 'Card 0', subtitle: 'Subtitle 0' },
    { title: 'Card 1', subtitle: 'Subtitle 1' },
    { title: 'Card 2', subtitle: 'Subtitle 2' },
  ]);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [titleInput, setTitleInput] = React.useState('');
  const [subtitleInput, setSubtitleInput] = React.useState('');

  const addCard = () => {
    if (titleInput.trim()) {
      setCards([...cards, { title: titleInput, subtitle: subtitleInput }]);
      setTitleInput('');
      setSubtitleInput('');
      setModalVisible(false);
    }
  };

  const maxCardsInCarousel = 6;
  const cardsForCarousel = cards.slice(0, maxCardsInCarousel);

  const data = [null, ...cardsForCarousel];

  const renderItem = ({ item, index }) => {
    if (index === 0) {
      // Add Card tile
      return (
        <TouchableOpacity
          style={styles.addCardWrapper}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <View style={styles.addCard}>
            <Ionicons name="add" size={28} color="#B8860B" />
            <Text style={styles.addCardText}>Add</Text>
          </View>
        </TouchableOpacity>
      );
    }

    const card = cardsForCarousel[index - 1];
    const gradientColors = CARD_GRADIENTS[(index - 1) % CARD_GRADIENTS.length];

    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
      </LinearGradient>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        renderItem={renderItem}
      />

      {cards.length > 0 && (
        <TouchableOpacity
          style={styles.seeAllButton}
          onPress={() =>
            navigation.navigate('AllCardsScreen', {
              cards,
              setCards,
            })
          }
        >
          <Text style={styles.seeAllButtonText}>See All</Text>
        </TouchableOpacity>
      )}

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Card</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#999"
              value={titleInput}
              onChangeText={setTitleInput}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Subtitle"
              placeholderTextColor="#999"
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
                style={[styles.modalButton, styles.addButton]}
                onPress={addCard}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Add</Text>
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
    marginTop: 30,
    height: 180,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  card: {
    width: screenWidth * 0.42,
    marginHorizontal: 10,
    height: 130,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(184,134,11,0.3)', // subtle gold accent
  },
  addCardWrapper: {
    width: screenWidth * 0.25,
    height: 130,
    marginHorizontal: 10,
    borderRadius: 14,
    overflow: 'hidden',
  },
  addCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(184,134,11,0.5)',
    borderRadius: 14,
    backgroundColor: '#fdfcfb',
  },
  addCardText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
    marginTop: 4,
  },
  cardTitle: {
    color: '#222',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  cardSubtitle: {
    color: '#555',
    fontSize: 13,
  },
  seeAllButton: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#eee',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(184,134,11,0.3)',
  },
  seeAllButtonText: {
    color: '#444',
    fontWeight: '600',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(184,134,11,0.3)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  addButton: {
    backgroundColor: '#b8860b',
  },
  modalButtonText: {
    fontWeight: '600',
    color: '#333',
  },
});
