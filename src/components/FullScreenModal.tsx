import React from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import { dimensions, spacings, text } from "../styles";

const FullScreenModal = ({ children, XYoffset, message }: any) => {
  const [modalVisible, setModalVisible] = React.useState(true);  // TODO: Conditional on user data
	console.log(XYoffset);

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

			{/* <View style={styles.messageContainer}>
				<Text style={styles.modalText}>{message}</Text>
			</View> */}
		</Pressable>
		:
		null
  );
};

const styles = StyleSheet.create({
	container: {
		height: dimensions.height,
		width: dimensions.width,
		// justifyContent: "center",
    // alignItems: "center",
		position: 'absolute',
		zIndex: 1

	},
  overlayContainer: {
		height: dimensions.height,
		width: dimensions.width,
		backgroundColor: '#00000055',
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

export default FullScreenModal;