import React from 'react';
import { StyleSheet, Image, Pressable, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { dimensions, icons, spacings } from '../styles';
import CustomIcon from '../components/CustomIcon';
import { type AppStackParamsList } from '../types/navigation';
import { type Video } from '../types/video';

type Props = {
  navigation: StackNavigationProp<AppStackParamsList>,
  video: Video
}

const Thumbnail = ({ navigation, video }: Props) => {
  const navigateToPlayer = () => {
    navigation.navigate('Player', {
      video,
    });
  }

  // Renders thumbnail or camera_off depending on whether the entry was recorded
  // with or without the camera active.
  const renderThumbnailImage = () => {
    return (
      video.show_video
        ?
        <Image source={{ uri: (video).thumbnail_uri }} style={styles.thumbnail} />
        :
        <View style={styles.camera_off_container} >
          <CustomIcon name='headphones_with_waves' size={icons.LARGE.fontSize} />
        </View>
    )
  }

  return (
    <Pressable onPress={navigateToPlayer}>
      {renderThumbnailImage()}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  thumbnail: {
    width: dimensions.width / 3,
    aspectRatio: 1,  // TODO: Thumbnails saved as squares, meaning if we want rectangles, stretch occurs
    flexWrap: 'nowrap',
    margin: spacings.TINY - 1
  },
  camera_off_container: {
    width: dimensions.width / 3,
    height: dimensions.width / 3,  // Thumbnails are squares.
    flexWrap: 'nowrap',
    margin: spacings.TINY - 1,
    alignItems: 'center',  // X-Axis
    justifyContent: 'center',  // Y-Axis
  },
});

export default Thumbnail;
