import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';

import { colors, text, spacings, dimensions, sizes } from '../styles';

type Props = {
  text?: string,
  background: string, 
  onPress: () => void;  // TODO: how to interpret the many different return values of a function passed to a button?
  children: any
}

const SignInButton = ({ children, text, background, onPress }: Props): JSX.Element => {
  return (
    <Pressable onPress={onPress} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
      <View style={[styles.container, { backgroundColor: background }]}>
        {children}
        <Text style={styles.text}>{text}</Text>
      </View>
    </Pressable>
  )
}

export const RecordActionButton = ({ callback }: any) => {
  return (
    <SignInButton 
      background={colors.HIGHLIGHT}
      onPress={callback}
    > 
      <Text style={text.h4}>Record</Text>
    </SignInButton>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    borderRadius: (dimensions.width * 0.66) / 2,
    borderColor: colors.BACKGROUND,
    backgroundColor: colors.BACKGROUND,
    width: sizes.SCREEN_WIDTH_66,
    aspectRatio: 5 / 1,
    padding: spacings.TINY,
    margin: spacings.SMALL, 
    shadowColor: '#000000',
    shadowOffset: { width: 5, height: 5},
    shadowOpacity: 0.2
  },
  text: {
    ...text.h4,
    color: colors.SECONDARY
  }
});

export default SignInButton;