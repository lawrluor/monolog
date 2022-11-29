import React from 'react';
import { StyleSheet, View, ScrollView, Text, Pressable, Alert, ImageBackground } from 'react-native';
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import GoBack from '../components/GoBack';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/native';
import { pathwaysPrompts } from '../utils/pathwaysData'
import SignInButton from '../components/SignInButton';
import { removeCurrentPathway, updateCurrentPathway } from '../utils/updatePathwaysUser';
import { readUserData } from '../utils/localStorageUtils';

const PathwaysPrompt = ({ route, navigation }: any): JSX.Element => {
  const { pathway, level } = route.params
  let pathwaysPromptsData = JSON.stringify(pathwaysPrompts)
  pathwaysPromptsData = JSON.parse(pathwaysPromptsData)
  console.log("Pathway ", pathway)
  const prompt = pathwaysPromptsData[pathway][level]
  const navigateToRecording = (pathwayName: string) => {
    navigation.navigate('Recording', { pathway:pathwayName });
  }
  const backAndReset = async () => {
    // reset users current pathway
    await removeCurrentPathway();
    console.log(await readUserData())
    navigation.goBack()
  }
  return (
    <>
      <GoBack callback={() => backAndReset()}/>
      
      <View style={styles.background}>
        <Text style={styles.promptNum}>Prompt #{level}</Text>
        <Text style={styles.prompt}>{prompt}</Text>
        <SignInButton background={colors.HIGHLIGHT} onPress={() => navigateToRecording(pathway)}>
          <Text style={text.h3}> Record </Text>
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
