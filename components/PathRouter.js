import * as React from 'react';
import Modal from 'react-native-modal';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AntDesign, Ionicons } from '@expo/vector-icons';

function Bridge(props) {
	return (
		<View style={styles.bridge}>
			<AntDesign name="arrowdown" size={24} color="#fff" />
			<Text style={styles.duration}>{props.duration} minutes</Text>
		</View>
	)
}

export default function PathRouter(props) {
	
	closeModal = () => {
		props.closeRoute();
	}

	return (
		<View>
			<Modal isVisible={props.isVisible} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0.0}>
				<View style={styles.main}>
					<View style={styles.titleContainer}>
						<Text style={styles.title}>Your route</Text>

						<TouchableOpacity style={styles.backButton} onPress={closeModal}>
							<Icon name="remove" size={30} color={"#fff"} />
						</TouchableOpacity>
					</View>

					<Text style={styles.captionText}>Captioon here for the greedy-shopper!</Text>

					<View style={styles.addressContainer}>
						<View style={styles.address}>
							<Text style={{color: "white", fontSize: 15, fontWeight: "bold"}}>Your final destination:</Text>
							<Text style={{color: "white", fontSize: 15,}}>227 Midenhall Way, Cary NC</Text>
						</View>

						<TouchableOpacity style={styles.editAddressButton}>
							<Text style={styles.editAddressText}>Change</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.routeContainer}>
						<View style={styles.routeTitleContainer}>
							<Text style={styles.title}>Route</Text>

							<TouchableOpacity style={styles.editAddressButton}>
								<Text style={styles.editAddressText}>Details</Text>
							</TouchableOpacity>
						</View>

						<Bridge duration={3} />

						<View style={styles.store}>
							<TouchableOpacity>
								<Text style={{fontSize: 17, color: "#9495FD", fontWeight: "bold"}}>Harris Teeter</Text>
								<Text style={{color: "#9495FD"}}>Bread, Milk</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.navigateButton}>
								<Text style={{color: "#fff", fontWeight: "bold"}}>Navigate</Text>
								<Ionicons name="md-navigate" size={15} color="#fff" />
							</TouchableOpacity>
						</View>

						<Bridge duration={7} />

						<View style={styles.store}>
							<TouchableOpacity>
								<Text style={{fontSize: 17, color: "#9495FD", fontWeight: "bold"}}>Food Lion</Text>
								<Text style={{color: "#9495FD"}}>Bottled Water, Milk</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.navigateButton}>
								<Text style={{color: "#fff", fontWeight: "bold"}}>Navigate</Text>
								<Ionicons name="md-navigate" size={15} color="#fff" />
							</TouchableOpacity>
						</View>

						<Bridge duration={5} />

						<View style={styles.store}>
							<TouchableOpacity>
								<Text style={{fontSize: 17, color: "#9495FD", fontWeight: "bold"}}>Target</Text>
								<Text style={{color: "#9495FD"}}>Eggs, Toilet Paper</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.navigateButton}>
								<Text style={{color: "#fff", fontWeight: "bold"}}>Navigate</Text>
								<Ionicons name="md-navigate" size={15} color="#fff" />
							</TouchableOpacity>
						</View>

						<Bridge duration={2} />

						<TouchableOpacity>
							<Text style={styles.duration}>To final destination</Text>
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
	},
	editAddressButton: {
		backgroundColor: "#fff",
		// height: "75%",
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
	editAddressText: {
		color: "#9495FD",
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
		flex: 1,
	},
	routeTitleContainer: {
		width: "90%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: "8%",
	},
	locText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 17
	},
	store: {
		height: "12%",
		width: "90%",
		paddingHorizontal: 20,
		backgroundColor: "#fff",
		borderRadius: 30,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	navigateButton: {
		backgroundColor: "#9495FD",
		width: "35%",
		paddingHorizontal: "3%",
		height: "50%",
		borderRadius: 15,
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
	bridge: {
		height: "7%",
		width: "30%",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	duration: {
		color: "#fff",
		fontWeight: "bold",
	}
});