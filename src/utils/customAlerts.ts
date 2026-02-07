import { Alert } from 'react-native';
import { deleteAllData } from './localStorageUtils';

type OptionalCallback = () => void | Promise<void>;

type SimpleAlertProps = {
  title: string;
  message: string;
  buttonText: string;
  callback: () => void;
}

// Wrapper for an Alert Message with one choice
export const simpleAlert = ({ title, message, buttonText, callback }: SimpleAlertProps) => {
  Alert.alert(
    title,
    message,
    [
      { text: buttonText, onPress: callback }
    ]
  )
}


// NOTE: This function isn't being used yet.
export const editProfileAlert = () => {
  return Alert.alert(
    "Edit Profile",
    "Edit your profile.",
    [
      { text: "OK" },
    ]
  )
}

export const deleteDataAlert = (callback: OptionalCallback = () => { }) => {
  Alert.alert(
    "Delete Data",
    "Delete all your profile data and logs?",
    [
      { text: "Delete Data", onPress: () => deleteDataConfirmation(callback), style: 'destructive' },
      { text: "Cancel" },
    ]
  )
}

export const deleteDataConfirmation = (callback: OptionalCallback = () => { }) => {
  const deleteDataWrapper = async () => {
    await deleteAllData();

    // The callback is called after pressing the final confirmation button.
    // Right now, this should usually be navigation.navigate('AuthLoading')
    callback();
  }

  return Alert.alert(
    "Warning",
    "Continuing will result in all your data on Monist being deleted.",
    [
      { text: "Continue", onPress: deleteDataWrapper, style: 'destructive' },
      { text: "Cancel", style: 'cancel' }
    ]
  )
}

export const feedbackConfirmationSuccess = () => {
  Alert.alert(
    "Feedback Sent",
    "Thank you for sending the Monist team your feedback!",
    [
      {
        text: "OK"
      }
    ]
  );
}

export const feedbackConfirmationFailure = () => {
  Alert.alert(
    "Note",
    `Your feedback was not submitted.`,
    [
      {
        text: "OK"
      },
    ]
  );
}

export const comingSoonAlert = (callback: OptionalCallback = () => { }) => {
  return simpleAlert({
    title: "Hold up!",
    message: "This feature is coming soon.",
    buttonText: "OK",
    callback: callback
  })
}

// TODO:
// export const AlertTwoOptions ...
// export const AlertThreeOptions ...