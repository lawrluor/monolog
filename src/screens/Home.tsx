import React from 'react';
import { StyleSheet, View, ScrollView, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import VideosContext from '../context/VideosContext';
import UserContext from '../context/UserContext';

import CustomIcon from '../components/CustomIcon';
import Divider from '../components/Divider';
import WordChart from '../components/WordChart';
import MoodChart from '../components/MoodChart';
import NewUserMessage from '../components/NewUserMessage';
import TutorialImageModal from '../components/TutorialImageModal';
import SignInButton from '../components/SignInButton';
import { FullPageSpinner } from '../components/Spinner';
import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';

import { comingSoonAlert, editProfileAlert, simpleAlert } from '../utils/customAlerts';
import { getRecordingPermissions } from '../utils/permissions';
import { INITIAL_USER_DATA } from '../utils/localStorageUtils';

import { containers, icons, text, spacings, colors } from '../styles';
import { getImagesByDeviceSize } from '../utils/images';

const VIDEOS_THRESHOLD = 1;

const Home = ({ navigation }: any): JSX.Element => {
  const { user, setUser } = React.useContext(UserContext);
  const { videosCount, toggleVideosRefresh, isLoading } = React.useContext(VideosContext);

  // Optionally used to allow for closing alert/promo messages in Home
  const [alertVisible, setAlertVisible] = React.useState<boolean>(false);

  // Kind of spaghetti logic for displaying tutorial Images
  // We want to set the initial state to True if using the onCallbackLoad, but initial state to False otherwise
  const [tutorial1ShouldShow, setTutorial1ShouldShow] = React.useState<boolean>(false);
  const [tutorial2ShouldShow, setTutorial2ShouldShow] = React.useState<boolean>(false);
  const [tutorial3ShouldShow, setTutorial3ShouldShow] = React.useState<boolean>(false);
  const [imagesLoading, setImagesLoading] = React.useState<boolean>(true);

  let imagesLoadingState = [true, true, true];

  const navigateToVistas = () => {
    navigation.navigate('Vistas');
  }

  const navigateToRecord = () => {
    navigation.navigate('Recording');
  }

  const navigateToProfile = async () => {
    // When user confirms they want to delete account,
    // we delete the data in userContext, then go back to AuthLoading
    // which handles auth state for us and should display Landing page.
    editProfileAlert(() => {
      setUser(INITIAL_USER_DATA);  // Refresh UserContext
      toggleVideosRefresh(false);  // Refresh VideosContext
      navigation.navigate('AuthLoading');
    });
  }

  const renderPathwaysWidget = (): JSX.Element => {
    return (
      <View style={styles.featureContainer}>
        <Text style={styles.featureTitle}>Pathways</Text>

        <View style={{ marginVertical: spacings.SMALL, alignItems: 'center' }}>
          <SignInButton onPress={() => navigation.navigate('Pathways') } background={colors.HIGHLIGHT}><Text style={text.h4}>View Pathways</Text></SignInButton>
        </View>
      </View>
    )
  }

  // The Vistas summary header is always rendered.
  const renderVistasSummaryHeader = () => {
    return (
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Vistas Summary</Text>

        <Pressable onPress={navigateToVistas} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}, { 'flexDirection': 'row', 'alignItems': 'center' }] }>
          <Text style={text.h4}>See all</Text>
          <Ionicons name='chevron-forward' style={styles.forwardIconWhite} />
        </Pressable>
      </View>
    )
  }

  const renderWordChartSummary = (videosCount: number) => {
    if (videosCount >= VIDEOS_THRESHOLD) {
      return (
        <View style={styles.featureContainer}>
          <WordChart defaultNumOfWords={5} abridged navigation={navigation} />
        </View>
      )
    } else {
      return (
        <Pressable
          onPress={() => simpleAlert("Feature Locked", "Record more logs to begin tracking your Vistas!", "OK", ()=>{})}
          style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }
        >
          <View style={[styles.featureContainer, styles.featureContainerWithIcon]}>
            <Text style={styles.featureTitle}>Frequent Words</Text>
            <Ionicons name='lock-closed' style={styles.lockIcon} />
          </View>
        </Pressable>
      )
    }
  }

  const renderMoodChartSummary = (videosCount: number) => {
    if (videosCount >= VIDEOS_THRESHOLD) {
      return (
        <View style={styles.featureContainer}>
          <MoodChart abridged />
        </View>
      )
    } else {
      return (
        <Pressable
          onPress={() => simpleAlert("Feature Locked", "Record more logs to begin tracking your Vistas!", "OK", ()=>{})}
          style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }
        >
          <View style={[styles.featureContainer, styles.featureContainerWithIcon]}>
            <Text style={styles.featureTitle}>Mood Tracker</Text>
            <Ionicons name='lock-closed' style={styles.lockIcon} />
          </View>
        </Pressable>
      )
    }
  }

  const onImageLoadCallback = (index: number) => {
    imagesLoadingState[index] = false;
    setImagesLoading(imagesLoadingState.some((val: boolean) => val===true));
    // console.log('tutorial1', tutorial1ShouldShow);
    // console.log('imagesLoadingState', imagesLoadingState);
  }

  // Async wrapper for getting permissions
  React.useEffect(() => {
    getRecordingPermissions();
  }, []);

  React.useEffect(() => {
    if (!isLoading) {
      setAlertVisible(videosCount < VIDEOS_THRESHOLD);
    };
  }, [videosCount, isLoading])

  React.useEffect(() => {
    if (!isLoading) {
      setTutorial1ShouldShow(videosCount < VIDEOS_THRESHOLD);
      setTutorial2ShouldShow(videosCount < VIDEOS_THRESHOLD);
      setTutorial3ShouldShow(videosCount < VIDEOS_THRESHOLD);
    }
  }, [isLoading]);


  // There are two TutorialImageModals that appear on the home screen for new users.
  // They each have their separate state for being shown or not shown.
  // TODO: ideally, just have the imageUri as a state and have that update whenever tutorialShouldShow state toggles.
  return (
    <TutorialImageModal shouldShow={tutorial3ShouldShow} setShouldShow={setTutorial3ShouldShow} imageUri={getImagesByDeviceSize('home1')} onLoadCallback={() => onImageLoadCallback(2)}>
    <TutorialImageModal shouldShow={tutorial2ShouldShow} setShouldShow={setTutorial2ShouldShow} imageUri={getImagesByDeviceSize('home2')} onLoadCallback={() => onImageLoadCallback(1)}>
    <TutorialImageModal shouldShow={tutorial1ShouldShow} setShouldShow={setTutorial1ShouldShow} imageUri={getImagesByDeviceSize('home3')} onLoadCallback={() => onImageLoadCallback(0)}>
      {
        imagesLoading && tutorial1ShouldShow
        ?
        <FullPageSpinner size='large'></FullPageSpinner>
        :
        <>
          <SafeAreaTop />

          <SafeAreaBottom>
            <LinearGradient
              colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
              style={styles.container}
            >
              <View style={styles.headerContainer}>
                <View>
                  <Text style={styles.subTitle}>Welcome,</Text>
                  <Text style={styles.profileTitle}>{user?.firstName || "Journaler!"}</Text>
                </View>

                <View>
                  <Pressable onPress={navigateToProfile} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
                    <CustomIcon name='avatar' style={styles.profileIcon} />
                  </Pressable>
                </View>
              </View>

              <View style={{ paddingHorizontal: spacings.HUGE }}>
                <Divider color={colors.BACKGROUND} />
              </View>

              <ScrollView
                style={styles.bodyContainer}
                contentContainerStyle={styles.scrollContentContainerStyle}
                showsVerticalScrollIndicator={false}
              >
                {renderVistasSummaryHeader()}
                {
                  (alertVisible && (videosCount < VIDEOS_THRESHOLD))
                  && <NewUserMessage navigateCallback={navigateToRecord} />
                }
                {renderPathwaysWidget()}
                {renderWordChartSummary(videosCount)}
                {renderMoodChartSummary(videosCount)}

                <Pressable onPress={() => comingSoonAlert(null)} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
                  <View style={[styles.featureContainer, styles.socialContainer]}>
                    <Text style={styles.featureTitle}>Social</Text>
                    <Ionicons name='chevron-forward' style={styles.forwardIconGrey} />
                  </View>
                </Pressable>
              </ScrollView>
            </LinearGradient>
          </SafeAreaBottom>
        </>
      }
    </TutorialImageModal>
    </TutorialImageModal>
    </TutorialImageModal>
  )
}

const styles = StyleSheet.create({
  container: {
    ...containers.DEFAULT,
    backgroundColor: colors.HIGHLIGHT
  },
  headerContainer: {
    flexDirection: 'row',
    padding: spacings.HUGE,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bodyContainer: {
    paddingHorizontal: spacings.HUGE,
  },
  scrollContentContainerStyle: {
    paddingVertical: spacings.HUGE,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: spacings.LARGE
  },
  title: {
    ...text.h2
  },
  subTitle: {
    ...text.h3
  },
  profileTitle: {
    ...text.h2,
    fontFamily: 'Coconat-Regular',
  },
  profileIcon: {
    ...icons.MEDIUM,
    color: colors.BACKGROUND,
  },
  featureContainer: {
    backgroundColor: colors.BACKGROUND,
    borderRadius: 20,
    width: "100%",
    marginBottom: spacings.HUGE,
    padding: spacings.HUGE,
    shadowColor: '#000000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
  },
  featureContainerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  featureTitle: {
    ...text.h4,
    marginBottom: spacings.SMALL,
    color: colors.PRIMARY
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  forwardIconGrey: {
    ...icons.TINY,
    color: colors.SECONDARY
  },
  forwardIconWhite: {
    ...icons.TINY,
    color: colors.BACKGROUND
  },
  lockIcon: {
    ...icons.TINY,
    color: colors.SECONDARY,
  }
})

export default Home;
