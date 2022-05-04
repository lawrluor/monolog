import React from 'react';
import { StyleSheet, LogBox, YellowBox } from 'react-native';
import AppLoading from 'expo-app-loading';

import { useFonts } from 'expo-font';

import MainNavigator from './src/navigation/MainNavigator';

import { 
  createVideoDirectory,  
  createRatingDirectory,
  createThumbnailDirectory,
  createTranscriptDirectory,
  createUserDataDirectory
} from './src/utils/localStorageUtils';

import { colors } from './src/styles';

// No props currently
const App = (): JSX.Element => {
  let [fontsLoaded] = useFonts({
    'CircularStd-Book': require('./assets/fonts/CircularStd-Book.otf'),
    'CircularStd-Medium': require('./assets/fonts/CircularStd-Medium.otf'),
    'CircularStd-Black': require('./assets/fonts/CircularStd-Black.otf'),
    'Coconat-Regular': require('./assets/fonts/Coconat-Regular.otf'),
    'IcoMoon': require('./assets/fonts/icomoon.ttf')
  })

  const setConsoleLogging = () => {
    // Disable all console.log statements if not in Dev mode
    // See https://stackoverflow.com/questions/38939917/removing-console-log-from-react-native-app
  
    if (!__DEV__) {
      console.log = () => {};
    }

    // TODO: Disabling warning logs should be straightforward but does not work
    // Using Yellowbox or other deprecated methods does not work either
    // LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
    // LogBox.ignoreAllLogs(); //Ignore all log notifications
  }

  // App Setup
  // TODO: should move all directory creating to here?
  React.useEffect(() => {
    setConsoleLogging();
    createVideoDirectory();
    createThumbnailDirectory();
    createRatingDirectory();
    createTranscriptDirectory();
    createUserDataDirectory();
  }, [])

  // if debugging, set debug borders on all elements
  return (
    !fontsLoaded
    ?
    <AppLoading />
    :
    <MainNavigator></MainNavigator>
  )
}

const styles = StyleSheet.create({
  safeAreaTop: {
    flex: 0,
    backgroundColor: colors.HIGHLIGHT
  },
  safeAreaBottom: {
    flex: 1,
    backgroundColor: colors.HIGHLIGHT2
  }
});

export default App;