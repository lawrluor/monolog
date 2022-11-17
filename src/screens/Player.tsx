import React from 'react';

import VideoContainer from '../components/VideoContainer';

type Props = {
  showVideo: boolean,
  navigation: any,
  route: any
}

const Player = ({ route, navigation }: Props): JSX.Element => {
  const { video, showVideo } = route.params;

  return (
    <VideoContainer videoData={video} navigation={navigation}
        showVideo={showVideo}/>
  );
}

export default Player;
