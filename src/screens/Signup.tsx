import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { type RouteProp } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import SignInButton from '../components/SignInButton';
import TextEntryGroup from '../components/TextEntryGroup';
import GoBack from '../components/GoBack';
import { containers, text, spacings, colors, icons } from '../styles';
import { type AuthStackParamsList } from '../types/navigation';

type Props = {
  route: RouteProp<AuthStackParamsList, 'Signup'>;
  navigation: StackNavigationProp<AuthStackParamsList>;
}

// Initial state for text inputs, bound together with reducer
const infoTextEntryGroupState = {
  firstName: "",
  lastName: "",
  email: "",
}

const Signup = ({ route }: Props) => {
  const { setUser, setShouldOnboard } = route.params;
  const [signupInput, setSignupInput] = React.useState(infoTextEntryGroupState);
  const [isChecked, setIsChecked] = React.useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = React.useState<boolean>(false);

  // validateSignupData will validate that signupInput data is in the correct format (passwords, email, etc.)
  // TODO: Helper for authenticate(), will run text validation on each state
  const validateSignupData = () => {
    return true;
  }

  // TODO: Use listener for user signin/signup in App/MainNavigator instead of passing back props 
  // TODO: Add data validation: Each Text Entry should also update the component state
  // Then, upon calling authenticate(), should evaluate the current state variables of the text entries.
  // Wrapper function called when user presses sign up button
  const authenticate = () => {
    try {
      setIsSigningIn(true);

      let isValid = validateSignupData();
      if (isValid) {
        setUser(true);
        setShouldOnboard(true);
      } else {
        throw new Error("Invalid input");
      }
    } catch (error: Error | unknown) {
      console.error(error);
    } finally {
      setIsSigningIn(false);
    }
  }

  const renderCheckbox = (checked: boolean) => {
    return (
      checked
        ?
        <Pressable onPress={() => setIsChecked(!isChecked)} style={({ pressed }) => [{ opacity: pressed ? 0.3 : 1 }]}>
          <MaterialIcons name="check-box" style={styles.checkboxIcon} />
        </Pressable>
        :
        <Pressable onPress={() => setIsChecked(!isChecked)} style={({ pressed }) => [{ opacity: pressed ? 0.3 : 1 }]}>
          <MaterialIcons name="check-box-outline-blank" style={styles.checkboxIcon} />
        </Pressable>
    )
  }

  React.useEffect(() => {
    if (isSigningIn) {
      validateSignupData()
    }
  }, [isSigningIn])

  return (
    <LinearGradient
      colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
      style={styles.container}
    >
      <GoBack />
      <View style={styles.formContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Hello.</Text>
          <Text style={styles.subTitle}>Let's get you started.</Text>
        </View>

        <View style={styles.fieldContainer}>
          {/* TODO (UX): Consider removing redundant labels if placeholder text for each text entry will suffice */}
          {/* TODO (UX): Consider moving name entries to onboarding process to alleviate initial shock of 5 entries */}

          <TextEntryGroup state={signupInput} setState={setSignupInput} type={'default'} />

          <View style={styles.tosContainer}>
            {renderCheckbox(isChecked)}
            <Pressable onPress={() => { }} style={({ pressed }) => [{ opacity: pressed ? 0.3 : 1 }]}><Text style={styles.tos}>I agree to the terms of service.</Text></Pressable>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {/* TODO (UX): Distinguish regular Sign Up from Google/Facebook signup using different background color */}
          <SignInButton text={"Sign Up"} onPress={authenticate} background={colors.BACKGROUND}></SignInButton>
          <SignInButton text={"Sign Up With Google"} onPress={authenticate} background={colors.BACKGROUND}><AntDesign name="google" style={styles.socialIcon} /></SignInButton>
          <SignInButton text={"Sign Up With Facebook"} onPress={authenticate} background={colors.BACKGROUND}><AntDesign name="facebook-square" style={styles.socialIcon} /></SignInButton>
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
    width: "100%",
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
  textEntryContainer: {
    marginVertical: spacings.MEDIUM
  },
  fieldLabel: {
    ...text.h4
  },
  fieldText: {},
  buttonContainer: {
    alignItems: 'center',
    padding: spacings.MEDIUM,
  },
  checkboxIcon: {
    ...icons.TINY,
    color: colors.BACKGROUND,
    marginRight: spacings.SMALL
  },
  tosContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  tos: {
    ...text.footnote,
    textDecorationLine: 'underline',
    color: colors.BACKGROUND
  },
  socialIcon: {
    ...icons.TINY,
    color: colors.PRIMARY,
    marginRight: spacings.SMALL
  }
})

export default Signup;