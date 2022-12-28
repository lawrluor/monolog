import React from 'react';

import VideosContext from '../context/VideosContext';

import { initVideoDataObject, writeFinalTranscript, generateTranscriptUri } from '../utils/localStorageUtils';

import { FullPageSpinner } from '../components/Spinner';
import UserContext from '../context/UserContext';

const Transcript = ({ route, navigation }: any): JSX.Element => {
  const { finalResult, fileBaseName, isCameraOn } = route.params;
  const { toggleVideosRefresh } = React.useContext(VideosContext);
  // finalResultString contains the full transcript of the video
  // Joins the array of strings into one long string.
  const finalResultString: string = finalResult.join(' ');

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [videoData, setVideoData] = React.useState(null);
  const { user, setUser } = React.useContext(UserContext);

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
      setIsLoading(false);
      writeFinalTranscript(await generateTranscriptUri(fileBaseName), finalResultString);
      toggleVideosRefresh();  // TODO: move this somewhere better
    }

    asyncWrapper();
  }, [])

  // When the user reaches transcript page to increment the scores on their pathways
  const incrementPathwayProgress = () => {
    const MAX_LEVELS = 10
    const pathwayName = user.currentPathway
    const currentPathwayLevel = (pathwayName in user['pathways']) ? user['pathways'][pathwayName]['currentLevel'] : 1
    const timesCompleted = (pathwayName in user['pathways']) ? user['pathways'][pathwayName]['timesCompleted'] : 0
    if ( currentPathwayLevel === MAX_LEVELS ) {
      let updates = {
        pathways: {
          ...user.pathways,
          [pathwayName]: {
            currentLevel: 1,
            timesCompleted: timesCompleted+1
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
    console.log("USER IN TRANSCRIPT", user)
    if (user.currentPathway !== " ") {
      incrementPathwayProgress()
    }
    navigation.navigate('Player', {
      video: videoData,
      navigation: navigation,
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
