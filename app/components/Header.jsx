// import React from 'react';
// import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';

// export default function Header({ navigation }) {
//   return (
//     <View style={styles.headerContainer}>
//       {/* Profile Section */}
//       <View style={styles.profileSection}>
//         <Image
//           source={{ uri: 'https://i.pravatar.cc/300' }}
//           style={styles.profileImage}
//         />
//         <View>
//           <Text style={styles.subtitle}>Welcome back</Text>
//           <Text style={styles.title}>Rehana Parbin</Text>
//         </View>
//       </View>
      
//       {/* Icon Buttons */}
//       <View style={styles.iconSection}>
//         <TouchableOpacity 
//           style={styles.iconButton}
//           onPress={() => navigation.navigate('Notification')}
//         >
//           <Icon name="notifications-outline" size={24} color="#DC0083" />
//         </TouchableOpacity>
        
//         {/* Profile Button */}
//         <TouchableOpacity
//           style={[styles.iconButton, { marginLeft: 16 }]}
//           onPress={() => navigation.navigate('ProfileScreen')}
//         >
//           <Icon name="person-circle-outline" size={28} color="#DC0083" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#021526',
//     padding: 16,
//     borderRadius: 35,
//     marginTop: 10,
//     marginLeft: 10,
//     marginRight: 10,
//     marginBottom: 10, // Added margin bottom for spacing
//     // Removed position: 'absolute' and zIndex to make it non-sticky
//     elevation: 4, // Added subtle elevation for depth
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   profileSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//     borderWidth: 2,
//     borderColor: '#DC0083', // Added border to profile image
//   },
//   subtitle: {
//     color: '#FBF6E2',
//     fontSize: 12,
//     opacity: 0.8,
//   },
//   title: {
//     color: '#ECCEAE',
//     fontSize: 18,
//     fontWeight: 'bold',
//     letterSpacing: 0.5,
//   },
//   iconSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   iconButton: {
//     marginLeft: 16,
//     padding: 8, // Added padding for better touch area
//     borderRadius: 20,
//     // Optional: Add background for better visual feedback
//     // backgroundColor: 'rgba(220, 0, 131, 0.1)',
//   },
// });

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

export default function Header({ navigation }) {
  return (
    <LinearGradient
      colors={['#1e1133', '#2d174a']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerContainer}
    >
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
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Notification')}
        >
          <Icon name="notifications-outline" size={24} color="#FFD700" style={styles.iconGlow}/>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconButton, { marginLeft: 16 }]}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Icon name="person-circle-outline" size={28} color="#FFD700" style={styles.iconGlow}/>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
    marginHorizontal: 12,
    marginVertical: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  subtitle: {
    color: 'rgba(255,215,0,0.7)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    color: '#ECCEAE',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  iconSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,215,0,0.08)',
  },
  iconGlow: {
    textShadowColor: 'rgba(255,215,0,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});
