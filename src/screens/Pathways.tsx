import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import UserContext from '../context/UserContext';

import { pathwaysData } from '../utils/pathwaysData';

import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';
import SignInButton from '../components/SignInButton';
import GoForward from '../components/GoForward';
import TutorialImageModal from '../components/TutorialImageModal';
import { FullPageSpinner } from '../components/Spinner';
import PathwayCard from '../components/PathwayCard';

import { text, spacings, colors, debug } from '../styles';

const Pathways = ({ navigation }: any): JSX.Element => {
  const { user, setUser } = React.useContext(UserContext);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [tutorialShown, setTutorialShown] = React.useState<boolean>(false);

  const navigateToFullPathway = (pathwayName: string) => {
    navigation.push('PathwayFull', { pathwayName: pathwayName })
  }

  // If the user has already started the pathway, set their level, otherwise set their level to 1
  const getCurrentLevel = (pathwayName: string): number => {
    if (user?.pathways && pathwayName in user.pathways) {
      return user?.pathways[pathwayName]['currentLevel'];
    } else {
      return 1;
    }
  }

  const navigateToPrompt = async (pathwayName: string) => {
    let updatedUser = { ...user, ...{ currentPathway: pathwayName } };
    setUser(updatedUser);
    const currentLevel = getCurrentLevel(pathwayName);
    navigation.push('PathwaysPrompt', { pathway: pathwayName, level: currentLevel});
  }

  // Set button text to Begin/Continue pathway based on user's progress
  const beginOrContinue = (pathwayName: string) => {
    const currentLevel = getCurrentLevel(pathwayName);
    return currentLevel > 1 ? "Continue Pathway" : "Begin Pathway";
  }

  return (
    <TutorialImageModal
      shouldShow={tutorialShown}
      setShouldShow={setTutorialShown}
      imageUri={require('../../assets/img/tutorials/pathways.jpg')}
      onLoadCallback={() => setIsLoading(false)}
    >
      {
        isLoading
        ?
        <FullPageSpinner></FullPageSpinner>
        :
        <View style={styles.container}>
          <SafeAreaTop/>
          <SafeAreaBottom transparent>
            <LinearGradient
              colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
              style={styles.container}
            >
              <ScrollView
                style={styles.bodyContainer}
                contentContainerStyle={styles.scrollContentContainerStyle}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.headerContainer}>
                  <Text style={styles.title}>Current Pathways</Text>
                </View>

                {
                  pathwaysData.map((item) => {
                    return (
                      <PathwayCard pathwayName={item.name} key={`${item.name}_short`} getCurrentLevel={getCurrentLevel}>
                        <View style={styles.forwardArrow}>
                          <GoForward callback={() => { navigateToFullPathway(item.name) }} />
                        </View>
                        <Text style={[text.p, styles.featureDescription]}>
                          {item.short_desc}
                        </Text>
                        <View style={ styles.navigateButton }>
                          <SignInButton background={colors.HIGHLIGHT}
                            onPress={() => navigateToPrompt(item.name)}
                          >
                            <Text style={text.h4}> {beginOrContinue(item.name)} </Text>
                          </SignInButton>
                        </View>
                      </PathwayCard>
                    )
                  })
                }
              </ScrollView>
            </LinearGradient>
          </SafeAreaBottom>
        </View>
      }
    </TutorialImageModal>
  )
}

const styles = StyleSheet.create({
  // Doesn't use the default container, as that adds a bottom block
  container: {
    flex: 1,
  },
  featureDescription: {
    margin: spacings.HUGE,
    color: colors.SECONDARY,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingVertical: spacings.HUGE,
    // paddingHorizontal: spacings.MEDIUM,
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  // This container size is dependent on the size of the brandImage below
  // This ensures that the image does not overflow the container
  // A padding on the brandHeader ensures adequate vertical spacing no matter the image size
  bodyContainer: {
    paddingHorizontal: spacings.HUGE,
  },
  scrollContentContainerStyle: {
    paddingVertical: spacings.HUGE,
  },
  headerRightIconContainer: {
    ...debug,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...text.h2,
  },
  hidden: {
    display: 'none',
  },
  unhidden: {
    display: 'flex'
  },
  navigateButton: {
    alignSelf: 'center',
  },
  forwardArrow: {
    position: 'absolute',
    bottom: '122.5%',
    left: '78%',
  },
});

export default Pathways;
