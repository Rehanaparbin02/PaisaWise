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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState, useRef , useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ReceiptProcessor from '../components/OCR/ReceiptProcessor'; // Updated Expo-compatible service

import Budget from '../screens/Wallet';
import Daily from '../screens/Planning';
import Stats from '../screens/statistics/Stats';
import HomeScreen from '../screens/home/HomeScreen';

const Tab = createBottomTabNavigator();
const EmptyScreen = () => null;

const TabNavigator = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleOCRCapture = async (useCamera = true) => {
    try {
      setIsProcessing(true);
      closeOptions();
      
      // Step 1: Capture image using Expo ImagePicker
      const imageData = await ReceiptProcessor.captureReceipt(useCamera);
      
      // Step 2: Process receipt with OCR + LLM
      const result = await ReceiptProcessor.processReceipt(imageData);
      
      // Step 3: Show success and navigate
      Alert.alert(
        'Receipt Processed Successfully! 🎉',
        `Merchant: ${result.merchant_name}\nAmount: ${result.total_amount?.toFixed(2)}\nCategory: ${result.category}\nConfidence: ${Math.round(result.confidence * 100)}%`,
        [
          {
            text: 'View All Expenses',
            onPress: () => navigation.navigate('Expenses') // Navigate to expenses list
          },
          {
            text: 'OK',
            style: 'default'
          }
        ]
      );
      
    } catch (error) {
      Alert.alert(
        'Processing Error',
        error.message === 'User cancelled' 
          ? 'Image capture was cancelled' 
          : `Failed to process receipt: ${error.message}`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const closeOptions = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setShowOptions(false);
    });
  };

  const OptionButton = ({ label, onPress, iconName, style }) => {
    return (
      <Animated.View style={[styles.optionButton, animatedStyle, style]}>
        <TouchableOpacity 
          onPress={onPress} 
          activeOpacity={0.8}
          style={styles.optionTouchable}
        >
          <Ionicons name={iconName} size={24} color="#fff" style={styles.optionIcon} />
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
                <TouchableOpacity 
                  style={styles.fab} 
                  onPress={toggleOptions} 
                  activeOpacity={1}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ActivityIndicator size="large" color="#fff" />
                  ) : (
                    <Ionicons 
                      name={showOptions ? "close" : "camera"} 
                      size={showOptions ? 40 : 35} 
                      color="#fff" 
                    />
                  )}
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

      {showOptions && !isProcessing && (
        <>
          <Animated.View style={[styles.optionsContainer, animatedStyle]} pointerEvents="box-none">
            <OptionButton 
              label="Take Photo" 
              iconName="camera"
              onPress={() => handleOCRCapture(true)}
              style={styles.cameraOption} 
            />
            <OptionButton 
              label="From Gallery" 
              iconName="images"
              onPress={() => handleOCRCapture(false)}
              style={styles.galleryOption} 
            />
          </Animated.View>
          
          {/* Manual entry option */}
          <Animated.View style={[styles.manualEntryContainer, animatedStyle]} pointerEvents="box-none">
            <OptionButton 
              label="Manual Entry" 
              iconName="create"
              onPress={() => {
                closeOptions();
                navigation.navigate('Expenses'); // Your existing manual entry screen
              }}
              style={styles.manualOption} 
            />
          </Animated.View>
          
          <TouchableOpacity
            style={styles.overlay}
            onPress={closeOptions}
            activeOpacity={1}
          />
        </>
      )}

      {/* Processing overlay */}
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#F73D93" />
            <Text style={styles.processingText}>Processing Receipt...</Text>
            <Text style={styles.processingSubtext}>
              Extracting text and categorizing expense
            </Text>
          </View>
        </View>
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
    bottom: 15,
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
    bottom: 120,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 20,
  },

  manualEntryContainer: {
    position: 'absolute',
    bottom: 180,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },

  optionButton: {
    backgroundColor: '#F73D93',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    marginHorizontal: 10,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  optionTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  optionIcon: {
    marginRight: 8,
  },

  optionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  cameraOption: {
    backgroundColor: '#34C759', // Green for camera
  },

  galleryOption: {
    backgroundColor: '#007AFF', // Blue for gallery
  },

  manualOption: {
    backgroundColor: '#FF9500', // Orange for manual entry
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 5,
  },

  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 15,
  },

  processingContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },

  processingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default TabNavigator;