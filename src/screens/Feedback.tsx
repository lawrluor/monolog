import React from 'react';
import { StyleSheet, Platform, KeyboardAvoidingView, View, Text, Pressable, Linking, Alert, Keyboard } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { TextArea } from '../components/TextEntry';
import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';
import SignInButton from '../components/SignInButton';

import { feedbackConfirmationSuccess, feedbackConfirmationFailure } from '../utils/customAlerts';

import { containers, text, spacings, colors } from '../styles';

const FEEDBACK_EMAIL_ADDRESS = "monist@monist.me";

// See https://blog.codemagic.io/how-to-make-your-react-native-app-send-emails/
const sendEmail = async (to: string, subject: string, body: string) => {
  // Helper function that prepares raw text that is to be sent as an email
  // TODO: empty lines appear as <BR> tag, how do we parse through them first?
  // Example: "Hi\n\nThere" becomes "Hi<BR><BR>There" inside the email body
  // Parsing and replacing each '\n' with '%0A', the newline character in query strings, doesn't work.
  const sanitizeBody = (text: string) => {
    let sanitized = text.replace('\\n', '\\t');  // This has the same result
    console.log("sanitized", text);
    return sanitized;
  }

  let sanitizedBody = sanitizeBody(body);

  // url format: mailto:<receiver_email>?subject=<subject>&body=<body>&cc=<emails_to_copy></emails_to_copy>
  let url = `mailto:${to}?subject=${subject}&body=${sanitizedBody}`;

  // Check that the url is valid and can be opened
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    throw new Error('Provided URL can not be handled');
  }

  // Open the url, which opens the user's default email app
  return Linking.openURL(url);
}

const Settings = ({ navigation }): JSX.Element => {
  const placeholderText = "Your feedback is very important to us - please tell us how we can build a better app for you!";
  const [feedbackText, setFeedbackText] = React.useState<string>("");

  // Wrapper around state setter setFeedbackText, to help with text validation, etc in the future
  const handleOnChange = (text: string) => {
    setFeedbackText(text);
  }

  const sendEmailButtonCallback = () => {
    sendEmail(FEEDBACK_EMAIL_ADDRESS, "Monist App Feedback", feedbackText);

     // Hacky way to have a "callback" for when sending feedback through outside email app
     // Have a delay so that there is no "whiplash" from navigating screen immediately 
     // After they either send or don't send the email, on navigating back to Monist,
      // they will have been navigated to the moe page with this confirmation alert.
    // NOTE: we could clear the Feedback textarea, but better to leave it there
    // in case users would like to edit their text later or accidentally leave the screen.
    setTimeout(submitFeedbackConfirmation, 2000); 
  }

  const submitFeedbackConfirmation = () => {
    Alert.alert(
      "Please Note:",
      `In order for the Monist team to receive your feedback, you must have sent it via email to ${FEEDBACK_EMAIL_ADDRESS} when prompted.`,
      [
        { 
          text: "No Thanks", onPress: feedbackConfirmationFailure
        },
        { 
          text: "Done",
          onPress: () => {   
            navigation.navigate('Home');  
            feedbackConfirmationSuccess();
          }
        }
      ]
    );    
  } 

  const openEmailAppAlert = () => {
    Alert.alert(
      "Sending Feedback...",
      "This will open your default email app.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: feedbackConfirmationFailure
        },
        { 
          text: "OK",
          onPress: sendEmailButtonCallback
        }
      ]
    );
  }

  // Hides the keyboard and allows User to send feedback, with fields populated, via email
  const handleSubmit = () => {
    Keyboard.dismiss();
    openEmailAppAlert();
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
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Feedback</Text>
              </View>

              <View style={styles.textAreaContainer}>
                {/* See comments in Onboarding screens: this component being full screen width 
                is the only thing that allows the container to be full width!!! */}
                <TextArea onChange={handleOnChange} editable placeholder={placeholderText} />
              </View>

              <SignInButton text={"Submit Feedback"} background={colors.BACKGROUND} onPress={handleSubmit}/>
            </LinearGradient>
          </KeyboardAvoidingView>
        </Pressable>
      </SafeAreaBottom>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    ...containers.DEFAULT,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
  },
  textAreaContainer: {
    marginTop: spacings.HUGE,
    marginBottom: spacings.HUGE,
    marginHorizontal: spacings.HUGE,
  },
  title: {
    ...text.h1
  }
});

export default Settings;
