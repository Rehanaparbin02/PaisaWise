// import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Switch, TextInput, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen({ navigation }) {  // receive navigation prop
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState('Rehana Parbin');
  const [bio, setBio] = useState('Passionate about tech, design & nature 🌿');
  const [email, setEmail] = useState('rehana.parbin@example.com');

  const badges = [
    { id: 1, title: 'Early Adopter', icon: 'flame-outline' },
    { id: 2, title: 'Top Contributor', icon: 'ribbon-outline' },
    { id: 3, title: 'Community Helper', icon: 'heart-outline' },
  ];

  // Logout Handler
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => navigation.replace('LoginSignup') },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, darkMode && styles.darkBackground]}>
      {/* Profile Info */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: 'https://i.pravatar.cc/300' }} style={styles.profileImage} />
        <View style={{ flex: 1, marginLeft: 16 }}>
          <TextInput
            value={name}
            onChangeText={setName}
            style={[styles.name, darkMode && styles.darkText]}
            placeholder="Your Name"
            placeholderTextColor={darkMode ? '#888' : '#aaa'}
          />
          <TextInput
            value={bio}
            onChangeText={setBio}
            style={[styles.bio, darkMode && styles.darkText]}
            multiline
            placeholder="Tell us about yourself"
            placeholderTextColor={darkMode ? '#888' : '#aaa'}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={[styles.email, darkMode && styles.darkText]}
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor={darkMode ? '#888' : '#aaa'}
          />
        </View>
      </View>

      {/* Activity Summary */}
      <View style={[styles.activityContainer, darkMode && styles.darkCard]}>
        <TouchableOpacity style={styles.activityItem}>
          <Text style={[styles.activityCount, darkMode && styles.darkText]}>120</Text>
          <Text style={[styles.activityLabel, darkMode && styles.darkText]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activityItem}>
          <Text style={[styles.activityCount, darkMode && styles.darkText]}>350</Text>
          <Text style={[styles.activityLabel, darkMode && styles.darkText]}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activityItem}>
          <Text style={[styles.activityCount, darkMode && styles.darkText]}>180</Text>
          <Text style={[styles.activityLabel, darkMode && styles.darkText]}>Following</Text>
        </TouchableOpacity>
      </View>

      {/* Badges / Achievements */}
      <View style={[styles.badgesContainer, darkMode && styles.darkCard]}>
        <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Achievements</Text>
        <View style={styles.badgesList}>
          {badges.map(badge => (
            <View key={badge.id} style={[styles.badge, darkMode && styles.darkBadge]}>
              <Icon name={badge.icon} size={20} color="#DC0083" />
              <Text style={[styles.badgeText, darkMode && styles.darkText]}>{badge.title}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Settings & Toggles */}
      <View style={[styles.settingsContainer, darkMode && styles.darkCard]}>
        <Text style={[styles.sectionTitle, darkMode && styles.darkText]}>Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#ccc', true: '#DC0083' }}
            thumbColor={darkMode ? '#fff' : '#f4f3f4'}
          />
        </View>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Privacy Settings</Text>
          <Icon name="chevron-forward" size={20} color={darkMode ? '#fff' : '#000'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Saved Items</Text>
          <Icon name="bookmark-outline" size={20} color={darkMode ? '#fff' : '#000'} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingRow}>
          <Text style={[styles.settingLabel, darkMode && styles.darkText]}>Support & Feedback</Text>
          <Icon name="chatbubbles-outline" size={20} color={darkMode ? '#fff' : '#000'} />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
          <Icon name="log-out-outline" size={22} color="#DC0083" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F1',
    padding: 20,
  },
  darkBackground: {
    backgroundColor: '#021526',
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
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#021526',
  },
  bio: {
    fontSize: 14,
    color: '#444',
    marginTop: 6,
  },
  email: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
    fontStyle: 'italic',
  },
  darkText: {
    color: '#ECCEAE',
  },
  activityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E2DCC8',
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 30,
  },
  darkCard: {
    backgroundColor: '#0D1B2A',
  },
  activityItem: {
    alignItems: 'center',
  },
  activityCount: {
    fontSize: 22,
    fontWeight: '700',
    color: '#021526',
  },
  activityLabel: {
    fontSize: 12,
    color: '#555',
  },
  badgesContainer: {
    marginBottom: 30,
    padding: 16,
    backgroundColor: '#E2DCC8',
    borderRadius: 20,
  },
  badgesList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  darkBadge: {
    backgroundColor: '#143759',
  },
  badgeText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#021526',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#021526',
    marginBottom: 12,
  },
  settingsContainer: {
    padding: 16,
    backgroundColor: '#E2DCC8',
    borderRadius: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    color: '#021526',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#DC0083',
  },
  logoutText: {
    color: '#DC0083',
    fontWeight: '700',
    fontSize: 16,
    marginRight: 8,
  },
});
