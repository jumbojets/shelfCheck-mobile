import * as React from 'react';
import Modal from 'react-native-modal';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, AsyncStorage, StyleSheet, Dimensions, Alert, Image } from 'react-native';
import UserOperations from '../api/UserOperations';
import { AntDesign } from '@expo/vector-icons'; 

export default function LandingPage(props) {
	const [modalVisible, setModalVisible] = React.useState(props.isVisible);
	const [emailVisible, setEmailVisible] = React.useState(false);
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

	const buttonPress = () => {
		if (!emailVisible) {
			setEmailVisible(true);
			return;
		}

		closeLandingPage();
	};

	return (
		<View>
			<Modal isVisible={modalVisible} backdropOpacity={1} backdropColor={"#fff"} animationOut="slideOutLeft" backdropTransitionOutTiming={750}>
				<KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height"}>
					<View style={styles.titleView}>
						{
							emailVisible?
							<Text style={styles.title}>Consider joining our community</Text>
							:
							<Text style={[styles.title]}>Hey, welcome to shelfCheck!</Text>
						}
					</View>

					{
						emailVisible?
						<View style={[styles.instructions, {paddingHorizontal: "3%", justifyContent: "space-around"}]}>
							<View style={styles.emailForm} intensity={1}>
								<View style={{flexDirection: "row"}}>
									<Text style={styles.modalCaption}>•</Text><Text style={styles.modalCaption}> Track your impact: see how many shoppers you helped by reporting</Text>
								</View>
								<View style={{flexDirection: "row"}}>
									<Text style={styles.modalCaption}>•</Text><Text style={styles.modalCaption}> Climb your local leaderboard every time you contribute</Text>
								</View>
								<View style={{flexDirection: "row"}}>
									<Text style={styles.modalCaption}>•</Text><Text style={styles.modalCaption}> It’s free, secure and completely optional</Text>
								</View>
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
						</View>
						:
						<View style={styles.instructions}>
							<View style={styles.explanation}>
								<View style={styles.iconHolder}>
									<Image source={require('../assets/images/landing-1.png')} style={{width: '80%', height: '80%'}} />
								</View>
								<View style={styles.textContainer}>
									<Text style={styles.text}>Find the items you need at nearby stores</Text>
								</View>
							</View>

							<View style={styles.explanation}>
								<View style={styles.iconHolder}>
									<Image source={require('../assets/images/landing-2.png')} style={{width: '80%', height: '80%'}} />
								</View>
								<View style={styles.textContainer}>
									<Text style={styles.text}>See what's available at stores closest to you</Text>
								</View>
							</View>

							<View style={styles.explanation}>
								<View style={styles.iconHolder}>
									<Image source={require('../assets/images/landing-3.png')} style={{width: '80%', height: '80%'}} />
								</View>
								<View style={styles.textContainer}>
									<Text style={styles.text}>Help the community by reporting what's in stock</Text>
								</View>
							</View>
						</View>

					}

					<TouchableOpacity style={[styles.getStartedButton, {backgroundColor: emailVisible? "#7c49fd": "#7c49fd"}]} onPress={() => {buttonPress()}}>
						
						{
							emailVisible?
							<Text style={styles.getStartedText}>Let's get started!</Text>
							:
							<View style={{flex: 1, flexDirection: "row", justifyContent: "center", "alignItems": "center"}}>
								<Text style={styles.getStartedText}>Next</Text>
								<AntDesign style={{marginTop: 4, marginLeft: 10}} name="arrowright" size={30} color={"#fff"} />
							</View>
						}
					</TouchableOpacity>
				</KeyboardAvoidingView>
			</Modal>
		</View>
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
		paddingHorizontal: "7%",
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
		flexDirection: "column",
		justifyContent: "space-around",
		alignItems: "center",
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
		width: "100%",
		backgroundColor: "#7897f4",
		height: "90%",
		borderRadius: 30,
		paddingHorizontal: 30,
		paddingVertical: 5,
		flexDirection: "column",
		justifyContent: "space-evenly",
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
		height: 62.72,
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
	modalCaption: {
		color: "#fff",
		fontSize: 18,
		marginVertical: 2,
		fontWeight: "bold",
	},
});