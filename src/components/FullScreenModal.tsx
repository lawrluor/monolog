import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { dimensions, spacings } from "../styles";

const FullScreenModal = ({ messageText }: any) => {
  const [modalVisible, setModalVisible] = useState(true);  // TODO: Conditional on user data

  return (
		<Pressable
			style={styles.container}
			onPress={() => setModalVisible(false)}
		>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View style={styles.messageBox}>
					<Text style={styles.modalText}>{messageText}</Text>
				</View>
			</Modal>
		</Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
		height: dimensions.height,
		width: dimensions.width,
    justifyContent: "center",
    alignItems: "center",
		backgroundColor: 'black',
		opacity: 0.4,
		position: 'absolute',
  },
	messageBox: {
		backgroundColor: 'white',
		padding: spacings.MEDIUM
	}
});

export default FullScreenModal;