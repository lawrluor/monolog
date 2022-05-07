import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { text, spacings, colors, dimensions } from '../styles';

import { ActionButton } from './SignInButton';
import GoBack from './GoBack';

import { LinearGradient } from 'expo-linear-gradient';
import { deleteDataAlert } from '../utils/customAlerts';

type Props = {
  size?: string
}

const Spinner = ({ size }: Props) => {
  return (
    <View style={styles.spinner}>
      <ActivityIndicator size={size || 'large'} />
    </View>
  )
}

// size should generally be "large", unless you want full page with small spinner
const FullPageSpinner = ({ size }) => {
  const [message, setMessage] = useState('');

  // Notes:
  // 1. timeout is not cleared in AppStackLoading, possibly because component is not popped off but just navigated away from
  // 2. However, timeouts in App.js and AuthLoading.js are usually cleared even before they begin, since loading is faster than timeout interval
  // 3. This means timer is not cleared and possibly may lead to performance problems over periods of time
  useEffect(():void => {
    // Run on mount
    const timeout = setTimeout(():void => {
      console.log("[DEBUG] Timeout began")
      setMessage('Please make sure you have the latest version of the app and that you have allowed all permissions that the app requests. If you\'re having trouble, you can delete your data and reload the app. If that doesn\'t help, please delete and reinstall the app. You will still lose your saved logs, however.');
    }, 5000);

    // Unmount cleanup, clear timeout if component unmounted
    return ():void => {
      console.log("[DEBUG] Full Page Spinner unmounting");
      if (typeof timeout !== 'undefined') {
        // Make sure variable exists before trying to clear it
        clearTimeout(timeout);
      }
    }
  }, []);

  return (
    <LinearGradient
      colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
      style={styles.fullSizeContainer}
    >
      <ActivityIndicator size={size} />
      {
        message 
        ? 
        <>
          <GoBack />
          
          <View style={{ marginVertical: spacings.LARGE }}>
            <Text style={styles.messageText}>{message}</Text> 
          </View>

          <View style={{ marginVertical: spacings.LARGE }}>
            <ActionButton callback={deleteDataAlert} text={"Delete Data"}/>
          </View>
        </>
        : 
        null
      }
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullSizeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: dimensions.width,
    height: dimensions.height, 
    position: 'absolute'
  },
  messageText: {
    ...text.p,
    top: spacings.HUGE,
    marginHorizontal: spacings.LARGE,
    textAlign: 'center'
  }
});

export { Spinner, FullPageSpinner };
