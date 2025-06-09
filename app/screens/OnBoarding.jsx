import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { setItem } from '../../utils/asyncStorage';

export default function OnBoarding() {
  const navigation = useNavigation();

  const handleFinish = async () => {
    await setItem('onboarded', '1');
    navigation.replace('LoginSignupPage');
  };

  const DoneButton = (props) => (
    <TouchableOpacity style={styles.doneButton} {...props}>
      <Text style={styles.doneText}>Get Started</Text>
    </TouchableOpacity>
  );

  const ThemedCard = ({ children, style }) => (
    <View style={[styles.themedCard, style]}>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleFinish}
        onSkip={handleFinish}
        bottomBarHighlight={false}
        bottomBarColor="transparent"
        DoneButtonComponent={DoneButton}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: '#EEEEEE',
            image: (
              <View style={styles.imageContainer}>
                <LottieView source={require('../../assets/onbaording_home/welcome.json')} autoPlay loop style={styles.lottie} />
              </View>
            ),
            title: (
              <ThemedCard style={styles.cardLarge}>
                <Text style={styles.title}>Welcome</Text>
                <Text style={styles.subtitle}>Take Control of Your Money</Text>
              </ThemedCard>
            )
          },
          {
            backgroundColor: '#EEEEEE',
            image: (
              <View style={styles.imageContainer}>
                <LottieView source={require('../../assets/onbaording_home/screen1.json')} autoPlay loop style={styles.lottie} />
              </View>
            ),
            title: (
              <ThemedCard style={{paddingVertical: 35, marginBottom:8}}>
                <Text style={styles.title}>Set It, Track It, Achieve It</Text>
                <Text style={styles.subtitle}>Create budgets that fit your lifestyle, not the other way around.</Text>
              </ThemedCard>
            )
          },
          {
            backgroundColor: '#EEEEEE',
            image: (
              <View style={styles.imageContainer}>
                <LottieView source={require('../../assets/onbaording_home/screen2.json')} autoPlay loop style={{ width: 385, height: 450 }} />
              </View>
            ),
            title: (
              <ThemedCard style={{paddingVertical: 48, marginBottom:-38}}>
                <Text style={styles.title}>Your Financial Story, Beautifully Told</Text>
                <Text style={styles.subtitle}>Transform your spending data into actionable insights</Text>
              </ThemedCard>
            )
          },
          {
            backgroundColor: '#EEEEEE',
            image: (
              <View style={styles.imageContainer}>
                <LottieView source={require('../../assets/onbaording_home/screen3.json')} autoPlay loop style={{ width: 385, height: 450 }} />
              </View>
            ),
            title: (
              <ThemedCard style={{paddingVertical: 38, marginBottom:-36}}>
                <Text style={styles.title}>Your Data, Your Control</Text>
                <Text style={styles.subtitle}>Your financial information is sensitive, and we treat it that way.</Text>
              </ThemedCard>
            )
          },
          {
            backgroundColor: '#EEEEEE',
            image: (
              <View style={styles.imageContainer}>
                <LottieView source={require('../../assets/onbaording_home/lastpage.json')} autoPlay loop style={{ width: 385, height: 450 }} />
              </View>
            ),
            title: (
              <ThemedCard style={styles.cardLarge}>
                <Text style={styles.title}>You're All Set!</Text>
                <Text style={styles.subtitle}>Congratulations! You're now equipped with everything you need to master your money.</Text>
              </ThemedCard>
            )
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 500,
    height: 500,
    alignSelf: 'center',
  },
  themedCard: {
    backgroundColor: '#141010',
    paddingVertical: 30,
    paddingHorizontal: 45,
    borderRadius: 25,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    bottom: 40,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardLarge: {
    paddingVertical: 55,
    marginBottom: -34
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F70776',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#F1BBD5',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  doneButton: {
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#F73D93',
    borderRadius: 20,
  },
  doneText: {
    color: '#141010',
    fontWeight: 'bold',
  },
});