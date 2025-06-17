import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Header({ navigation }) {
  return (
    <View style={styles.headerContainer}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/300' }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.subtitle}>Welcome back</Text>
          <Text style={styles.title}>Rehana Parbin</Text>
        </View>
      </View>

      {/* Icon Buttons */}
      <View style={styles.iconSection}>
        <TouchableOpacity style={styles.iconButton}
          onPress={() => navigation.navigate('Notification')}
        >
          <Icon name="notifications-outline" size={24} color="#DC0083" />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.iconButton}>
          <Icon name="settings-outline" size={24} color="#DC0083" />
        </TouchableOpacity> */}

        {/* Profile Button */}
        <TouchableOpacity
          style={[styles.iconButton, { marginLeft: 16 }]}
          onPress={() => navigation.navigate('ProfileScreen')}>
          <Icon name="person-circle-outline" size={28} color="#DC0083" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#021526',
    padding: 16,
    borderRadius: 35,
    marginTop: -25,
    marginLeft: 10,
    marginRight: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  subtitle: {
    color: '#FBF6E2',
    fontSize: 12,
  },
  title: {
    color: '#ECCEAE',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconSection: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
});
