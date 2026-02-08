import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';
import { containers, text, spacings, colors } from '../styles';

const Settings = () => {
  return (
    <>
      <SafeAreaTop />

      <SafeAreaBottom>

        <LinearGradient
          // Background Linear Gradient
          colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
          style={styles.container}
        >
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Settings</Text>
          </View>
        </LinearGradient>
      </SafeAreaBottom>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    ...containers.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.HIGHLIGHT
  },
  titleContainer: {
    alignItems: 'center',
    padding: spacings.MEDIUM
  },
  title: {
    ...text.h1,
  }
})

export default Settings;
