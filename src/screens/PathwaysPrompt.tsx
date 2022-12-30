import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import UserContext from '../context/UserContext';

import GoBack from '../components/GoBack';
import SignInButton from '../components/SignInButton';

import { pathwaysPrompts } from '../utils/pathwaysData'

import { text, spacings, colors } from '../styles';

const PathwaysPrompt = ({ route, navigation }: any): JSX.Element => {
  const { pathway, level } = route.params;
  const { user, setUser } = React.useContext(UserContext);

  let pathwaysPromptsData = JSON.stringify(pathwaysPrompts);
  pathwaysPromptsData = JSON.parse(pathwaysPromptsData);
  const prompt = pathwaysPromptsData[pathway][level];

  const navigateToRecording = () => {
    navigation.navigate('Recording');
  }

  const backAndReset = async () => {
    let updatedUser = { ...user, ...{ currentPathway: " " } };
    setUser(updatedUser);
    navigation.goBack();
  }

  return (
    <LinearGradient
      colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
      style={styles.container}
    >
      <GoBack callback={backAndReset}/>

      <View style={styles.featureContainer}>
        <Text style={styles.promptNum}>Prompt #{level + 1}</Text>
        <Text style={styles.prompt}>{prompt}</Text>

        <SignInButton background={colors.HIGHLIGHT} onPress={navigateToRecording}>
          <Text style={text.h4}>Record</Text>
        </SignInButton>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  featureContainer: {
    backgroundColor: colors.BACKGROUND,
    borderRadius: 20,
    width: "80%",
    marginBottom: spacings.HUGE,
    padding: spacings.HUGE,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
  },
  prompt: {
    ...text.h4,
    color: colors.PRIMARY,
    textAlign: 'center',
    margin: spacings.HUGE,
  },
  promptNum: {
    ...text.h4,
    color: colors.SECONDARY,
    textAlign: 'center',
    margin: spacings.SMALL,
  }
})

export default PathwaysPrompt
