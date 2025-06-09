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

const screenWidth = Dimensions.get('window').width;

export default function MiniCarousal() {
  const navigation = useNavigation();

  const BACKGROUND_COLORS = [
    '#FFCDD2', '#FFF59D', '#E1BEE7', '#C8E6C9', '#B2EBF2',
    '#CE93D8', '#90CAF9', '#FF8A80', '#A5D6A7', '#9575CD',
  ];

  const [cards, setCards] = useState([
    { title: 'Card 0', subtitle: 'Subtitle 0' },
    { title: 'Card 1', subtitle: 'Subtitle 1' },
    { title: 'Card 2', subtitle: 'Subtitle 2' },
    { title: 'Card 3', subtitle: 'Subtitle 3' },
    { title: 'Card 4', subtitle: 'Subtitle 4' },
    { title: 'Card 5', subtitle: 'Subtitle 5' },
    { title: 'Card 6', subtitle: 'Subtitle 6' },
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
      return (
        <TouchableOpacity
          style={[styles.card, styles.addCard]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addCardText}>+ Add Card</Text>
        </TouchableOpacity>
      );
    }
    const card = cardsForCarousel[index - 1];
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: BACKGROUND_COLORS[(index - 1) % BACKGROUND_COLORS.length] },
        ]}
      >
        <Text style={styles.cardTitle}>{card.title}</Text>
        <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
      </View>
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

      {/* Modal for adding new card */}
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
    height: 200,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  card: {
    width: screenWidth * 0.4,
    marginHorizontal: 10,
    height: 140,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCard: {
    width: screenWidth * 0.2,
    backgroundColor: '#ddd',
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  cardTitle: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardSubtitle: {
    color: '#555',
    fontSize: 14,
    marginTop: 5,
  },
  seeAllButton: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor: '#333',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 4,
  },
  seeAllButtonText: {
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
  addButton: {
    backgroundColor: '#333',
  },
  modalButtonText: {
    fontWeight: '600',
  },
});
