import * as React from 'react';
import Modal from 'react-native-modal';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, AsyncStorage, StyleSheet, Dimensions, Alert } from 'react-native';
import UserOperations from '../api/UserOperations';

export default function LandingPage(props) {
	const [modalVisible, setModalVisible] = React.useState(props.isVisible);
	const [email, setEmail] = React.useState("");

	const closeLandingPage = async () => {
		if (email !== "") {
			if (!validateEmail(email)) {
				Alert.alert("Not a valid email!", "Leave input empty if you do not want to share one.");
				return;
			}

			const c = await UserOperations({action: "add", email: email.toLowerCase()});

			if (c.status !== "worked") {
				Alert.alert(c.status);
				return;
			}

			try {
				AsyncStorage.setItem("email", email.toLowerCase());
			} catch {
				Alert.alert("Error", "There was an error storing your email locally");
			}
		}

		setModalVisible(false);
		try {
			AsyncStorage.setItem("seenLanding", "true");
		} catch {
			Alert.alert("Error", "There was a problem properly closing your landing page");
		}
	};

	const validateEmail = (trial) => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(trial).toLowerCase());
	};

	const checkValidEmail = () => {
		if (email === "") {
			return;
		}
		if (!validateEmail(email)) {
			Alert.alert("Not a valid email!", "Leave input empty if you do not want to share one.");
		}
	};

	return (
		<Modal isVisible={modalVisible} backdropOpacity={1} backdropColor={"#fff"} backdropTransitionOutTiming={750}>
			<KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "padding"}>
				<View style={styles.titleView}>
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
							<Text style={styles.text}>Help the community by reporting what's in stock</Text>
						</View>
					</View>

				</View>

				<View style={styles.emailForm} intensity={1}>
					<Text style={{color: "#fff", fontSize: 12}}>Join the community to track your impact. It’s a free and secure way to see how your reports help others</Text>
					<TextInput
						style={styles.emailInput}
						placeholder="Email address"
						keyboardType="email-address"
						textContentType="emailAddress"
						placeholderTextColor="#fff"
						selectionColor="#4cd6d3"
						onBlur={() => checkValidEmail(email)}
						onChangeText={text => setEmail(text)}
					/>
				</View>

				<TouchableOpacity style={styles.getStartedButton} onPress={() => closeLandingPage()}>
					<Text style={styles.getStartedText}>Let's get started!</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
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
	titleView: {
		marginTop: 20,
	},
	title: {
		fontSize: 35,
		fontWeight: "bold",
		color: "#7c49fd",
		textAlign: "center"
	},
	instructions: {
		flexDirection: "column",
		justifyContent: "space-between",
		alignItems: "center",
		height: "50%",
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
		height: Dimensions.get("window").width * 0.33,
		width: Dimensions.get("window").width * 0.33,
		borderRadius: 70,
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowRadius: 4.7,
		shadowOpacity: 0.3,
		elevation: 8,
	},
	textContainer: {
		width: "55%",
	},
	text: {
		fontSize: 18,
		color: "#7c49fd",
		fontWeight: "bold",
	},
	emailForm: {
		backgroundColor: "#7897f4",
		height: 100,
		borderRadius: 30,
		paddingHorizontal: 30,
		paddingVertical: 5,
		flexDirection: "column",
		justifyContent: "space-around",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowRadius: 4.7,
		shadowOpacity: 0.3,
		elevation: 8,
	},
	emailInput: {
		height: 40,
		borderRadius: 20,
		borderColor: "#fff",
		borderWidth: 2,
		paddingHorizontal: 20,
		color: "#fff",
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
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowRadius: 4.7,
		shadowOpacity: 0.3,
		elevation: 8,
	},
	getStartedText: {
		fontSize: 19,
		color: "white",
		fontWeight: "bold",
	},
});