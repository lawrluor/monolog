import React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import UserContext from '../context/UserContext';
import VideosContext from '../context/VideosContext';
import { SafeAreaBottom, SafeAreaTop } from '../components/SafeAreaContainer';
import SignInButton from '../components/SignInButton';
import GoForward from '../components/GoForward';
import TutorialImageModal from '../components/TutorialImageModal';
import { FullPageSpinner } from '../components/Spinner';
import PathwayCard from '../components/PathwayCard';
import { getImagesByDeviceSize } from '../utils/images';
import { pathwaysData } from '../utils/pathwaysData';
import { text, spacings, colors, debug } from '../styles';
import { User } from '../types/user';

const Pathways = ({ navigation }: any) => {
  const userContext = React.useContext(UserContext);
  if (!userContext) throw new Error('UserContext must be used wtihin a provider');
  const { user, setUser } = userContext;

  const videosContext = React.useContext(VideosContext);
  if (!videosContext) throw new Error('VideosContext must be used wtihin a provider');
  const { videosCount } = videosContext;

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [tutorialShouldShow, setTutorialShouldShow] = React.useState<boolean>(videosCount < 1);

  const navigateToFullPathway = (pathwayName: string) => {
    navigation.push('PathwayFull', { pathwayName: pathwayName })
  }

  // Set user's current pathway level to 1 if doesn't exist yet
  const getCurrentLevel = (pathwayName: string) => {
    return user?.pathways?.[pathwayName]?.currentLevel || 1;
  }

  const navigateToPrompt = async (pathwayName: string) => {
    let updatedUser = { ...user, ...{ currentPathway: pathwayName } } as User;
    setUser(updatedUser);
    const currentLevel = getCurrentLevel(pathwayName);
    navigation.push('PathwaysPrompt', { pathway: pathwayName, level: currentLevel });
  }

  // Set button text to Begin/Continue pathway based on user's progress
  const beginOrContinue = (pathwayName: string) => {
    const currentLevel = getCurrentLevel(pathwayName);
    return currentLevel > 1 ? "Continue Pathway" : "Begin Pathway";
  }

  const imagesLoaded = () => {
    setIsLoading(false);
  }

  return (
    <TutorialImageModal
      shouldShow={tutorialShouldShow}
      setShouldShow={setTutorialShouldShow}
      imageUri={getImagesByDeviceSize('pathways')}
      onLoadCallback={imagesLoaded}
    >
      {
        tutorialShouldShow && isLoading
          ?
          <FullPageSpinner size="large"></FullPageSpinner>
          :
          <View style={styles.container}>
            <SafeAreaTop />
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
                        <PathwayCard pathwayName={item.name} key={`${item.name}_short`}>
                          <View style={styles.forwardArrow}>
                            <GoForward callback={() => navigateToFullPathway(item.name)} />
                          </View>

                          <Text style={[text.p, styles.featureDescription]}>{item.short_desc}</Text>

                          <View style={styles.navigateButton}>
                            <SignInButton background={colors.HIGHLIGHT}
                              onPress={() => navigateToPrompt(item.name)}
                            >
                              <Text style={text.h4}>{beginOrContinue(item.name)}</Text>
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
