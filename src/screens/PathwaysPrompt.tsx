import React from 'react';
import { StyleSheet, View, ScrollView, Text, Pressable, Alert, ImageBackground } from 'react-native';
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import GoBack from '../components/GoBack';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/native';
import { pathwaysPrompts } from '../utils/pathwaysData'
import SignInButton from '../components/SignInButton';

const PathwaysPrompt = ({ route, navigation }: any): JSX.Element => {
  const { pathway, level } = route.params
  const prompt = pathwaysPrompts[pathway][level]

  return (
    <>
      <GoBack />
      
      <View style={styles.background}>
        <Text style={styles.promptNum}>Prompt #{level}</Text>
        <Text style={styles.prompt}>{prompt}</Text>
        <SignInButton background={colors.HIGHLIGHT} onPress={() => { console.log("pressed") }}>
          <Text style={text.h4}> Record </Text>
        </SignInButton>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#bebebe",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  prompt: {
    ...text.h2,
    color: "#f8f8f8",
    marginBottom: "5%",
    marginTop: "3%"
  },
  promptNum: {
    ...text.h3,
    color: "#f8f8f8"
  }
})

export default PathwaysPrompt
