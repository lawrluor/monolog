import React from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import { dimensions, spacings, text } from "../styles";

// A simple full screen modal that displays text in the center of the screen
// in front of a full screen pressable
export const MessageModal = ({ message }: any) => {
  const [modalVisible, setModalVisible] = React.useState(true);  // TODO: Conditional on user data

  return (
		modalVisible
		?
		<Pressable
			style={messageModalStyles.container}
			onPress={() => setModalVisible(false)}
		>
			<View style={messageModalStyles.overlayContainer}></View>

			<View style={messageModalStyles.messageContainer}>
				<Text style={messageModalStyles.modalText}>{message}</Text>
			</View>
		</Pressable>
		:
		null
  );
};

const messageModalStyles = StyleSheet.create({
	container: {
		height: dimensions.height,
		width: dimensions.width,
		justifyContent: "center",
    alignItems: "center",
		position: 'absolute',
	},
  overlayContainer: {
		height: dimensions.height,
		width: dimensions.width,
		backgroundColor: '#00000066',
		position: 'absolute',
  },
	messageContainer: {
    justifyContent: "center",
    alignItems: "center",
		backgroundColor: 'white',
		margin: spacings.LARGE,
		padding: spacings.LARGE,
		borderRadius: 10,
	},
	modalText: {
		...text.h4,
		color: 'black',
		textAlign: "center",
	}
});


// Tutorial Highlight Modal
// Problem, we want modal at end, and still have something from the page on top of it.
// can't just have highlighted element display the modal, because the modal will be bounded to the parent
// can't just use shadow radius as that scales color based on closeness
// can't just append views with opacity all around because that's jank and also doesn't work with parent
// can try to go into the component root directly but that seems like an annoying idea

// Solution:
// 1. In parent component: Using useLayout hook, get then pass the "coordinates" (x-Offset, Y-offset) of the component to be highlighted
// 2. In parent component: Store the component to be highlighted as a variable, then pass it as a child to TutorialHighlightModal
// 3. In TutorialHighlightModal: renders the component to be highlighted, on top of the overlay, positioned using the offsets
export const TutorialHighlightModal = ({ children, XYoffset }: any) => {
  const [modalVisible, setModalVisible] = React.useState(true);  // TODO: Conditional on user data

  return (
		(modalVisible && XYoffset)
		?
		<Pressable
			style={styles.container}
			onPress={() => setModalVisible(false)}
		>
			<View style={styles.overlayContainer}></View>

			<View style={{ position: 'absolute', left: XYoffset.x, right: XYoffset.x, top: XYoffset.y }}>
				{children}
			</View>
		</Pressable>
		:
		null
  )
}

const styles = StyleSheet.create({
	container: {
		height: dimensions.height,
		width: dimensions.width,
		position: 'absolute',
	},
  overlayContainer: {
		height: dimensions.height,
		width: dimensions.width,
		backgroundColor: '#00000066',
		position: 'absolute',
  },
	messageContainer: {
    justifyContent: "center",
    alignItems: "center",
		backgroundColor: 'white',
		margin: spacings.LARGE,
		padding: spacings.LARGE,
		borderRadius: 10,
	},
	modalText: {
		...text.h4,
		color: 'black',
		textAlign: "center",
	}
});