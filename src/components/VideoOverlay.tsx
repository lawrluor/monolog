import React from 'react';
import { StyleSheet, ScrollView, View, Pressable, Text, TextInput, Platform } from 'react-native';

import TranscriptEditor from './TranscriptEditor';
import VideoCaption from './VideoCaption';
import CustomIcon from './CustomIcon';
import GoBack from './GoBack';

import { Ionicons } from '@expo/vector-icons';

import { getBaseFileSystemUri } from '../utils/localStorageUtils';

import { icons, spacings, text } from '../styles';
import { getCurrentDate } from '../utils/dates';

type Props = {
  videoData: any,
  isPlaying: boolean,
  navigation: any
}

// This component is comprised of the buttons, rating, and show transcript button
// These are absolute positioned towards the bottom of the screen
const VideoOverlay = ({ videoData, isPlaying, navigation }: Props): JSX.Element => {
  const [modalShown, setModalShown] = React.useState(false);
  
  let videoUri = videoData.uri;
  let fileTimestamp = videoUri.substring(videoUri.length - 14, videoUri.length - 4);  
  let transcriptUri = getBaseFileSystemUri() + `transcripts/${fileTimestamp}.txt`;

  // Displays a button that can be clicked to reveal the entire transcript text 
  const renderShowTranscriptButton = () => {
    return (
      <View style={styles.button}>
        <Pressable onPress={() => setModalShown(!modalShown)} style={({pressed}) => [{opacity: pressed ? 0.3 : 1}]}>
          <CustomIcon name={'transcript'} style={styles.iconActions} />
        </Pressable>
      </View>
    )
  }

  // Not currently displaying captions
  const renderCaption = () => {
    return (
      !modalShown 
      ?
      <View style={styles.contentContainer}>
        <VideoCaption text={videoData.caption} />
      </View>
      :
      <></>
    )
  }

  const renderButtonsContainer = () => {
    return (
      <View style={styles.buttonsContainer}>
        {renderShowTranscriptButton()}

        <View style={styles.button}>
          <View style={styles.iconBackground}>
            <Pressable onPress={() => navigation.navigate('Gallery')} style={({pressed}) => [{opacity: pressed ? 0.3 : 1}]}>
              <CustomIcon name='check_circle' style={styles.iconFinished} />
            </Pressable>
          </View>
        </View>

        <View style={styles.button}>
          <Text style={styles.emojiText}>{videoData.rating.substring(0, 2) || '❔'}</Text>
        </View>
      </View>
    )
  }

  // Do not show video overlay controls when TranscriptEditor modal is visible
  // This conditional render is handled by the boolean state modalShown
  return (
    <>
      {modalShown ? <></> : <GoBack navigation={navigation} /> }
      <View style={styles.videoContainer}>

        {/* TODO: Send full populated videoData object with transcript + rating? */}
        <View style={styles.videoOverlayContainer}>
          {/* {renderCaption()} */}
          {isPlaying ? null : <Ionicons style={styles.iconPlayStatus} name={'pause-circle-outline'}/>}
          {modalShown ? <></> : renderButtonsContainer()}
        </View>
      </View>

      {/* TODO: Store video date as MM/DD/YYYY in the video storage */}
      {/* TODO: Give option for date type for personalization */}

      <TranscriptEditor 
        modalShown={modalShown}
        setModalShown={setModalShown}
        textContent={videoData.transcript_content}
        transcriptUri={transcriptUri} 
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
  }
});


export default VideoOverlay;
