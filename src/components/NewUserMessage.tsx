import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import SignInButton from './SignInButton';

import { text, spacings, icons, colors } from '../styles';

// This component does not render if user has more than enough videos
// It also will not render if the user closes the alert
// These states belong to the parent component, which renders this component conditionally,
  // and is NOT passed these states as props.
const NewUserMessage = ({ navigateCallback }: any) => {
  return (
    <View style={styles.featureContainer}>
      <Text style={styles.featureTitle}>Vistas</Text>
      <View style={styles.newUserAlertTextContainer}>
        <Text style={styles.newUserAlertText}>
          Your vistas will appear after your first log.
          Press the button below to get started!
        </Text>
      </View>

      <View style={styles.newUserAlertButtonContainer}>
        <SignInButton
          background={colors.HIGHLIGHT}
          onPress={navigateCallback}
        >
          <Text style={text.h4}>Record</Text>
        </SignInButton>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  featureContainer: {
    backgroundColor: colors.BACKGROUND,
    borderRadius: 20,
    width: "100%",
    marginBottom: spacings.HUGE,
    padding: spacings.HUGE,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
  },
  featureTitle: {
    ...text.h4,
    marginBottom: spacings.SMALL,
    color: colors.PRIMARY
  },
  newUserAlertTextContainer: {
    alignItems: 'center',
    padding: spacings.MEDIUM,
  },
  newUserAlertText: {
    ...text.p,
    textAlign: 'center',
  },
  newUserAlertButtonContainer: {
    alignItems: 'center'
  },
  closeButtonContainer: {
    position: 'absolute',
    right: spacings.MEDIUM,
    top: spacings.MEDIUM,
  },
  closeButton: {
    ...icons.TINY,
    color: colors.PRIMARY,
  }
});

export default NewUserMessage;