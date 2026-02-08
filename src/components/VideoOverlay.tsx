import React from 'react';
import { StyleSheet, View, Pressable, Text, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { DeleteVideoLog } from './Delete';
import TranscriptEditor from './TranscriptEditor';
import VideoCaption from './VideoCaption';
import CustomIcon from './CustomIcon';
import GoBack from './GoBack';

import VideosContext from '../context/VideosContext';

import { deleteVideoLog } from '../utils/localStorageUtils';
import { getCurrentDate } from '../utils/dates';
import { getLastRoute } from '../utils/navigationUtils';

import { icons, spacings, text } from '../styles';
import { AppStackParamsList } from '../types/navigation';

type Props = {
  videoData: any,
  isPlaying: boolean,
  navigation: StackNavigationProp<AppStackParamsList>,
}

// This component is comprised of the buttons, rating, and show transcript button
// These are absolute positioned towards the bottom of the screen
const VideoOverlay = ({ videoData, isPlaying, navigation }: Props) => {
  const videosContext = React.useContext(VideosContext);
  if (!videosContext) throw new Error("VideosContext must be used within provider");
  const { toggleVideosRefresh } = videosContext;

  const [modalShown, setModalShown] = React.useState<boolean>(false);

  const deleteLogCallback = () => {
    Alert.alert(
      "Warning",
      "This will delete the current video log and all its data. Are you sure you want to do this?",
      [
        { text: "Continue", style: 'destructive', onPress: deleteLog },
        { text: "Cancel" }
      ]
    )
  }

  const deleteLog = async () => {
    if (await deleteVideoLog(videoData.baseName)) {
      toggleVideosRefresh();
      navigation.reset({
        index: 0,
        routes: [{ name: 'TabNavigator', params: { screen: 'Home' } }]
      });

      Alert.alert(
        "Success",
        "Your video log was deleted.",
        [
          { text: "OK" }
        ]
      )
    } else {
      Alert.alert(
        "Error",
        "Could not delete this video log.",
        [
          { text: "OK" }
        ]
      )
    }
  }

  // Displays a button that can be clicked to reveal the entire transcript text
  const renderShowTranscriptButton = () => {
    return (
      <View style={styles.button}>
        <Pressable onPress={() => setModalShown(!modalShown)} hitSlop={spacings.hitSlopLarge} style={({ pressed }) => [{ opacity: pressed ? 0.3 : 1 }]}>
          <CustomIcon name={'open_transcript'} style={styles.iconActions} />
        </Pressable>
      </View>
    )
  }

  // Not currently displaying captions
  const renderCaption = () => {
    return (
      !modalShown
      &&
      <View style={styles.contentContainer}>
        <VideoCaption text={videoData.caption} />
      </View>
    )
  }

  const changeRating = () => {
    Alert.alert(
      "Coming Soon",
      "In new versions of Monist, you'll be able to change the rating & emoji that you previously had chosen.",
      [
        { text: "OK" }
      ]
    )
  }

  const renderRating = () => {
    return <Text style={styles.emojiText}>{videoData.rating.substring(0, 2) || '❔'}</Text>

    // In the future, use Pressable to allow us to press to change the Rating emoji
    return (
      <Pressable onPress={changeRating} hitSlop={spacings.hitSlopLarge} style={({ pressed }) => [{ opacity: pressed ? 0.3 : 1 }]}>
        <Text style={styles.emojiText}>{videoData.rating.substring(0, 2) || '❔'}</Text>
      </Pressable>
    )
  }

  const renderButtonsContainer = () => {
    return (
      <View style={styles.buttonsContainer}>
        {renderShowTranscriptButton()}

        <View style={styles.button}>
          <View>
            <Pressable onPress={() => navigation.navigate('TabNavigator', { screen: 'Gallery' })} hitSlop={spacings.hitSlopLarge} style={({ pressed }) => [{ opacity: pressed ? 0.3 : 1 }]}>
              <CustomIcon name='check_circle' style={styles.iconFinished} />
            </Pressable>
          </View>
        </View>

        <View style={styles.button}>
          {renderRating()}
        </View>
      </View>
    )
  }

  // If navigating after making new recording (stack is: Rating -> Transcript -> Player),
  // must pop twice to get back to Rating
  // Otherwise if navigating from Gallery/other, pop once (stack is: Gallery -> Player)
  // Yes, this is spaghetti code because VideoOverlay is used in both the above cases
  const resetNavigation = async () => {
    let routes = await getLastRoute({ navigation }, 2);

    if (routes?.name === 'Rating') {
      // Two routes ago we were at Rating; skip the Player route
      navigation.goBack();
      navigation.goBack();
    } else {
      // One route ago we were at TabNavigator/Gallery
      navigation.goBack();  // simply go back as usual
    }
  }

  // Do not show video overlay controls when TranscriptEditor modal is visible
  // This conditional render is handled by the boolean state modalShown
  return (
    <>
      {!modalShown && <GoBack callback={resetNavigation} />}
      {!modalShown && <View style={styles.deleteLogContainer}><DeleteVideoLog callback={deleteLogCallback} /></View>}

      <View style={styles.videoContainer}>

        {/* TODO: Send full populated videoData object with transcript + rating? */}
        <View style={styles.videoOverlayContainer}>
          {/* {renderCaption()} */}
          {!isPlaying && <Ionicons style={styles.iconPlayStatus} name={'pause-circle-outline'} />}
          {!modalShown && renderButtonsContainer()}
        </View>
      </View>

      {/* TODO: Store video date as MM/DD/YYYY in the video storage */}
      {/* TODO: Give option for date type for personalization */}

      <TranscriptEditor
        modalShown={modalShown}
        setModalShown={setModalShown}
        textContentFromRecording={videoData.transcript_content}
        transcriptUri={videoData.transcript_uri}
        date={videoData.date || getCurrentDate()}
      />
    </>
  )
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacings.MEDIUM,
  },
  videoOverlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  contentContainer: {
    position: 'absolute',
    bottom: spacings.ABSOLUTE_OFFSET_HUGE,
  },
  buttonsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    bottom: spacings.ABSOLUTE_OFFSET_LARGE,
  },
  emojiContainer: {
    zIndex: 10,
    bottom: spacings.LARGE,
  },
  emojiText: {
    fontSize: text.h1.fontSize - 7,
    // padding: spacings.MEDIUM
  },
  button: {
    margin: spacings.MEDIUM
  },
  iconPlayStatus: {
    ...icons.LARGE,
    color: 'white',
    opacity: 0.6
  },
  iconFinished: {
    ...icons.LARGE,
    color: 'white',
    marginHorizontal: -1 * spacings.TINY
  },
  iconActions: {
    ...icons.MEDIUM,
    color: 'white'
  },
  deleteLogContainer: {
    position: 'absolute',
    // Matches spacings in GoBack component
    right: spacings.MASSIVE,
    top: spacings.ABSOLUTE_OFFSET_MEDIUM,
  }
});


export default VideoOverlay;
