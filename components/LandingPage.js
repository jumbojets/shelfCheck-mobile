import * as React from 'react';
import Modal from 'react-native-modal';
import { View, Text, TouchableOpacity, AsyncStorage, StyleSheet } from 'react-native';

export default function LandingPage(props) {
	const [modalVisible, setModalVisible] = React.useState(props.isVisible);

	const closeLandingPage = async () => {
		setModalVisible(false);
		try {
			AsyncStorage.setItem("seenLanding", "true");
		} catch {
			Alert.alert("Error", "There was a problem properly closing your landing page");
		}
	}

	return (
		<Modal isVisible={modalVisible} backdropOpacity={1} backdropColor={"#fff"} backdropTransitionOutTiming={750}>
			<View style={styles.container}>
				<View>
					<Text style={styles.title}>Hey, welcome to shelfCheck!</Text>
				</View>

				<View style={styles.instructions}>

					<View style={styles.explanation}>
						<View style={[styles.iconHolder, {backgroundColor: "#4cd6d3"}]}></View>
						<View style={styles.textContainer}>
							<Text style={styles.text}>Find the items you need at nearby stores</Text>
						</View>
					</View>

					<View style={styles.explanation}>
						<View style={[styles.iconHolder, {backgroundColor: "#7897f4"}]}></View>
						<View style={styles.textContainer}>
							<Text style={styles.text}>See what's in stock at stores closest to you</Text>
						</View>
					</View>

					<View style={styles.explanation}>
						<View style={[styles.iconHolder, {backgroundColor: "#693ce1"}]}></View>
						<View style={styles.textContainer}>
							<Text style={styles.text}>Help the community by reporting whats in stock</Text>
						</View>
					</View>

				</View>

				<TouchableOpacity style={styles.getStartedButton} onPress={() => closeLandingPage()}>
					<Text style={styles.getStartedText}>Let's get started!</Text>
				</TouchableOpacity>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		flexDirection: "column",
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	title: {
		fontSize: 35,
		fontWeight: "bold",
		color: "#7c49fd"
	},
	instructions: {
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		height: "60%",
		width: "100%",
	},
	explanation: {
		height: "30%",
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	iconHolder: {
		height: 135,
		width: 135,
		borderRadius: 70,
	},
	textContainer: {
		width: "55%",
	},
	text: {
		fontSize: 18,
		color: "#7c49fd",
		fontWeight: "bold",
	},
	getStartedButton: {
		height: "7%",
		width: "75%",
		backgroundColor: "#7c49fd",
		flexDirection: "column",
		justifyContent: "space-around",
		alignItems: "center",
		borderRadius: 30,
		paddingHorizontal: 20,
	},
	getStartedText: {
		fontSize: 19,
		color: "white",
		fontWeight: "bold",
	},
});