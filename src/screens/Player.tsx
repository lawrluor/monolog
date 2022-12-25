import React from 'react';

import VideoContainer from '../components/VideoContainer';

type Props = {
  navigation: any,
  route: any
}

const Player = ({ route, navigation }: Props): JSX.Element => {
  const { video } = route.params;

  return (
    <VideoContainer videoData={video} navigation={navigation} />
  );
}

export default Player;
