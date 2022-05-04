import React from 'react';

import VideoPlayer from './VideoPlayer';
import VideoOverlay from './VideoOverlay';
import GoBack from '../components/GoBack';

type Props = {
  navigation: any,
  videoData: any
}

// This container holds the VideoPlayer, which is the video itself,
// and the VideoOverlay, which holds additional features and display for the video.
// The VideoOverlay also holds the TranscriptEditor, which manages other state.
const VideoContainer = ({ videoData, navigation }: Props): JSX.Element => { 
  // isPlaying: this state is passed to VideoPlayer and is then updated by it,
  // so we can extract the state of video play WITHOUT needing the entire video playback object
  
  // The isPlaying state is then also read by VideoOverlay, 
  // to determine whether to show certain playback controls or the transcript modal.
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);
    
  return (
    <>
      <VideoPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} videoUri={videoData.uri} navigation={navigation} />
      <VideoOverlay videoData={videoData} isPlaying={isPlaying} navigation={navigation} />
    </>
  );
}

export default VideoContainer;