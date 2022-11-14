import React from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';

import { dimensions, spacings } from '../styles';

// TODO: How to define navigation?
type Props = {
  navigation: any,
  video: any
}

const Thumbnail = ({ navigation, video }: Props): JSX.Element => {
  const navigateToPlayer = () => {
    navigation.navigate('Player', {
      video: video,
      navigation: navigation,
      showVideo: "true"  // TODO(ryanluo): update this to read from storage.
    });
  }

  return (
    <Pressable onPress={navigateToPlayer}>
      <Image source={{ uri: video.thumbnail_uri }} style={styles.thumbnail} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  thumbnail: {
    width: dimensions.width / 3,
    aspectRatio: 1,  // TODO: Thumbnails saved as squares, meaning if we want rectangles, stretch occurs
    flexWrap: 'nowrap',
    margin: spacings.TINY - 1
  }
});

export default Thumbnail;
