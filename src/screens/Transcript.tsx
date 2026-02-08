import React from 'react';
import { type RouteProp } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';

import VideosContext from '../context/VideosContext';
import { FullPageSpinner } from '../components/Spinner';
import UserContext from '../context/UserContext';
import { initVideoDataObject, writeFinalTranscript, generateTranscriptUri } from '../utils/localStorageUtils';
import { type AppStackParamsList } from '../types/navigation';
import { type Video } from '../types/video';

type Props = {
  route: RouteProp<AppStackParamsList, 'Transcript'>;
  navigation: StackNavigationProp<AppStackParamsList>;
}

const Transcript = ({ route, navigation }: Props) => {
  const { finalResult, fileBaseName, isCameraOn } = route.params;

  const userContext = React.useContext(UserContext);
  if (!userContext) throw new Error('UserContext must be used within a provider');
  const { user, setUser } = userContext;

  const videosContext = React.useContext(VideosContext);
  if (!videosContext) throw new Error('VideosContext must be used within a provider');
  const { toggleVideosRefresh } = videosContext;

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [videoData, setVideoData] = React.useState<Video | null>(null);

  // Doesn't contain our final data, yet but shares the same name when passed to VideoContainer
  // For fully processed logs, videoData will include: transcript_uri, thumbnail_uri, etc.
  // let videoData = {
  //   'uri': videoStorePath,
  //   'transcript_content': finalResult,
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
      queriedVideoData['transcript_content'] = finalResult;
      setVideoData(queriedVideoData);
      setIsLoading(false);
      writeFinalTranscript(await generateTranscriptUri(fileBaseName), finalResult);
      toggleVideosRefresh();  // TODO: move this somewhere better
    }

    asyncWrapper();
  }, [])

  // When the user reaches transcript page to increment the scores on their pathways
  const incrementPathwayProgress = () => {
    const MAX_LEVELS = 10 // Maximum number of prompts a pathway may have
    const pathwayName = user?.currentPathway;
    if (!pathwayName) return;

    // If the user has already started the pathway, set their level, otherwise set their level to 1
    const currentPathwayLevel = user?.pathways[pathwayName]?.currentLevel || 1;
    const timesCompleted = user?.pathways[pathwayName]?.timesCompleted || 0;
    if (currentPathwayLevel === MAX_LEVELS) {
      let updates = {
        pathways: {
          ...user.pathways,
          [pathwayName]: {
            currentLevel: 1,
            timesCompleted: timesCompleted + 1
          }
        },
        // Reset current pathway so that if a user records a non pathway prompt
        // it does not increment the previous pathway
        currentPathway: " "
      }
      let updatedUser = { ...user, ...updates };
      setUser(updatedUser)
      return
    }
    let updates = {
      pathways: {
        ...user.pathways,
        [pathwayName]: {
          currentLevel: currentPathwayLevel + 1,
          timesCompleted: timesCompleted
        }
      },
      // Reset current pathway so that if a user records a non pathway prompt
      // it does not increment the previous pathway
      currentPathway: " "
    }
    let updatedUser = { ...user, ...updates };
    setUser(updatedUser)
  }

  const navigateToPlayer = () => {
    // TODO: increment their score for that pathway if there is one
    if (user?.currentPathway !== " ") {
      incrementPathwayProgress()
    }

    if (!videoData) return;

    navigation.navigate('Player', {
      video: videoData,
      showVideo: isCameraOn
    });
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
