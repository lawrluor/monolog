import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, Text, Pressable } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';

import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';
import GoBack from '../components/GoBack';

import { containers, text, spacings, colors, icons, dimensions } from '../styles';

import { styles } from './OnBoarding1';

const OnBoarding2 = ({ navigation }): JSX.Element => {
  const [anxietyLevel, setAnxietyLevel] = React.useState<number>(0.5);
  const [exerciseLevel, setExerciseLevel] = React.useState<number>(0.5);

  const navigateToOnBoarding3 = () => {
    navigation.navigate('OnBoarding3');
  }

  const onSlidingComplete = (val: number, stateToSet: number) => {
    console.log(`setting ${stateToSet} to ${val}`);
    switch (stateToSet) {
      case 0:
        setAnxietyLevel(val);
        break;
      case 1:
        setExerciseLevel(val);
        navigateToOnBoarding3();
        break;
    }
  }

  return (
    <>
      <SafeAreaTop />

      <GoBack navigation={navigation} />

      <SafeAreaBottom>

      <LinearGradient
          // Background Linear Gradient
          colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
          style={styles.container}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >

        <View style={styles.formContainer}>
          <View style={styles.textEntriesContainer}>
            <View style={styles2.sliderContainer}>
              <Text style={styles.subTitle}>How anxious do you feel on a daily basis?</Text>
              <Slider
                minimumValue={0}
                maximumValue={1}
                value={anxietyLevel}
                onSlidingComplete={(val) => onSlidingComplete(val, 0)}
                minimumTrackTintColor={colors.BACKGROUND}
                maximumTrackTintColor={colors.PRIMARY}
              />
              <View style={styles2.sliderDescriptionContainer}>
                <Text style={styles2.sliderDescription}>Extremely Calm</Text>
                <Text style={styles2.sliderDescription}>Extremely Anxious</Text>
              </View>
            </View>

            <View style={styles2.sliderContainer}>
              <Text style={styles.subTitle}>How often do you exercise?</Text>
              <Slider
                minimumValue={0}
                maximumValue={1}
                value={exerciseLevel}
                onSlidingComplete={(val) => onSlidingComplete(val, 1)}
                minimumTrackTintColor={colors.BACKGROUND}
                maximumTrackTintColor={colors.PRIMARY}
              />
              <View style={styles2.sliderDescriptionContainer}>
                <Text style={styles2.sliderDescription}>Never</Text>
                <Text style={styles2.sliderDescription}>Every Day</Text>
              </View>
            </View>
          </View>

          <View style={styles.skipTextContainer} >
            <Pressable onPress={() => navigateToOnBoarding3()} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
              <Text style={styles.linkText}>Skip For Now</Text>
            </Pressable>
          </View>
        </View>
        </KeyboardAvoidingView>

        <View style={styles.iconsContainer}>
          <Pressable onPress={() => navigation.goBack()} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }><View style={styles.circle}></View></Pressable>
            <View style={[styles.circle, styles.circleSelected]}></View>
          <Pressable onPress={navigateToOnBoarding3} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }><View style={styles.circle}></View></Pressable>
        </View>
      </LinearGradient>


      </SafeAreaBottom>
    </>
  )
}

const styles2 = StyleSheet.create({
  sliderContainer: {

    marginVertical: spacings.MASSIVE + 5
  },
  sliderDescriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderDescription: {
    ...text.h5,
  },
});

export default OnBoarding2;
