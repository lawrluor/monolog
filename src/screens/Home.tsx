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

import { SafeAreaTop, SafeAreaBottom } from '../components/SafeAreaContainer';

import { comingSoonAlert, simpleAlert } from '../utils/customAlerts';
import { getRecordingPermissions } from '../utils/permissions';

import VideosContext from '../context/VideosContext';
import UserContext from '../context/UserContext';

import { containers, icons, text, spacings, colors, dimensions } from '../styles';
import { readUserData } from '../utils/localStorageUtils';
import SignInButton from '../components/SignInButton';
import { TutorialHighlightModal } from '../components/FullScreenModal';

const VIDEOS_THRESHOLD = 1;
const TESTING = false;

const Home = ({ navigation }: any): JSX.Element => {
  const { user } = React.useContext(UserContext);
  const { videosCount, isLoading } = React.useContext(VideosContext);

  // Optionally used to allow for closing alert/promo messages in Home
  const [alertVisible, setAlertVisible] = React.useState<boolean>(false);
  const [pathwaysTutorial, setPathwaysTutorial] = React.useState<boolean>(true);
  const [XYoffset, setXYoffset] = React.useState();

  const navigateToVistas = () => {
    navigation.navigate('Vistas');
  }

  const navigateToRecord = () => {
    navigation.navigate('Recording');
  }

  const navigateToProfile = async () => {
    console.log(await readUserData());
    comingSoonAlert(() => {
      console.log("uploading picture...");
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

  // Renders the Pathways feature container
  const renderPathways = () => {
    return (
      <View
        onLayout={event => handleLayoutChange(event)}
      >
        {
          // TODO: this check should be based on if they've started pathways or not.
          // Two different styles of components will be returned based on this.
          true
          ?
          <NewUserMessage navigateCallback={navigateToPathways} message="You haven't started any pathways. Click below to get started!" actionMessage="View Pathways" />
          :
          <View style={[styles.featureContainer, { alignItems: 'center' }]}>
            <SignInButton
              background={colors.HIGHLIGHT}
              onPress={() => navigateToPathways() }
            >
              <Text style={[styles.featureTitle, { color: 'white' }]}>View Pathways</Text>
            </SignInButton>
          </View>
        }
      </View>
    )
  }

  // Measures the dimensions and positioning of a component after it is rendered on the screen
  // This information is passed to TutorialHighlightModal, which allows us to position something
  // https://stackoverflow.com/a/64882955
  const handleLayoutChange = (event: any) => {
    return event.target.measure((fx, fy, width, height, px, py) => {
      console.log('Component width is: ' + width);
      console.log('Component height is: ' + height);
      console.log('X offset to page: ' + px);
      console.log('Y offset to page: ' + py);
      setXYoffset({ 'x': px, 'y': py });
      return { 'x': px, 'y': py };
    })
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

  // My belief is this reduces the number of calls to renderPathways()
  // as I'm passing this component itself by reference to the TutorialHighlightModal
  // but this probably doesn't actually do anything.
  const pathwaysComponent = renderPathways();

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
              <Text style={styles.profileTitle}>{user.firstName || "Journaler!"}</Text>
            </View>

            <View>
              <Pressable onPress={navigateToProfile} style={ ({pressed}) => [{opacity: pressed ? 0.3 : 1}] }>
                <CustomIcon name='avatar' style={styles.profileIcon} />
              </Pressable>
            </View>
          </View>

          <View style={{ paddingHorizontal: spacings.HUGE,  zIndex: 3, elevation: 3}}>
            <Divider color={colors.BACKGROUND} />
          </View>

          <ScrollView
            style={styles.bodyContainer}
            contentContainerStyle={styles.scrollContentContainerStyle}
            showsVerticalScrollIndicator={false}
          >
            {pathwaysComponent}
            {renderVistasSummaryHeader(videosCount)}
            {alertVisible && (videosCount < VIDEOS_THRESHOLD)
              ? <NewUserMessage
                  navigateCallback={navigateToRecord}
                  message={"Your vistas will appear after your first log. Press the button below to get started!"}
                  actionMessage={"Record"}
                />
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

      {pathwaysTutorial && <TutorialHighlightModal XYoffset={XYoffset}>{pathwaysComponent}</TutorialHighlightModal>}
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
