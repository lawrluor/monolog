import React from 'react';

import VideoContainer from '../components/VideoContainer';

type Props = {
  showVideo: any,
  navigation: any,
  route: any
}

const Player = ({ route, navigation }: Props): JSX.Element => {
  const { video, showVideo } = route.params;

  console.log("pika:player:showVideo:", showVideo);
  return (
    <VideoContainer videoData={video} navigation={navigation}
        showVideo={showVideo}/>
  );
}

export default Player;
