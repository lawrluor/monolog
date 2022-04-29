import { Alert } from 'react-native';

// type SimpleAlertProps = {
//   title: string,
//   message: string,
//   buttonText: string,
//   callback: Function
// }

// Wrapper for an Alert Message with one choice
export const simpleAlert = (title, message, buttonText, callback) => {
  Alert.alert(
    title,
    message,
    [
      { text: buttonText, onPress: callback }
    ]
  )
}

export const comingSoonAlert = (callback) => {
  return simpleAlert(
    title="Hold up!",
    message="This feature is coming soon.",
    buttonText="OK",
    callback=callback
  )
}

// TODO:
// export const AlertTwoOptions ...
// export const AlertThreeOptions ...