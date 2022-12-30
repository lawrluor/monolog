import React from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView, Keyboard, Platform, Pressable } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { text, spacings, colors, icons, sizes } from '../styles';

import { validateGender, validatePronouns, validateEmail, validateName, validateAge, genderOptions, pronounOptions } from '../utils/onboardingHelpers';

import UserContext from '../context/UserContext';

import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';
import TextEntry from '../components/TextEntry';
import DropDown from '../components/DropDown';
import SignInButton from '../components/SignInButton';

const LAST_SCREEN = 2;  // 2 screens in total for onboarding process

const OnBoarding1 = (): JSX.Element => {
  const { setUser } = React.useContext(UserContext);

  const textRefs = [textRef0, textRef1, textRef2, textRef3] = [React.createRef(), React.createRef(), React.createRef(), React.createRef()];
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [gender, setGender] = React.useState("");
  const [pronouns, setPronouns] = React.useState("");
  const [age, setAge] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [screenNumber, setScreenNumber] = React.useState<number>(1);  // start at 1 index
  const stateSetters = [setFirstName, setLastName, setEmail, setGender, setPronouns, setAge];

  React.useEffect(() => {
    // Listener to detect when move to screen 2
    // TODO: figure out a way to autofocus without jittering screen
    if (screenNumber===1) {
      selectTextRef(0);  // focus the textRef at index 3
    }
  }, [screenNumber]);

  // NOTE: because we allow skipping the forms completely,
    // only validate a given field if the user has entered info already into that field.
    // setErrorMessage() will let us conditionally render error messages via renderErrorMessage()
  // HOWEVER, if user presses "Skip for now", it skips all this. See handleFormSkip()
    // Case 1: User enters no information across all text fields. Returns: true
    // Case 2: User enters improperly formatted email. Returns: false
    // Case 3: User enters properly formatted email, leaving other fields blank. Returns: true
  const validateData = (): boolean => {
    if (email && !validateEmail(email)) {
      setErrorMessage("Email is not formatted properly.");
      return false;
    } else if (firstName && !validateName(firstName)) {
      setErrorMessage("First name is not formatted properly.");
      return false;
    } else if (lastName && !validateName(lastName)) {
      setErrorMessage("Last name is not formatted properly.");
      return false;
    } else if (gender && !validateGender(gender)) {
      setErrorMessage("Error selecting gender.");
      return false;
    } else if (pronouns && !validatePronouns(pronouns)) {
      setErrorMessage("Error selecting pronouns.");
      return false;
    } else if (age && !validateAge(age)) {
      setErrorMessage("Error selecting age.");
      return false;
    } else {
      // if passes all validation checks, return true
      return true;
    }
  }

  // Clears states using state setters up to a given number of states
  const clearTextStates = (clearUpTo?: number) => {
    let stateToEndAt = clearUpTo || stateSetters.length;
    for (let i=0; i < stateToEndAt; i++) {
      let stateSetter = stateSetters[i];
      stateSetter("");
    }
  }

  // NOTE: clears all states,
  // so wouldn't work super well for more than 2 onboarding screens without additional tweaking
  const handleFormSkip = () => {
    clearTextStates();
    renderNextOnboardingScreen();
  }

  const moveToPreviousOnboardingScreen = () => {
    setErrorMessage("");
    if (screenNumber > 1) setScreenNumber(screenNumber - 1);
  }

  // Only allow moving forward to next page if data entered on this page is valid
  const handleFormSubmit = () => {
    if (validateData())
     renderNextOnboardingScreen();
  }

  const renderNextOnboardingScreen = () => {
    setErrorMessage("");
    if (screenNumber < LAST_SCREEN) {
      setScreenNumber(screenNumber + 1);
    } else {
      finishOnBoarding();
    }
  }

  const finishOnBoarding = async () => {
    // TODO: add validation on fields before adding to user object/writing to DB

    let finalUserData = {
      'onboarded': true,
      'cameraPermission': false,
      'micPermission': false,
      'speechToTextPermission': false,
      'tutorialMode': true,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'gender': gender,
      'pronouns': pronouns,
      'age': age.toString(),
      'pathways': {},
      'currentPathway': '',
      'signupDateTime': Date.now()
    };

    console.log(finalUserData);
    setUser(finalUserData);  // Set in Context, which also then saves to local storage
  }

  // renders validation error if any exists
  const renderErrorMessage = (): JSX.Element | null => {
    return (
        errorMessage
        ?
        <View style={{ marginVertical: spacings.MEDIUM }}>
          <Text style={[text.h4, { color: colors.ERROR, textAlign: 'center'}]}>{errorMessage}</Text>
        </View>
        :
        null
    )
  }

  // Handles what happens when a TextInput is finished editing.
  // Updates the array of strings states, then focuses the next text ref
  const handleTextOnFinish = (index: number) => {
    // TODO: handle index+1 better to avoid out of range errors
    let nextIndex: number = index + 1;
    selectTextRef(nextIndex);

    // Alternatively: Skip to end of onboarding.
    // Discuss: The UX of having a profile pic page that doesn't work doesn't seem to make sense.
  }

  // Callback to be passed down to each child TextEntry.
  // When "next/done" is pressed in child TextEntry,
  // this callback will allow the parent OnBoarding screen to focus on the next TextEntry element.
  const selectTextRef = (index: number) => {
    textRefs[index].current.focus();
  }

  // TODO: Allow pressing out of text entries, either by adding ScrollView (hack) or full screen modal
  const renderTextEntries = () => {
    if (screenNumber===1) {
      return (
        <View style={styles.formFieldsContainer}>
          <View style={styles.textEntryContainer}><TextEntry placeholderValue="First Name" autoCapitalize='words' editable isTextBox returnKeyType="next" innerRef={textRefs[0]} textState={firstName} setTextState={setFirstName} onFinish={() => handleTextOnFinish(0)}/></View>
          <View style={styles.textEntryContainer}><TextEntry placeholderValue="Last Name" autoCapitalize='words' editable isTextBox returnKeyType="next" innerRef={textRefs[1]} textState={lastName} setTextState={setLastName} onFinish={() => handleTextOnFinish(1)}/></View>
          <View style={styles.textEntryContainer}><TextEntry placeholderValue="Email" keyboardType='email-address' editable isTextBox returnKeyType="next" innerRef={textRefs[2]} textState={email} setTextState={setEmail}  onFinish={() => handleTextOnFinish(2)}/></View>
          <View style={styles.textEntryContainer}><TextEntry placeholderValue="Age" editable isTextBox keyboardType="numeric" returnKeyType="done" innerRef={textRefs[3]} textState={age} setTextState={setAge}  onFinish={handleFormSubmit}/></View>
        </View>
      )
    } else {
      return (
        <View style={styles.formFieldsContainer}>
          <DropDown title={"Gender"} options={genderOptions} selectedValue={gender} setSelectedValue={setGender}  />
          <DropDown title={"Pronouns"} options={pronounOptions} selectedValue={pronouns} setSelectedValue={setPronouns}  />
        </View>
      )
    }
  }

  const renderFormTitle = () => {
    switch(screenNumber) {
      case 1:
        return (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Hello!</Text>

            <View style={styles.subTitleContainer}>
              <Text style={[styles.subTitle, {'textAlign': 'center'}]}>Before we start, we just have a few optional questions...</Text>
            </View>
          </View>
        )
      case 2:
        return (
          <View style={styles.titleContainer}>
            <View style={styles.subTitleContainer}>
              <Text style={styles.subTitle}>And just a few more...</Text>
            </View>
          </View>
        )
    }
  }

  const renderForm = () => {
    return (
      <View style={styles.formContainer}>
        {renderFormTitle()}

        {renderTextEntries()}

        {/* See comments in style: this invisible component allows full width container */}
        <View style={styles.fullWidth}></View>

        <View style={styles.skipTextContainer}>
          {screenNumber === 2 && <View style={{ marginBottom: spacings.MEDIUM }}><SignInButton text={"Finish"} onPress={handleFormSubmit} background={colors.BACKGROUND}/></View>}

          <Pressable onPress={handleFormSkip} hitSlop={spacings.hitSlopLarge} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
            <Text style={styles.linkText}>Skip For Now</Text>
          </Pressable>

          {renderErrorMessage()}
        </View>
      </View>
    )
  }

  const renderScreenSelectorIcons = () => {
    if (screenNumber===1) {
      return (
        <View style={styles.iconsContainer}>
          <View style={[styles.circle, styles.circleSelected]}></View>
          <Pressable onPress={handleFormSubmit} hitSlop={spacings.hitSlopLarge} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }><View style={styles.circle}></View></Pressable>
        </View>
      )
    } else {
      return (
        <View style={styles.iconsContainer}>
          <Pressable onPress={moveToPreviousOnboardingScreen} hitSlop={spacings.hitSlopLarge} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }><View style={styles.circle}></View></Pressable>
          <View style={[styles.circle, styles.circleSelected]}></View>
        </View>
      )
    }
  }

  return (
    <>
      <SafeAreaTop />

      <SafeAreaBottom>
        {/* Wrap most of the entire View in a Pressable so that clicking outside of the TextArea will dismiss keyboard  */}
        <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <LinearGradient
              colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
              style={styles.container}
            >
              {renderForm()}
            </LinearGradient>
          </KeyboardAvoidingView>

          {renderScreenSelectorIcons()}
        </Pressable>
      </SafeAreaBottom>
    </>
  )
}

export const styles = StyleSheet.create({
  // DEBUG: Styling Bug 1: for some reason, alignItems is NEEDED for container to show.
  container: {
    flex: 1,
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: spacings.HUGE
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: spacings.HUGE
  },
  subTitleContainer: {
    alignItems: 'center',
    paddingVertical: spacings.LARGE
  },
  formFieldsContainer: {
    width: Math.min(sizes.SCREEN_WIDTH_66, 800),
  },
  title: {
    ...text.h1,
  },
  subTitle: {
    ...text.h3,
  },
  fieldContainer: {
    paddingVertical: spacings.HUGE
  },
  textEntryContainer: {
    marginVertical: spacings.MEDIUM,
  },
  fieldLabel: {
    ...text.h4
  },
  iconsContainer: {
    position: 'absolute',
    bottom: spacings.ABSOLUTE_OFFSET_LARGE,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacings.HUGE,
  },
  circle: {
    backgroundColor: 'transparent',
    borderColor: colors.BACKGROUND,
    borderWidth: 1,
    width: icons.SMALL.fontSize - 18,
    aspectRatio: 1,
    borderRadius: (icons.SMALL.fontSize - 18) /  2,
    margin: spacings.SMALL
  },
  circleSelected: {
    backgroundColor: colors.BACKGROUND
  },
  skipTextContainer: {
    marginTop: spacings.MEDIUM,
    alignItems: 'center'
  },
  linkText: {
    ...text.footnote,
    textDecorationLine: 'underline',
    color: colors.BACKGROUND
  },
  // DEBUG: Styling Bug 2.
  // Although parent (styles.container) should be able to expand to full width using flex: 1,
  // It isn't doing that. So we need to define an invisible child component within the container,
  // with width 100%, so that the base container will expand to the full width of the screen
  fullWidth: {
    opacity: 0,  // make invisible
    width: "100%",
    aspectRatio: 1000 / 1,  // extremely narrow full width container, small/invisible height
    backgroundColor: colors.BACKGROUND,
  },
})

export default OnBoarding1;
