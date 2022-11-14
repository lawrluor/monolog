import React from 'react';

import VideosContext from '../context/VideosContext';

import { Audio } from 'expo-av';

import { initVideoDataObject, writeFinalTranscript, generateTranscriptUri, checkFileExists } from '../utils/localStorageUtils';

import { FullPageSpinner } from '../components/Spinner';

const Transcript = ({ route, navigation }: any): JSX.Element => {
  const { finalResult, selection, fileBaseName } = route.params;
  const { toggleVideosRefresh } = React.useContext(VideosContext);
  // TODO(ryanluo): Remove when we handle Audio File handling.
  const { videoExists, setVideoExists } = React.useState<boolean>(null);

  // finalResultString contains the full transcript of the video
  // Joins the array of strings into one long string.
  const finalResultString: string = finalResult.join(' ');

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [videoData, setVideoData] = React.useState(null);

  // Doesn't contain our final data, yet but shares the same name when passed to VideoContainer
  // For fully processed logs, videoData will include: transcript_uri, thumbnail_uri, etc.
  // let videoData = {
  //   'uri': videoStorePath,
  //   'transcript_content': finalResultString,
  //   'rating': selection,
  //   'date': getCurrentDate()
  // }

  // Ensure that videoData is properly initialized before moving to final screens,
  // which includes the final transcript, rating, and more
  React.useEffect(() => {
    const asyncWrapper = async () => {
      // queries videoData object from local DB, that has saved attributes from previous screens
      // such as rating file, video file name, etc.
      // It will not find a saved transcript yet, as one does not exist yet
      // So, we add the final transcript after getting the mostly finished videoData object.
      let queriedVideoData = await initVideoDataObject(fileBaseName);
      queriedVideoData['transcript_content'] = finalResultString;
      setVideoData(queriedVideoData);
      setVideoExists(checkFileExists(queriedVideoData.uri));
      setIsLoading(false);
      writeFinalTranscript(await generateTranscriptUri(fileBaseName), finalResultString);
      toggleVideosRefresh();  // TODO: move this somewhere better
    }

    asyncWrapper();
  }, [])

  const navigateToPlayer = () => {
    if (videoExists) {
      navigation.navigate('Player', {
        video: videoData,
        navigation: navigation
      });
    } else {
      // TODO(ryanluo): fix navigation after we create a view for audio-only.
      navigation.navigate('Gallery');
    }
  }

  // Once loaded successfully, immediately navigate to Player with params for the loaded videoData
  React.useEffect(() => {
    if (!isLoading) {
      navigateToPlayer();
    }
  }, [isLoading])

  return (
    <FullPageSpinner size="large" />
  )
}

export default Transcript;
