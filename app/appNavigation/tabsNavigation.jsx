import React, { useState, useRef, useEffect } from 'react';
import { 
  createBottomTabNavigator 
} from '@react-navigation/bottom-tabs';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import Budget from '../screens/Wallet';
import Daily from '../screens/Planning';
import Stats from '../screens/statistics/Stats';
import HomeScreen from '../screens/home/HomeScreen';

const Tab = createBottomTabNavigator();
const EmptyScreen = () => null;

const TabNavigator = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigation = useNavigation();

  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showOptions) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [showOptions]);

  const toggleOptions = () => setShowOptions(!showOptions);

  const animatedStyle = {
    opacity: animation,
    transform: [
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
  };

  const OptionButton = ({ label, screenName, style }) => {
    const navigation = useNavigation();
    return (
      <Animated.View style={[styles.optionButton, animatedStyle, style]}>
        <TouchableOpacity onPress={() => {
          Animated.timing(animation, {
            toValue: 0,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }).start(() => {
            setShowOptions(false);
            navigation.navigate(screenName);
          });
        }} activeOpacity={0.8} >
          <Text style={styles.optionText}>{label}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused }) => {
            let iconName;
            switch (route.name) {
              case 'HomeScreen':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Daily':
                iconName = focused ? 'calendar' : 'calendar-outline';
                break;
              case 'Stats':
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                break;
              case 'Budget':
                iconName = focused ? 'wallet' : 'wallet-outline';
                break;
              case 'Add':
                return null;
              default:
                iconName = 'ellipse';
            }
            return (
              <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: -15, marginTop: 8, gap:1 }}>
                <Ionicons name={iconName} size={30} color={focused ? '#F73D93' : '#FFDCDC'} />
              </View>
            );
          },
          tabBarButton: (props) => {
            if (route.name === 'Add') {
              return (
                <TouchableOpacity style={styles.fab} onPress={toggleOptions} activeOpacity={1}>
                  <Ionicons name="add" size={50} color="#fff" />
                </TouchableOpacity>
              );
            }
            return <TouchableOpacity {...props} activeOpacity={1} />;
          },
        })}
      >
        <Tab.Screen name="HomeScreen" component={HomeScreen} />
        <Tab.Screen name="Daily" component={Daily} />
        <Tab.Screen name="Add" component={EmptyScreen} />
        <Tab.Screen name="Stats" component={Stats} />
        <Tab.Screen name="Budget" component={Budget} />
      </Tab.Navigator>

      {showOptions && (
        <>
          <Animated.View style={[styles.optionsContainer, animatedStyle]} pointerEvents="box-none">
            <OptionButton label="Expenses" screenName="Expenses" style={styles.expensee} />
            <OptionButton label="Incomes" screenName="Income" style={styles.incomee} />
          </Animated.View>
          <TouchableOpacity
            style={styles.overlay}
            onPress={() => {
              Animated.timing(animation, {
                toValue: 0,
                duration: 200,
                easing: Easing.in(Easing.ease),
                useNativeDriver: true,
              }).start(() => {
                setShowOptions(false);
              });
            }}
            activeOpacity={1}
          />
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 5,
    left: 30,
    right: 30,
    elevation: 5,
    backgroundColor: 'black',
    borderRadius: 55,
    height: 70,
    paddingHorizontal: 10,
  },

  fab: {
    position: 'absolute',
    bottom: 15, // increased from 5 to 15 to avoid overlap
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: '#F73D93',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    zIndex: 10,
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  optionButton: {
    backgroundColor: '#F73D93',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 5,
    marginHorizontal: 25,
    gap: 12,
  },
  optionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  expensee: {
    marginHorizontal: 32,
  },
  incomee: {
    marginHorizontal: 38,
  },
});

export default TabNavigator;
