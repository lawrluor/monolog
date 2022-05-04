import React from 'react';
import { StyleSheet } from 'react-native';

import { text, spacings, icons, dimensions } from '../styles';

import VideoContainer from '../components/VideoContainer';
import { getCurrentDate } from '../utils/dates';

const Transcript = ({ route, navigation }): JSX.Element => {
  const { finalResult, selection, videoStorePath } = route.params;

  // finalResultString contains the full transcript of the video
  // Joins the array of strings into one long string.
  const finalResultString = finalResult.join(' ')

  // Doesn't contain our final data, yet but shares the same name when passed to VideoContainer 
  // For fully processed logs, videoData will include: transcript_uri, thumbnail_uri, etc.
  let videoData = { 
    'uri': videoStorePath,
    'transcript_content': finalResultString,
    'rating': selection,
    'date': getCurrentDate()
 }

  return (
    <VideoContainer videoData={videoData} navigation={navigation} />
  )
}

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
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
    // justifyContent: 'center',
  },
  textContainer: {
    padding: spacings.MEDIUM,
    paddingTop: 150,
    position: 'absolute',
    height: dimensions.height * 0.7
  },
  text: {
    zIndex: 100
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
  subTitle: {
    ...text.h4,
    color: 'white',
    marginBottom: spacings.SMALL
  },
  body: {
    ...text.p,
    color: 'white',
    zIndex: 0
  },
  emojiText: {
    fontSize: text.h1.fontSize + 10,
    // padding: spacings.MEDIUM
  },
  modalDown: {
    alignSelf: 'center',
  },
  button: {
    margin: spacings.MEDIUM
  },
  iconFinished: {
    ...icons.HUGE,
    color: 'white',
    marginHorizontal: -1 * spacings.TINY
  },
  iconActions: {
    ...icons.LARGE,
    color: 'white'
  }
});

export default Transcript;
