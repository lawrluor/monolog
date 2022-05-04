import React from 'react';
import { StyleSheet, View, Image, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';

import { containers, dimensions, text, spacings, colors } from '../styles';

import SignInButton from '../components/SignInButton';

const Landing = ({ route, navigation }: any): JSX.Element => { 
  const { setShouldOnboard } = route.params;

  // Users go directly to the onboarding process.
  // However, they should only see this landing screen if they haven't onboarded before.
  const beginOnboarding = async () => {
    setShouldOnboard(true);  // takes us to OnBoardingStack
  }

  // Not used in alpha release, as no user accounts.
  const navigateToSignup = () => {
    navigation.navigate('Signup');
  }

  // Not used in alpha release, as no user accounts.
  const navigateToLogin = () => {
    navigation.navigate('Login');
  }

  return (
    <>
      <SafeAreaTop />

      <SafeAreaBottom>

      <LinearGradient
          // Background Linear Gradient
          colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
          style={styles.container}
      >
        <View style={styles.formContainer}>
          <View style={styles.titleContainer}>
            {/* <Text style={styles.title}>Monolog</Text> */}
            <Image style={styles.brandImage} source={require('../../assets/img/monist_logo_full.png')} />
            <Text style={styles.subTitle}>Improve your mental fitness one journal entry at a time.</Text>
          </View>

          <View style={styles.buttonContainer}>
            <SignInButton text={"Get started"} onPress={beginOnboarding} background={colors.BACKGROUND}></SignInButton>
          </View>

          {/* Disable Login Path for Alpha Release 
          <View style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPassword}>Already a member? </Text>
            <Pressable onPress={navigateToLogin} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
              <Text style={styles.linkText}>Sign In</Text>
            </Pressable>
          </View> 
          */}
        </View> 
      </LinearGradient>
      </SafeAreaBottom>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    ...containers.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.HIGHLIGHT
  },
  formContainer: {
    width: dimensions.width * 0.75
  },
  titleContainer: {
    
    alignItems: 'center',
    padding: spacings.MEDIUM
  },
  title: {
    ...text.h1,
  },
  subTitle: {
    ...text.h3,
    textAlign: 'center',
    padding: spacings.MEDIUM
  },
  fieldContainer: {
    
    padding: spacings.MEDIUM
  },
  fieldLabel: {
    ...text.h4
  },
  fieldText: {},
  buttonContainer: {
    alignItems: 'center',
    padding: spacings.MEDIUM,
  },
  forgotPasswordContainer: {
    margin: spacings.MEDIUM,
    justifyContent: 'center',
    flexDirection: 'row'
  },
  forgotPassword: {
    ...text.footnote,
    color: colors.BACKGROUND
  },
  linkText: {
    ...text.footnote,
    textDecorationLine: 'underline',
    color: colors.BACKGROUND
  },
  brandImage: {
    width: dimensions.width,
    height: dimensions.height / 12,
    resizeMode: 'contain',
    
  },
})

export default Landing;