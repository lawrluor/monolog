import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useNavigation, StackActions } from '@react-navigation/native';

import { spacings, icons, colors } from '../styles';

import CustomIcon from './CustomIcon';

// A container with clickable text to navigate back
type Props = {
  callback?: any
}

// This component can take an optional callback function
// But by default, will simply call navigation.goBack()
const GoBack = ({ callback }: Props) => {
  const navigation = useNavigation();

  const navigateBack = () => {
    // See https://reactnavigation.org/docs/navigation-prop/#cangoback
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      console.log('error going back');
    }
  }

  return (
    <TouchableOpacity style={styles.goBackContainer} onPress={callback ? callback : navigateBack} hitSlop={spacings.hitSlopLarge}>
      <CustomIcon style={styles.backIcon} name='back_arrow_no_circle' />
    </TouchableOpacity>
  )
}

// Optional: Text-based rather than icon based
const GoBackText = ({ text }: Props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.goBackContainer} onPress={() => navigation.goBack()} hitSlop={spacings.hitSlopLarge}>
      <Text style={styles.goBackText}>{text || "Back"}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  goBackContainer: {
    position: 'absolute',
    left: spacings.MASSIVE,
    top: spacings.ABSOLUTE_OFFSET_MEDIUM,
    zIndex: 15, // works on ios
    // elevate: 3, // works on android
  },
  backIcon: {
    ...icons.SMALL,
    color: colors.BACKGROUND
  },
  goBackText: {
    color: 'white',
    marginHorizontal: spacings.MEDIUM,
  }
});

export default GoBack;
