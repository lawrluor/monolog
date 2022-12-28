import React from 'react';
import { StyleSheet, View, ScrollView, Text, Pressable, Alert, ImageBackground } from 'react-native';
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';
import { dimensions, text, spacings, icons, colors, debug } from '../styles';
import GoBack from '../components/GoBack';
import { NavigationHelpersContext, useNavigation } from '@react-navigation/native';
import { pathwaysPrompts } from '../utils/pathwaysData'
import SignInButton from '../components/SignInButton';
import UserContext from '../context/UserContext';
import { LinearGradient } from 'expo-linear-gradient';
import VistaSummaryText from '../components/VistaSummaryText';

const PathwaysPrompt = ({ route, navigation }: any): JSX.Element => {
  const { pathway, level } = route.params
  const { user, setUser } = React.useContext(UserContext);
  let pathwaysPromptsData = JSON.stringify(pathwaysPrompts)
  pathwaysPromptsData = JSON.parse(pathwaysPromptsData)

  const prompt = pathwaysPromptsData[pathway][level-1]
  const navigateToRecording = () => {
    navigation.navigate('Recording');
  }
  const backAndReset = async () => {
    let updatedUser = { ...user, ...{ currentPathway: " " } }
    setUser(updatedUser)
    navigation.goBack()
  }
  return (
    <View style={styles.container}>
      <GoBack callback={() => backAndReset()} />
      <SafeAreaTop />
      <SafeAreaBottom transparent>
        <LinearGradient
          colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
          style={styles.container}
        >
          <View style={styles.featureContainer}>
            <Text style={styles.promptNum}>Prompt #{level}</Text>
            <Text style={styles.prompt}>{prompt}</Text>
            <SignInButton background={colors.HIGHLIGHT} onPress={() => navigateToRecording()}>
              <Text style={text.h3}> Record </Text>
            </SignInButton>
          </View>
        </LinearGradient>
      </SafeAreaBottom>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  featureContainer: {
    position: 'absolute',
    left: '10%',
    top: '30%',
    backgroundColor: colors.BACKGROUND,
    borderRadius: 20,
    width: "80%",
    marginBottom: spacings.HUGE,
    padding: spacings.HUGE,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
  },
  background: {
    backgroundColor: "#bebebe",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  prompt: {
    ...text.h3,
    color: "black",
    textAlign: 'center',
    // marginBottom: "5%",
    // marginTop: "3%"
    margin: spacings.HUGE,
  },
  promptNum: {
    ...text.h4,
    color: "black",
    textAlign: 'center',
    margin: spacings.SMALL,
  }
})

export default PathwaysPrompt
