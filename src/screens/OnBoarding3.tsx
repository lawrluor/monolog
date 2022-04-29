import React from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, Text, Pressable } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import CustomIcon from '../components/CustomIcon';
import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';
import GoBack from '../components/GoBack';
import { comingSoonAlert} from '../utils/customAlerts';

import { styles } from './OnBoarding1';
import { colors, dimensions } from '../styles';

const OnBoarding3 = ({ route, navigation }): JSX.Element => {
  const { setShouldOnboard } = route.params;

  // Wrapper function - handles updating state to allow moving to the AppStack after OnBoarding is finished
  const finishOnBoarding = () => {
    // TODO: this does not properly allow us to display AppStack navigator
    // Although the AppStack navigator is selected and home screen is rendering,
    // the OnBoarding navigator and this current screen still stays on top.
    setShouldOnboard(false);
  }

  // TODO: add uploading picture functionality
  const uploadPicture = () => {
    comingSoonAlert(() => {
      console.log("uploading picture...");
    });

    finishOnBoarding();
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
          <View style={styles.titleContainer}>
            <Text style={styles.title}></Text>
            <Text style={styles.subTitle}>Please upload a profile picture.</Text>
            <Pressable onPress={uploadPicture} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
              <CustomIcon name='avatar' style={styles3.profileIcon} /> 
            </Pressable>
          </View>

          <View style={styles.skipTextContainer} >
            <Pressable onPress={() => finishOnBoarding()} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
              <Text style={styles.linkText}>Skip For Now</Text>
            </Pressable>
          </View>
        </View> 
        </KeyboardAvoidingView>

        <View style={styles.iconsContainer}>
          <Pressable onPress={() => navigation.goBack()} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }><View style={styles.circle}></View></Pressable>
          <Pressable onPress={finishOnBoarding} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }><View style={[styles.circle, styles.circleSelected]}></View></Pressable>
        </View>

      </LinearGradient>

      </SafeAreaBottom>
    </>
  )
}

const styles3 = StyleSheet.create({
  profileIcon: {
    fontSize: dimensions.width / 2,
    color: colors.PRIMARY,
  }
})
  

export default OnBoarding3;