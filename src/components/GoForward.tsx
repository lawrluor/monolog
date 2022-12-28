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

const GoForward = ({ callback }: Props, styleProp:Props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.goForwardContainer} onPress={callback} hitSlop={spacings.hitSlopLarge}>
      <CustomIcon style={styles.forwardIcon} name='forward_arrow_no_circle' />
    </TouchableOpacity>
  )
}

// Optional: Text-based rather than icon based
const GoForwardText = ({ text, callback }: Props) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.goForwardContainer} onPress={callback} hitSlop={spacings.hitSlopLarge}>
      <Text style={styles.goForwardText}>{text || "Forward"}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  goForwardContainer: {
    position: 'absolute',
    left: spacings.MASSIVE,
    top: spacings.ABSOLUTE_OFFSET_MEDIUM,
    zIndex: 15, // works on ios
    // elevate: 3, // works on android
  },
  forwardIcon: {
    ...icons.SMALL,
    color: colors.BACKGROUND
  },
  goForwardText: {
    color: 'white',
    marginHorizontal: spacings.MEDIUM,
  }
});

export default GoForward;
