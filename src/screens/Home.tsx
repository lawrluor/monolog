import React from 'react';
import { StyleSheet, View, ScrollView, Text, Pressable } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import DeleteAll from '../components/Delete';  // IN TESTING ONLY
import CustomIcon from '../components/CustomIcon';
import Divider from '../components/Divider';
import WordChart from '../components/WordChart';
import MoodChart from '../components/MoodChart';
import NewUserMessage from '../components/NewUserMessage';
import TutorialImageModal from '../components/TutorialImageModal';

import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';

import { comingSoonAlert, editProfileAlert, simpleAlert } from '../utils/customAlerts';
import { getRecordingPermissions } from '../utils/permissions';

import VideosContext from '../context/VideosContext';
import UserContext from '../context/UserContext';

import { containers, icons, text, spacings, colors } from '../styles';
import { readUserData } from '../utils/localStorageUtils';
import SignInButton from '../components/SignInButton';
import { removeCurrentPathway, updateCurrentPathway } from '../utils/updatePathwaysUser';

const VIDEOS_THRESHOLD = 1;
const TESTING = false;

const Home = ({ navigation }: any): JSX.Element => {
  const { user, setUser } = React.useContext(UserContext);
  const { videosCount, isLoading } = React.useContext(VideosContext);

  // Optionally used to allow for closing alert/promo messages in Home
  const [alertVisible, setAlertVisible] = React.useState<boolean>(false);
  const [tutorial1Shown, setTutorial1Shown] = React.useState<boolean>(videosCount < 1);
  const [tutorial2Shown, setTutorial2Shown] = React.useState<boolean>(videosCount < 1);

  const navigateToVistas = () => {
    navigation.navigate('Vistas');
  }

  const navigateToRecord = () => {
    navigation.navigate('Recording');
  }

  const navigateToProfile = async () => {
    // console.log(await readUserData());

    // When user confirms they want to delete account,
    // we delete the data in userContext, then go back to AuthLoading
    // which handles auth state for us and should display Landing page.
    editProfileAlert(() => {
      setUser({});
      navigation.navigate('AuthLoading')
    });
  }

  const navigateToPathways = async () => {
    navigation.navigate('Pathways');
  }

  const renderVistasSummaryHeader = (videosCount: number) => {
    if (videosCount >= VIDEOS_THRESHOLD) {
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
  }

  const renderWordChartSummary = (videosCount: number) => {
    if (videosCount >= VIDEOS_THRESHOLD) {
      return (
        <View style={[styles.featureContainer]}>
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
        <View style={[styles.featureContainer]}>
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

  // Async wrapper for getting permissions
  React.useEffect(() => {
    getRecordingPermissions();
  }, []);

  React.useEffect(() => {
    if (!isLoading) {
      setAlertVisible(videosCount < VIDEOS_THRESHOLD);
    };
  }, [videosCount, isLoading])

  // There are two TutorialImageModals that appear on the home screen for new users.
  // They each have their separate state for being shown or not shown.
  // TODO: ideally, just have the imageUri as a state and have that update whenever tutorialShown state toggles.
  return (
    <TutorialImageModal shown={tutorial1Shown} setShown={setTutorial1Shown} imageUri={require('../../assets/img/tutorials/home2.jpg')}>
    <TutorialImageModal shown={tutorial2Shown} setShown={setTutorial2Shown} imageUri={require('../../assets/img/tutorials/home3.jpg')}>
      <SafeAreaTop />

      <SafeAreaBottom>
        <LinearGradient
          colors={[colors.HIGHLIGHT, colors.HIGHLIGHT2]}
          style={styles.container}
        >
          <View style={styles.headerContainer}>
            { TESTING ? <DeleteAll /> : null }

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
            {renderVistasSummaryHeader(videosCount)}
            {alertVisible && (videosCount < VIDEOS_THRESHOLD)
              ? <NewUserMessage navigateCallback={navigateToRecord} />
              : null
            }
            {renderWordChartSummary(videosCount)}
            {renderMoodChartSummary(videosCount)}

            <Pressable onPress={() => comingSoonAlert(null)} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
              <View style={[styles.featureContainer, styles.socialContainer]}>
                <Text style={styles.featureTitle}>Social</Text>
                <Ionicons name='chevron-forward' style={styles.forwardIconGrey} />
              </View>
            </Pressable>
<<<<<<< HEAD

            <View style={[styles.featureContainer]}>
              <SignInButton
                background={colors.HIGHLIGHT}
                onPress={navigateToPathways}
              >
                <Text>PATHWAYS</Text>
              </SignInButton>
            </View>
=======
>>>>>>> a69175b (Pathways2 (#49))
          </ScrollView>
        </LinearGradient>
      </SafeAreaBottom>
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
    color: colors.PRIMARY
  },
  forwardIconWhite: {
    ...icons.TINY,
    color: colors.BACKGROUND
  },
  lockIcon: {
    ...icons.TINY,
    color: colors.PRIMARY,
  }
})

export default Home;
