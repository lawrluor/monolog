import React from 'react';
import { StyleSheet, View, ScrollView, Text, Pressable, Alert, ImageBackground } from 'react-native';
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import GoBack from '../components/GoBack';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/native';
import { pathwaysPrompts } from '../utils/pathwaysData'
import SignInButton from '../components/SignInButton';
import { removeCurrentPathway, updateCurrentPathway } from '../utils/updatePathwaysUser';
import UserContext from '../context/UserContext';

const PathwaysPrompt = ({ route, navigation }: any): JSX.Element => {
  const { pathway, level } = route.params
  const { user, setUser } = React.useContext(UserContext);
  let pathwaysPromptsData = JSON.stringify(pathwaysPrompts)
  pathwaysPromptsData = JSON.parse(pathwaysPromptsData)

  const prompt = pathwaysPromptsData[pathway][level]
  const navigateToRecording = () => {
    navigation.navigate('Recording');
  }
  const backAndReset = async () => {
    let updatedUser = { ...user, ...{ currentPathway: " " } }
    setUser(updatedUser)
    console.log('USER ON PROMPT', user)
    navigation.goBack()
  }
  return (
    <>
      <GoBack callback={() => backAndReset()}/>
      
      <View style={styles.background}>
        <Text style={styles.promptNum}>Prompt #{level}</Text>
        <Text style={styles.prompt}>{prompt}</Text>
        <SignInButton background={colors.HIGHLIGHT} onPress={() => navigateToRecording()}>
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
