import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { spacings, icons, colors } from '../styles';

import CustomIcon from './CustomIcon';

// A container with clickable text to navigate back
type Props = {
  text?: string,
  callback?: any
}

const GoBack = ({ callback }: Props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.goBackContainer} onPress={callback ? callback : () => navigation.goBack()} hitSlop={spacings.hitSlopLarge}>
      <CustomIcon style={styles.backIcon} name='back_arrow' />
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
