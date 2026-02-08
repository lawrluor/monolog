import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { spacings, icons, colors } from '../styles';
import CustomIcon from './CustomIcon';

type Props = {
  callback?: () => void;
}

// A container with clickable text to navigate forward
const GoForward = ({ callback }: Props) => {
  return (
    <TouchableOpacity style={styles.goForwardContainer} onPress={callback} hitSlop={spacings.hitSlopLarge}>
      <CustomIcon style={styles.forwardIcon} name='forward_arrow_no_circle' />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  goForwardContainer: {
    position: 'absolute',
    left: spacings.MASSIVE,
    top: spacings.ABSOLUTE_OFFSET_MEDIUM,
    zIndex: 15, // works on ios
    elevation: 3, // works on android
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
