import React from 'react';
import { Pressable, Image, StyleSheet } from 'react-native';

import { dimensions } from '../styles';

// Always render this on top of other elements, hence zIndex style
const TutorialImageModal = ({ children, shown, setShown, imageUri, onLoadCallback }: any) => {
	// NOTE: We are not using traditional conditional rendering here and instead toggling display style
	// This is because the image onLoad callback only works if the <Image> component is actually rendered
	// This way, the image is still rendered but simply does not display, allowing the onLoad callback to fire
	// and thereby changing the isLoading state in its parent component.
	return (
		<>
			<Pressable style={{ zIndex: 999, display: shown ? 'none' : 'flex' }} onPress={() => setShown(!shown)}>
				<Image style={styles.tutorialImage} source={ imageUri } onLoad={onLoadCallback}/>
			</Pressable>

			{children}
		</>
	)
}

const styles = StyleSheet.create({
  tutorialImage: {
    width: dimensions.width,
    height: dimensions.height,
    position: 'absolute',
  }
})

export default TutorialImageModal;