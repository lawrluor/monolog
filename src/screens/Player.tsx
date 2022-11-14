import React from 'react';

import VideoContainer from '../components/VideoContainer';

type Props = {
  isCameraOn: any,
  navigation: any,
  route: any
}

const Player = ({ route, navigation }: Props): JSX.Element => {
  const { video, isCameraOn } = route.params;

  console.log("pika:player:isCameraOn:", isCameraOn);
  return (
    <VideoContainer videoData={video} navigation={navigation}
        showVideo={isCameraOn}/>
  );
}

export default Player;
