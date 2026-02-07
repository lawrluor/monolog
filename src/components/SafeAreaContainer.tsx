import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { colors } from '../styles';

type SafeAreaType = {
  transparent?: boolean;
  children?: any;
}

export const SafeAreaContainer = (props: SafeAreaType) => {
  return (
    <>
      <SafeAreaView style={!props.transparent ? styles.safeAreaTop : styles.safeAreaTopTransparent} />

      <SafeAreaView style={!props.transparent ? styles.safeAreaBottom : styles.safeAreaBottomTransparent}>
        {props.children}
      </SafeAreaView>
    </>
  )
}

export const SafeAreaTop = ({ transparent }: SafeAreaType) => {
  return (
    <SafeAreaView style={!transparent ? styles.safeAreaTop : styles.safeAreaTopTransparent} />
  )
}

export const SafeAreaBottom = ({ transparent, children }: SafeAreaType) => {
  // TODO: Selecting between the two safeAreaBottom styles based on the transparent prop seems bugged
  // However, transparent=true is passed as a prop successfully and works in SafeAreaTop
  return (
    <SafeAreaView style={!transparent ? styles.safeAreaBottom : styles.safeAreaBottomTransparent}>
      {children}
    </SafeAreaView>
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
  },
  safeAreaTopTransparent: {
    flex: 0,
    backgroundColor: 'transparent'
  },
  safeAreaBottomTransparent: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});