import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { type RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import UserContext from '../context/UserContext';
import GoBack from '../components/GoBack';
import SignInButton from '../components/SignInButton';
import { pathwaysPrompts } from '../utils/pathwaysData'
import { text, spacings, colors } from '../styles';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type AppStackParamsList } from '../types/navigation';
import { type User } from '../types/user';

interface Props {
  route: RouteProp<AppStackParamsList, 'PathwaysPrompt'>;
  navigation: StackNavigationProp<AppStackParamsList>;
}

const PathwaysPrompt = ({ route, navigation }: Props) => {
  const { pathwayName, level } = route.params;

  const userContext = React.useContext(UserContext);
  if (!userContext) throw new Error('UserContext must be used wtihin a provider');
  const { user, setUser } = userContext;

  const pathwaysPromptsData: Record<string, string[]> = pathwaysPrompts;
  const promptsForPathway = pathwaysPromptsData[pathwayName] ?? [];
  let prompt = promptsForPathway[level - 1] ?? '';

  // Continue showing the second prompt for new years resolution pathway
  if (pathwayName === "New Year's Resolutions" && level >= 1) {
    prompt = pathwaysPromptsData[pathwayName]?.[1] ?? prompt;
  }

  const navigateToRecording = () => {
    navigation.navigate('Recording');
  }

  const backAndReset = async () => {
    let updatedUser = { ...user, currentPathway: "" } as User;
    setUser(updatedUser);
    navigation.goBack();
  }

  return (
    <LinearGradient
      colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
      style={styles.container}
    >
      <GoBack callback={backAndReset} />

      <View style={styles.featureContainer}>
        <Text style={styles.promptNum}>Prompt #{level}</Text>
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
