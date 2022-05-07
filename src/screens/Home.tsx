import React from 'react';
import { StyleSheet, View, ScrollView, Text, Pressable } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

import DeleteAll from '../components/Delete';  // IN TESTING ONLY
import CustomIcon from '../components/CustomIcon';
import Divider from '../components/Divider';
import WordChart from '../components/WordChart';
import MoodChart from '../components/MoodChart';
import NewUserMessage from '../components/NewUserMessage';
import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';

import { comingSoonAlert, simpleAlert } from '../utils/customAlerts';
import { readUserData } from '../utils/localStorageUtils';
import { getRecordingPermissions } from '../utils/permissions';

import VideosContext from '../context/VideosContext';

import { containers, icons, text, spacings, colors } from '../styles';

const VIDEOS_THRESHOLD = 1;
const TESTING = false;

const Home = ({ navigation }: any): JSX.Element => {
  const { userData, setUserData, videosCount, isLoading } = React.useContext(VideosContext);

  // Optionally used to allow for closing alert/promo messages in Home
  const [alertVisible, setAlertVisible] = React.useState<boolean>(false);

  const navigateToVistas = () => {
    navigation.navigate('Vistas');
  }

  const navigateToRecord = () => {
    navigation.navigate('Recording');
  }

  const navigateToProfile = () => {
    comingSoonAlert(() => {
      console.log("uploading picture...");
    });
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
          <WordChart numOfWords={5} />
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
          <MoodChart />
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

  // Async wrapper for getting user data
  // Because Home is the initial landing screen on AppStack, we get userData here
  // We cannot get userData any earlier than this Home component as currently,
  // the VideosContext Provider only exists on AppStack, not around the entire navigator.
  // TODO: refactor out User context to have larger scope (around entire navigator/app)
  React.useEffect(() => {
    const getUserData = async () => {
      let data = await readUserData();
      setUserData(data);
    }

    // Set up app
    getUserData();
    getRecordingPermissions();
  }, []);

  React.useEffect(() => {
    if (!isLoading) {
      setAlertVisible(videosCount < VIDEOS_THRESHOLD);
    };
  }, [videosCount, isLoading])

  return (
    <>
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
              <Text style={styles.profileTitle}>{userData.firstName || "Journaler!"}</Text>
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

            <Pressable onPress={() => comingSoonAlert(()=>{})} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
              <View style={[styles.featureContainer, styles.socialContainer]}>
                <Text style={styles.featureTitle}>Social</Text>
                <Ionicons name='chevron-forward' style={styles.forwardIconGrey} />
              </View>
            </Pressable>
          </ScrollView>
        </LinearGradient>
      </SafeAreaBottom>
    </>
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
