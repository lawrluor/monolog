import React from 'react';
import { StyleSheet } from 'react-native';
import AppLoading from 'expo-app-loading';

import { useFonts } from 'expo-font';

import MainNavigator from './src/navigation/MainNavigator';

import {
  createAllDirectories,
} from './src/utils/localStorageUtils';

import { colors } from './src/styles';
import { VideosProvider } from './src/context/VideosContext';
import { UserProvider } from './src/context/UserContext';

const App = (): JSX.Element => {
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [inTimeout, setInTimeout] = React.useState<boolean>(true);

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

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setInTimeout(false);
    }, 500);

    return () => {
      clearTimeout(timer)
    }
  }, []);

  // App Setup
  React.useEffect(() => {
    const setup = async () => {
      setConsoleLogging();
      await createAllDirectories();
      setIsLoaded(true);
    }

    setup();
  }, [])

  return (
    <UserProvider>
        {
          !fontsLoaded || !isLoaded || inTimeout
          ?
          <AppLoading />
          :
          <VideosProvider>
            <MainNavigator></MainNavigator>
          </VideosProvider>

        }
    </UserProvider>
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
