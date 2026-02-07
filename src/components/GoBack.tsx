import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { spacings, icons, colors } from '../styles';
import CustomIcon from './CustomIcon';

type Props = {
  callback?: () => void;
}

// Can take an optional callback function
// But by default, will simply call navigation.goBack()
// If going back is not possible, this component will not be be rendered
const GoBack = ({ callback }: Props) => {
  const navigation = useNavigation();

  const navigateBack = () => {
    navigation.goBack();
  }

  if (!navigation.canGoBack()) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.goBackContainer} onPress={callback ? callback : navigateBack} hitSlop={spacings.hitSlopLarge}>
      <CustomIcon style={styles.backIcon} name='back_arrow_no_circle' />
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
