import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';

import { colors } from '../styles';

const AudioOverlay = ({ children }: any) => {
  return (
    <>
      <SafeAreaTop /> 

      <SafeAreaBottom>
      <LinearGradient
          // Background Linear Gradient
          colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
          style={styles.container}
        >
          {children}
        </LinearGradient>
      </SafeAreaBottom>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default AudioOverlay;