import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { containers, icons, text, spacings, colors } from '../styles';
import { AntDesign } from '@expo/vector-icons';

import SignInButton from '../components/SignInButton';
import TextEntry, { PasswordEntry } from '../components/TextEntry';
import GoBack from '../components/GoBack';

const Login = ({ route, navigation }): JSX.Element => {
  const { setUser } = route.params;

  // TODO: Optional: refactor text entries to be inside a container, which then manages the ref state
  // Import this text entry container into other components and have it accept props for text entry fields
  // see OnBoarding1, Signup for more examples
  const textRefs = [textEntry1, textEntry2, textEntry3] = [React.createRef(), React.createRef(), React.createRef()];

  const authenticate = () => {
    // TODO: Use listener for user signin/signup in App/MainNavigator instead of passing back props 
    setUser(true);
  }

  const selectTextRef = (index: number) => {
    textRefs[index].current.focus();
  }

  return (
    <LinearGradient
        // Background Linear Gradient
        colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
        style={styles.container}
    > 
      <GoBack navigation={navigation} />
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Hello.</Text>
          <Text style={styles.subTitle}>Welcome back!</Text>
        </View>

        <View style={styles.fieldContainer}>
          <View style={styles.textEntryContainer}><TextEntry label="Email" keyboardType="email-address" placeholderValue="monologRocks@gmail.com" editable={true} returnKeyType="next" innerRef={textRefs[0]} onFinish={() => selectTextRef(1)}/></View>
          <View style={styles.textEntryContainer}><PasswordEntry label="Password" placeholderValue="•••••••" editable={true} secureTextEntry={true} returnKeyType="done" innerRef={textRefs[1]} onFinish={authenticate}/></View>
          <Pressable onPress={() => {}} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
            <Text style={styles.forgotPassword}>Forgot Your Password?</Text>
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          <SignInButton text={"Sign In"} onPress={authenticate} background={colors.BACKGROUND}></SignInButton>
          <SignInButton text={"Sign In With Google"} onPress={authenticate} background={colors.BACKGROUND}><AntDesign name="google" style={styles.socialIcon} /></SignInButton>
          <SignInButton text={"Sign In With Facebook"} onPress={authenticate} background={colors.BACKGROUND}><AntDesign name="facebook-square" style={styles.socialIcon} /></SignInButton>
        </View>
      </View> 
    </LinearGradient>
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
    width: "100%"
  },
  titleContainer: {
    alignItems: 'center',
    padding: spacings.MEDIUM
  },
  title: {
    ...text.h1,
  },
  subTitle: {
    ...text.h2
  },
  fieldContainer: {
    paddingVertical: spacings.HUGE,
    paddingHorizontal: spacings.MASSIVE
  },
  fieldLabel: {
    ...text.h4
  },
  textEntryContainer: {
    marginVertical: spacings.MEDIUM,
  },
  buttonContainer: {
    alignItems: 'center',
    padding: spacings.MEDIUM,
  },
  forgotPassword: {
    ...text.footnote,
    textDecorationLine: 'underline',
    color: colors.BACKGROUND,
    marginVertical: spacings.SMALL
  },
  socialIcon: {
    ...icons.TINY,
    color: colors.PRIMARY,
    marginRight: spacings.SMALL
  }
})

export default Login;