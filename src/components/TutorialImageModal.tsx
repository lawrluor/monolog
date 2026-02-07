import React from 'react';
import { Pressable, Image, StyleSheet, type ImageSourcePropType } from 'react-native';

import { dimensions } from '../styles';

type Props = {
  children: React.ReactNode;
  shouldShow: boolean;
  setShouldShow: React.Dispatch<React.SetStateAction<boolean>>;
  imageUri: ImageSourcePropType;
  onLoadCallback?: () => void;
}

// Always render this on top of other elements, hence zIndex style
const TutorialImageModal = ({ children, shouldShow, setShouldShow, imageUri, onLoadCallback }: Props) => {
  // If we care about image loading speed, the parent component passes a callback to be
  // called after the image finishes loading, which will update the parent component's loading state

  // NOTE: We are not using traditional conditional rendering here and instead toggling display style
  // This is because the image onLoad callback only works if the <Image> component is actually rendered
  // This way, the image is still rendered but simply does not display, allowing the onLoad callback to fire
  // and thereby changing the isLoading state in its parent component.
  if (onLoadCallback) {
    return (
      <>
        <Pressable style={{ zIndex: 999, display: shouldShow ? 'flex' : 'none' }} onPress={() => setShouldShow(!shouldShow)}>
          <Image style={styles.tutorialImage} source={imageUri} onLoad={onLoadCallback} />
        </Pressable>

        {children}
      </>
    )
  } else {
    return (
      <>
        {shouldShow &&
          <Pressable style={{ zIndex: 999 }} onPress={() => setShouldShow(!shouldShow)}>
            <Image style={styles.tutorialImage} source={imageUri} />
          </Pressable>
        }

        {children}
      </>
    )
  }
}

const styles = StyleSheet.create({
  tutorialImage: {
    width: dimensions.width,
    height: dimensions.height,
    position: 'absolute',
  }
})

export default TutorialImageModal;