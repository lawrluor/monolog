import React from 'react';
import { Pressable, Image, StyleSheet } from 'react-native';

import { dimensions } from '../styles';

// Always render this on top of other elements, hence zIndex style
const TutorialImageModal = ({ children, shown, setShown, imageUri }: any) => {
	return (
		<>
			{
				shown
				&&
				<Pressable style={{ zIndex: 999 }} onPress={() => setShown(!shown)}>
					<Image style={styles.tutorialImage} source={ imageUri }/>
				</Pressable>
			}

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