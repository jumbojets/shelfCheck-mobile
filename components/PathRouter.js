import * as React from 'react';
import Modal from 'react-native-modal';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AntDesign, Ionicons } from '@expo/vector-icons';

function Bridge(props) {
	return (
		<View style={bridgeStyles.bridge}>
			<AntDesign name="arrowdown" size={24} color="#fff" />
			<Text style={styles.duration}>{props.duration} minutes</Text>
		</View>
	)
}

const bridgeStyles = StyleSheet.create({
	bridge: {
		height: Dimensions.get("window").height*0.045,
		width: "30%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});

function Store(props) {
	return (
		<View style={storeStyles.store}>
			<TouchableOpacity>
				<Text style={{fontSize: 18, color: "#fff", fontWeight: "bold"}}>{props.name}</Text>
				<Text style={{color: "#fff"}}>{props.items}</Text>
			</TouchableOpacity>
			<TouchableOpacity style={storeStyles.navigateButton}>
				<Text style={{color: "#fff", fontWeight: "bold"}}>Navigate</Text>
				<Ionicons name="md-navigate" size={15} color="#fff" />
			</TouchableOpacity>
		</View>

	)
}

const storeStyles = StyleSheet.create({
	store: {
		height: Dimensions.get("window").height*0.08,
		width: "90%",
		paddingHorizontal: 20,
		backgroundColor: "#fff3",
		borderRadius: 30,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		shadowColor: "#000",
	    shadowOffset: {
	      width: 0,
	      height: 3,
	    },
	    shadowRadius: 3,
	    shadowOpacity: 0.2,
	    elevation: 7,
	},
	navigateButton: {
		backgroundColor: "#fff3",
		width: "35%",
		paddingHorizontal: "3%",
		height: "50%",
		borderRadius: 20,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-around",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 3,
		shadowOpacity: 0.15,
		elevation: 7,
	},
});

function Details(props) {
	return (
		<Modal isVisible={props.isVisible} onBackdropPress={props.closeModal} animationIn="slideInLeft" animationOut="slideOutLeft" backdropOpacity={0.55}>
			<View style={modalStyles.main}>
				<View style={modalStyles.titleContainer}>
					<Text style={modalStyles.title}>Route Details</Text>
						<TouchableOpacity style={modalStyles.backButton} onPress={props.closeModal}>
						<Icon name="remove" size={30} color={"#fff"} />
					</TouchableOpacity>
				</View>

				<View style={modalStyles.detailsRow}>
					<Text style={modalStyles.detailsText}>Total travel time</Text>
					<Text style={modalStyles.detailsText}>17 min</Text>
				</View>

				<View style={modalStyles.detailsRow}>
					<Text style={modalStyles.detailsText}>Your list found</Text>
					<Text style={modalStyles.detailsText}>71%</Text>
				</View>

				<View style={modalStyles.detailsRow}>
					<Text style={modalStyles.detailsText}>Items missing</Text>
					<Text style={[modalStyles.detailsText, {lineHeight: 25}]}>Yeast{"\n"}Batteries</Text>
				</View>
			</View>
		</Modal>
	)
}

function ChangeDestination(props) {
	return (
		<Modal isVisible={props.isVisible} animationIn="slideInLeft" animationOut="slideOutLeft" backdropOpacity={0.55}>
			<View style={[modalStyles.main, {bottom: "15%"}]}>
				<View style={modalStyles.titleContainer}>
					<Text style={modalStyles.title}>Change destination</Text>
				</View>

				<View style={{flexDirection: "row"}}>
					<Text style={modalStyles.modalCaption}>•</Text><Text style={modalStyles.modalCaption}> Some caption convincing them to type in their address</Text>
				</View>
				<View style={{flexDirection: "row"}}>
					<Text style={modalStyles.modalCaption}>•</Text><Text style={modalStyles.modalCaption}> Some caption convincing them to type in their address</Text>
				</View>
				<View style={{flexDirection: "row"}}>
					<Text style={modalStyles.modalCaption}>•</Text><Text style={modalStyles.modalCaption}> Press "Use current" to use your current location as your final destination</Text>
				</View>

				<View style={modalStyles.addressForm} intensity={1}>
					<TextInput
						style={modalStyles.emailInput}
						placeholder="Address"
						textContentType="addressCityAndState"
						placeholderTextColor="#68ADEB"
						selectionColor="#4cd6d3"
						onBlur={() => {}}
						onChangeText={text => {}}
					/>
				</View>

				<View style={modalStyles.doneRowContainer}>
					<TouchableOpacity style={[modalStyles.doneButton, {width: "40%", backgroundColor: "#4cd6de"}]} onPress={props.closeModal}>
						<Text style={{color: "#fff", fontWeight: "bold", fontSize: 16}}>I'm done!</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[modalStyles.doneButton, {width: "40%"}]} onPress={() => {}}>
						<Text style={{color: "#4cd6de", fontWeight: "bold", fontSize: 16}}>Use current</Text>
					</TouchableOpacity>
				</View>

			</View>
		</Modal>
	)
}

const modalStyles = StyleSheet.create({
	main: {
		width: Dimensions.get("window").width*0.90,
		borderRadius: 30,
		backgroundColor: "#68ADEB",
		padding: "5%",
		flexDirection: "column",
		justifyContent: "space-between",
    },
    titleContainer: {
	    flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	title: {
		fontWeight: "bold",
		fontSize: 25,
		color: "#fff",
	},
	backButton: {
		height: 40,
		width: 40,
		borderRadius: 25,
		backgroundColor: "#66c1e0",
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 3,
		shadowOpacity: 0.2,
		elevation: 7,
	},
	detailsRow: {
		paddingHorizontal: "10%",
		paddingVertical: 20,
		width: "100%",
		backgroundColor: "#fff3",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginVertical: 5,
		borderRadius: 25,
		shadowColor: "#000",
	    shadowOffset: {
	      width: 0,
	      height: 3,
	    },
	    shadowRadius: 3,
	    shadowOpacity: 0.2,
	    elevation: 7,
	},
	detailsText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "right",
	},
	modalCaption: {
		color: "#fff",
		fontSize: 15,
		// marginVertical: -8,
	},
	addressForm: {
		marginTop: 5,
		backgroundColor: "#fff",
		height: 50,
		borderRadius: 30,
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
		marginTop: 20,
		marginBottom: 20,
	},
	emailInput: {
		height: 40,
		borderRadius: 20,
		borderColor: "#fff",
		borderWidth: 2,
		paddingHorizontal: 20,
		color: "#68ADEB",
	},
	doneRowContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		height: 40,
	},
	doneButton: {
		backgroundColor: "#fff",
		paddingHorizontal: "0%",
		height: "100%",
		borderRadius: 25,
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-around",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 3,
		shadowOpacity: 0.15,
		elevation: 7,
	},
});

export default function PathRouter(props) {
	const [detailsVisible, setDetailsVisible] = React.useState(false);
	const [changeDestinationVisible, setChangeDestinationVisible] = React.useState(false);


	// closeModal = () => {
	// 	props.closeRoute();
	// }

	return (
		<View>
			<Modal isVisible={props.isVisible} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0.0}>
				<Details isVisible={detailsVisible} closeModal={() => setDetailsVisible(false)} />
				<ChangeDestination isVisible={changeDestinationVisible} closeModal={() => setChangeDestinationVisible(false)} />

				<View style={styles.main}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Your Route</Text>

						<TouchableOpacity style={styles.backButton} onPress={() => props.closeModal()}>
							<Icon name="remove" size={30} color={"#fff"} />
						</TouchableOpacity>
					</View>

					<Text style={styles.captionText}>Captioon here for the greedy-shopper!</Text>

					<View style={styles.routeContainer}>
						<View style={styles.routeTitleContainer}>
							<Text style={styles.title}>Route</Text>

							<TouchableOpacity style={styles.topRightButton} onPress={() => setDetailsVisible(true)}>
								<Text style={styles.topRightButtonText}>Details</Text>
							</TouchableOpacity>
						</View>

						<Bridge duration={3} />
						<Store name={"Harris Teeter"} items={"Bread, Milk"} />

						<Bridge duration={7} />
						<Store name={"Food Lion"} items={"Bottled Water, Milk"} />

						<Bridge duration={5} />
						<Store name={"Target"} items={"Eggs, Toilet Paper"} />

						<Bridge duration={2} />

						<Text style={styles.duration}>To final destination</Text>

					</View>

					<View style={styles.addressContainer}>
						<TouchableOpacity style={styles.address}>
							<Text style={{color: "white", fontSize: 15, fontWeight: "bold"}}>Your final destination:</Text>
							<Text style={{color: "white", fontSize: 15,}}>227 Midenhall Way, Cary, NC</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.topRightButton} onPress={() => setChangeDestinationVisible(true)}>
							<Text style={styles.topRightButtonText}>Change</Text>
						</TouchableOpacity>
					</View>

				</View>
			</Modal>
		</View>
	)
}

const styles = StyleSheet.create({
	main: {
		width: Dimensions.get("window").width*0.90,
		height: Dimensions.get("window").height*0.90,
		borderRadius: 30,
		backgroundColor: "#7897F4",
		paddingTop: "5%",
		paddingHorizontal: "5%",
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	title: {
		fontWeight: "bold",
		fontSize: 25,
		color: "#fff",
	},
	backButton: {
		height: 40,
		width: 40,
		borderRadius: 25,
		backgroundColor: "#66c1e0",
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 3,
		shadowOpacity: 0.2,
		elevation: 7,
	},
	address: {
		height: "90%",
		flexDirection: "column",
		justifyContent: "space-between",
	},
	addressContainer: {
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: "5%",
		height: "10%",
		backgroundColor: "#9495FD",
		marginBottom: 10,
		borderRadius: 30,
		paddingVertical: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.25,
		elevation: 7,
		marginTop: 10,
	},
	topRightButton: {
		backgroundColor: "#fff3",
		height: 35,
		width: "25%",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "space-around",
		borderRadius: 30,
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 3,
		shadowOpacity: 0.15,
		elevation: 7,
	},
	topRightButtonText: {
		color: "#fff",
		fontWeight: "bold",
	},
	captionText: {
		color: "#fff",
		fontSize: 18,
		marginVertical: "5%",
	},
	routeContainer: {
		width: "100%",
		flexDirection: "column",
		alignItems: "center",
		backgroundColor: "#9495FD",
		borderRadius: 30,
		paddingVertical: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.25,
		elevation: 7,
		marginBottom: 10,
		// flex: 1,
	},
	routeTitleContainer: {
		width: "90%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: Dimensions.get("window").height*0.045,
	},
	locText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 17
	},
	duration: {
		color: "#fff",
		fontWeight: "bold",
	}
});