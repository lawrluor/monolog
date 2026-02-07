import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

import VideoPlayer from './VideoPlayer';
import VideoOverlay from './VideoOverlay';
import { type Video } from '../types/video';
import { type AppStackParamsList } from '../types/navigation';

type Props = {
  navigation: StackNavigationProp<AppStackParamsList>;
  videoData: Video;
}

// This container holds the VideoPlayer, which is the video itself,
// and the VideoOverlay, which holds additional features and display for the video.
// The VideoOverlay also holds the TranscriptEditor, which manages other state.
const VideoContainer = ({ videoData, navigation }: Props) => {
  // isPlaying: this state is passed to VideoPlayer and is then updated by it,
  // so we can extract the state of video play WITHOUT needing the entire video playback object

  // The isPlaying state is then also read by VideoOverlay,
  // to determine whether to show certain playback controls or the transcript modal.
  const [isPlaying, setIsPlaying] = React.useState<boolean>(true);

  return (
    <>
      <VideoPlayer isPlaying={isPlaying} setIsPlaying={setIsPlaying} videoUri={videoData.uri}
        showVideo={videoData.show_video} />
      <VideoOverlay videoData={videoData} isPlaying={isPlaying} navigation={navigation} />
    </>
  );
}

export default VideoContainer;
