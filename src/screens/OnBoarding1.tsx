import React from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView,  Keyboard, Platform, Pressable } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { text, spacings, colors, icons } from '../styles';

import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';
import TextEntry from '../components/TextEntry';

const OnBoarding1 = ({ route, navigation }: any): JSX.Element => {
  const textRefs = [textRef0, textRef1, textRef2, textRef3] = [React.createRef(), React.createRef(), React.createRef(), React.createRef()];

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [textStates, setTextStates] = React.useState([firstName, lastName, email]);

  // For alpha release, skipping middle onboarding page
  const navigateToOnBoarding2 = () => {
    navigation.navigate('OnBoarding2', {
      userData: {
        "firstName": firstName,
        "lastName": lastName,
        "email": email
      }
    });
  }

  // Handles what happens when a TextInput is finished editing.
  // Updates the array of strings states, then focuses the next text ref
  const handleTextOnFinish = (index: number) => {
    // TODO: handle index+1 better to avoid out of range errors
    let nextIndex: number = index + 1;
    console.log(nextIndex, nextIndex);
    (nextIndex >= 3) ? navigateToOnBoarding2() : selectTextRef(nextIndex);  

    // Alternatively: Skip to end of onboarding. 
    // Discuss: The UX of having a profile pic page that doesn't work doesn't seem to make sense.
    // (nextIndex >= 3) ? setShouldOnboard(false); : selectTextRef(nextIndex);  
  }

  // Callback to be passed down to each child TextEntry.
  // When "next/done" is pressed in child TextEntry,
  // this callback will allow the parent OnBoarding screen to focus on the next TextEntry element.
  const selectTextRef = (index: number) => {
    textRefs[index].current.focus();
  }

  // TODO: Allow pressing out of text entries, either by adding ScrollView (hack) or full screen modal
  const renderTextEntries = () => {
    return (
      <View style={styles.textEntriesContainer}>
        <View style={styles.textEntryContainer}><TextEntry placeholderValue="First Name" editable isTextBox returnKeyType="next" innerRef={textRefs[0]} textState={firstName} setTextState={setFirstName} onFinish={() => handleTextOnFinish(0)}/></View>
        <View style={styles.textEntryContainer}><TextEntry placeholderValue="Last Name" editable isTextBox returnKeyType="next" innerRef={textRefs[1]} textState={lastName} setTextState={setLastName} onFinish={() => handleTextOnFinish(1)}/></View>
        <View style={styles.textEntryContainer}><TextEntry placeholderValue="Email" editable isTextBox returnKeyType="done" innerRef={textRefs[2]} textState={email} setTextState={setEmail}  onFinish={() => handleTextOnFinish(2)}/></View>
      </View>
    )
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
              <View style={styles.formContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Greetings!</Text>
                  <Text style={styles.subTitle}>Before we start, we just have a few questions...</Text>
                </View>

                {renderTextEntries()}

                {/* See comments in style: this invisible component allows full width container */}
                <View style={styles.fullWidth}></View>

                <View style={styles.skipTextContainer} >
                  <Pressable onPress={navigateToOnBoarding2} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
                    <Text style={styles.linkText}>Skip For Now</Text>
                  </Pressable>
                </View>
              </View>

            </LinearGradient>
          </KeyboardAvoidingView>

          <View style={styles.iconsContainer}>
            <View style={[styles.circle, styles.circleSelected]}></View>
            <Pressable onPress={navigateToOnBoarding2} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }><View style={styles.circle}></View></Pressable>
          </View>

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
    justifyContent: 'center'
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: spacings.MEDIUM
  },
  title: {
    ...text.h1,
  },
  subTitle: {
    ...text.h3,
    textAlign: 'center',
    paddingVertical: spacings.MEDIUM
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
    marginTop: spacings.MEDIUM
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
  }
})

export default OnBoarding1;
