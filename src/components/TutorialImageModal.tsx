import React from 'react';
import { Pressable, Image, StyleSheet } from 'react-native';

import { dimensions } from '../styles';

const TutorialImageModal = ({ children, modalShown, imageUri }: any) => {
	const [tutorialShown, setTutorialShown] = React.useState<boolean>(modalShown);

	return (
		<>
			{
				tutorialShown
				&&
				<Pressable style={{ zIndex: 100 }} onPress={() => setTutorialShown(!tutorialShown)}>
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