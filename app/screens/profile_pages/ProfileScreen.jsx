import React, { useState } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity,
  Switch, TextInput, ScrollView, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../supabase'; // Adjust this path as needed

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState('Rehana Parbin');
  const [bio, setBio] = useState('Passionate about tech, design & nature 🌿');
  const [email, setEmail] = useState('rehana.parbin@example.com');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const badges = [
    { id: 1, title: 'Early Adopter', icon: 'flame-outline' },
    { id: 2, title: 'Top Contributor', icon: 'ribbon-outline' },
    { id: 3, title: 'Community Helper', icon: 'heart-outline' },
  ];

  const handleProfileImagePress = () => {
    Alert.alert("Change Profile Picture", "This would open an image picker.");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert('Logout Error', error.message);
    } else {
      Alert.alert('Logged Out', 'You have been successfully logged out.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  };

  const themed = (light, dark) => (darkMode ? dark : light);

  const settingsOptions = [
    { label: 'Privacy Settings', icon: 'lock-closed-outline' },
    { label: 'Saved Items', icon: 'bookmark-outline' },
    { label: 'Support & Feedback', icon: 'chatbubbles-outline' },
    { label: 'Logout', icon: 'log-out-outline', danger: true, action: handleLogout },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: themed('#F9F6F1', '#021526') }]}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleProfileImagePress}>
          <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={styles.profileImage} />
          <View style={styles.cameraIcon}>
            <Icon name="camera" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 16 }}>
          <Text style={styles.name}>Rehana Parbin</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={[styles.bio, { color: themed('#444', '#ECCEAE') }]}
            multiline
            placeholder="Tell us about yourself"
            placeholderTextColor={themed('#aaa', '#888')}
          />
          <Text style={styles.email}>rehana.parbin@example.com</Text>
        </View>
      </View>

      {/* Badges */}
      <View style={[styles.card, { backgroundColor: themed('#E2DCC8', '#0D1B2A') }]}>
        <Text style={[styles.sectionTitle, { color: themed('#021526', '#ECCEAE') }]}>Achievements</Text>
        <View style={styles.badgeList}>
          {badges.map(badge => (
            <View key={badge.id} style={[styles.badge, { backgroundColor: themed('#FFF3F8', '#143759') }]}>
              <Icon name={badge.icon} size={20} color="#DC0083" />
              <Text style={[styles.badgeText, { color: themed('#021526', '#ECCEAE') }]}>{badge.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Settings */}
      <View style={[styles.card, { backgroundColor: themed('#E2DCC8', '#0D1B2A') }]}>
        <Text style={[styles.sectionTitle, { color: themed('#021526', '#ECCEAE') }]}>Settings</Text>

        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: themed('#021526', '#ECCEAE') }]}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#ccc', true: '#DC0083' }}
            thumbColor={darkMode ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, { color: themed('#021526', '#ECCEAE') }]}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#ccc', true: '#DC0083' }}
            thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
          />
        </View>

        {settingsOptions.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.settingRow}
            onPress={item.action || (() => Alert.alert(item.label, 'Feature coming soon'))}
          >
            <Text style={[styles.settingLabel, { color: item.danger ? '#DC143C' : themed('#021526', '#ECCEAE') }]}>
              {item.label}
            </Text>
            <Icon name={item.icon} size={20} color={item.danger ? '#DC143C' : themed('#000', '#fff')} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 30,
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#DC0083',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#DC0083',
    borderRadius: 12,
    padding: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
  },
  bio: {
    fontSize: 14,
    marginTop: 6,
  },
  email: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  card: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  badgeList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  badgeText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
  },
  settingLabel: {
    fontSize: 16,
  },
});
