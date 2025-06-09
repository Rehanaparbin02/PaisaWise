import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const notifications = [
  { id: '1', title: 'Payment Successful', description: 'Your payment of ₹500 was successful.' },
  { id: '2', title: 'Budget Reminder', description: 'You have exceeded your food budget this month.' },
  { id: '3', title: 'New Feature', description: 'Try the new dark mode in settings!' },
];

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No new notifications</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F6F1',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#DC0083',
  },
  notificationItem: {
    backgroundColor: '#E2DCC8',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    color: '#021526',
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  empty: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});
