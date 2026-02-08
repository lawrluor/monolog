import React from 'react';

import VideoContainer from '../components/VideoContainer';
import { type StackNavigationProp } from '@react-navigation/stack';
import { type RouteProp } from '@react-navigation/native';
import { type AppStackParamsList } from '../types/navigation';

type Props = {
  navigation: StackNavigationProp<AppStackParamsList>;
  route: RouteProp<AppStackParamsList, 'Player'>;
}

const Player = ({ route, navigation }: Props) => {
  const { video } = route.params;

  return (
    <VideoContainer videoData={video} navigation={navigation} />
  );
}

export default Player;
