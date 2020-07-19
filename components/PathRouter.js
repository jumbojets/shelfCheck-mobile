import * as React from 'react';
import Modal from 'react-native-modal';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, TextInput, Alert, AsyncStorage, Linking, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import GetCurrentLocation from '../api/GetCurrentLocation';
import GreedyShopper from '../api/GreedyShopper';
import ReverseGeocode from '../api/ReverseGeocode';
import ForwardGeocode from '../api/ForwardGeocode';
import GreedyShopperDb from '../pouch/GreedyShopperDb';
import Items from '../constants/Items';

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
	var items_string = "";

	props.items.forEach(function (item, index) {
		items_string += item.item_name + ', ';
	});

	items_string = items_string.slice(0, -2);

	if (items_string.length > 24) {
		items_string = items_string.slice(0, 24);
	}

	items_string += "...";

	return (
		<View style={storeStyles.store}>
			<TouchableOpacity>
				<Text style={{fontSize: 18, color: "#fff", fontWeight: "bold"}}>{props.name}</Text>
				<Text style={{color: "#fff"}}>{items_string}</Text>
			</TouchableOpacity>
			<TouchableOpacity style={storeStyles.navigateButton} onPress={() => openMapsApp(props.longitude, props.latitude, props.name)}>
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
	var not_found_items_string = "";

	if (props.not_found_items === undefined || props.not_found_items.length === 0) {
		not_found_items_string = "None!";
	} else {
		not_found_items_string += props.not_found_items[0];
	}

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
					<Text style={modalStyles.detailsText}>{props.total_travel_time} min</Text>
				</View>

				<View style={modalStyles.detailsRow}>
					<Text style={modalStyles.detailsText}>Your list found</Text>
					<Text style={modalStyles.detailsText}>{props.found_proportion}%</Text>
				</View>

				<View style={modalStyles.detailsRow}>
					<Text style={modalStyles.detailsText}>Items missing</Text>
					<Text style={[modalStyles.detailsText, {lineHeight: 25}]}>{not_found_items_string}</Text>
				</View>
			</View>
			<View></View>
		</Modal>
	)
}

function ChangeDestination(props) {
	const [placeholder, setPlaceholder] = React.useState(props.initial);
	const [address, setAddress] = React.useState(props.initial);
	const [wasTyped, setWasTyped] = React.useState(false);
	const [wasUpdated, setWasUpdated] = React.useState(false);
	const [textInput, setTextInput] = React.useState(null);

	getInitialAddress(setPlaceholder, (n) => {}, (n) => {});

	const ensureValidAddress = async () => {
		// make sure to change address to placeholder if the address has just been clicked on

		const { longitude, latitude } = await ForwardGeocode(address);

		if (longitude === null) {
			Alert.alert("We are extremely sorry! We couldnt find that address within 50 miles");
			return;
		}

		const reversed_address = await ReverseGeocode(longitude, latitude);

		try {
			await AsyncStorage.setItem('finalDestAddress', reversed_address);
			await AsyncStorage.setItem('finalDestLongitude', longitude.toString());
			await AsyncStorage.setItem('finalDestLatitude', latitude.toString());
		} catch {
			Alert.alert('Error setting address locally')
		}

		setPlaceholder(reversed_address);
		setAddress(reversed_address);
		setWasUpdated(true);
		setWasTyped(false);

		textInput.clear();
	};

	const imDone = async () => {
		if (wasTyped) {
			ensureValidAddress();
		}

		if (wasUpdated) {
			await AsyncStorage.setItem('updateRoute', 'true');
			props.updateFinalDestination(address);
		}

		setWasTyped(false);
		setWasUpdated(false);

		props.closeModal();
	};

	const useCurrentLocation = async () => {
		const { longitude, latitude } = await GetCurrentLocation();

		const reversed_address = await ReverseGeocode(longitude, latitude);

		try {
			await AsyncStorage.setItem('finalDestAddress', reversed_address);
			await AsyncStorage.setItem('finalDestLongitude', longitude.toString());
			await AsyncStorage.setItem('finalDestLatitude', latitude.toString());
		} catch {
			Alert.alert('Error setting address locally')
		}

		setPlaceholder(reversed_address);
		setAddress(reversed_address);
		setWasTyped(false);
		setWasUpdated(true);

		textInput.clear();
	};

	// use effect to read from pouchdb for current. if no current, default to current location.
	// do the same with address

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
						ref={input => setTextInput(input)}
						style={modalStyles.addressInput}
						placeholder={placeholder}
						textContentType="addressCityAndState"
						placeholderTextColor="#68ADEB"
						selectionColor="#4cd6d3"
						onBlur={ensureValidAddress}
						onChangeText={text => {setAddress(text); setWasTyped(true);}}
					/>
				</View>

				<View style={modalStyles.doneRowContainer}>
					<TouchableOpacity style={[modalStyles.doneButton, {width: "40%", backgroundColor: "#4cd6de"}]} onPress={imDone}>
						<Text style={{color: "#fff", fontWeight: "bold", fontSize: 16}}>I'm done!</Text>
					</TouchableOpacity>
					<TouchableOpacity style={[modalStyles.doneButton, {width: "40%"}]} onPress={useCurrentLocation}>
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
	addressInput: {
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

function openMapsApp(lng, lat, label) {
	const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
	const latLng = `${lat},${lng}`;
	const url = Platform.select({
		ios: `${scheme}${label}@${latLng}`,
		android: `${scheme}${latLng}(${label})`,
	});

	Linking.openURL(url);
};

async function getInitialAddress(setFinalDestination, setFinalLongitude, setFinalLatitude) {
	try {
		const finalDestAddress = await AsyncStorage.getItem('finalDestAddress');

		if (finalDestAddress !== null) {
			setFinalDestination(finalDestAddress);
		} else {
			const { longitude, latitude } = await GetCurrentLocation();

			const reversed_address = await ReverseGeocode(longitude, latitude);

			try {
				await AsyncStorage.setItem('finalDestAddress', reversed_address);
			} catch {
				Alert.alert('Error setting address locally')
			}

			setFinalDestination(reversed_address);
		}

		getInitialCoordinates(finalDestAddress, setFinalLongitude, setFinalLatitude)
	} catch {
		Alert.alert('error getting stored final destination')
	}
}

async function getInitialCoordinates(finalDestination, setFinalLongitude, setFinalLatitude) {
	const dest_coordinates = await ForwardGeocode(finalDestination);
	setFinalLongitude(dest_coordinates.longitude);
	setFinalLatitude(dest_coordinates.latitude);
}

async function getItemListAndStates() {
	var list = [];

	await Items.forEach(async (item, index) => {
		try {
			const value = await AsyncStorage.getItem(item);
			if (value === "true") {
				list.push(item);
			}
		} catch (error) {
			Alert.alert("Error", "We are unable to properly retrieve your list" + error);
		}
	});

	return list;
}

export default function PathRouter(props) {
	const [detailsVisible, setDetailsVisible] = React.useState(false);
	const [changeDestinationVisible, setChangeDestinationVisible] = React.useState(false);

	const [finalDestination, setFinalDestination] = React.useState("");
	const [finalLongitude, setFinalLongitude] = React.useState(0.);
	const [finalLatitude, setFinalLatitude] = React.useState(0.);
	const [contents, setContents] = React.useState({});

	getInitialAddress(setFinalDestination, setFinalLongitude, setFinalLatitude);

	const updateGreedyShopper = async () => {
		const curr_coordinates = await GetCurrentLocation();

		const items = await await getItemListAndStates();

		// wait for the items promise to load
		setTimeout(async () => {
			const contents = await GreedyShopper({
				curr_longitude: curr_coordinates.longitude,
				curr_latitude: curr_coordinates.latitude,
				home_longitude: finalLongitude,
				home_latitude: finalLatitude,
				items: items,
			});

			GreedyShopperDb.store(contents);	
		}, 25);
	};

	React.useEffect(() => {
		const YERRR = async () => {
			try {
				const value = await AsyncStorage.getItem("updateRoute");

				if (value === "true" && finalLongitude !== 0 && finalLatitude !== 0) {
					await AsyncStorage.setItem("updateRoute", "false");
					await updateGreedyShopper();
				}

				const recv = await GreedyShopperDb.retrieve();

				if (recv === undefined) {
					await AsyncStorage.setItem('updateRoute', 'true');
				}

				setContents(recv);

			} catch {
				Alert.alert('could not update your route')
			}
		};
		YERRR();
	})

	if (contents !== undefined && Object.keys(contents).length !== 0) {
	return (
		<View>
			<Modal isVisible={props.isVisible} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0.0}>
				{
					contents !== undefined && Object.keys(contents).length !== 0?
						<Details
							isVisible={detailsVisible}
							closeModal={() => setDetailsVisible(false)}
							total_travel_time={Math.round(contents.total_time / 60)}
							found_proportion={Math.round(contents.found_proportion * 100)}
							not_found_items={contents.not_found_items}
						/>
					:
					<View />
				}
				

				<ChangeDestination isVisible={changeDestinationVisible} closeModal={() => setChangeDestinationVisible(false)} updateFinalDestination={(addy) => setFinalDestination(addy)} />

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

						{
							contents.stores !== undefined?
							<View style={{width: "100%", alignItems: "center"}}>
							{
								contents.stores.map((item, index) => (
									<View key={index} style={{width: "100%", alignItems: "center"}}>
										<Bridge duration={Math.round(contents.stop_times[index] / 60)} />
										<Store name={item.name} items={item.approximate_quantities} longitude={item.coordinates[1]} latitude={item.coordinates[0]} />
									</View>
								))
							}

							<Bridge duration={Math.round(contents.stop_times[contents.stop_times.length - 1] / 60)} />

							<Text style={styles.duration}>To final destination</Text>

							</View>
							:
							<View><Text>Contents are undefined! Whatever that means :). I think ur list is empty</Text></View>
						}

					</View>

					<View style={styles.addressContainer}>
						<TouchableOpacity style={styles.address} onPress={() => openMapsApp(finalLongitude, finalLatitude, 'Final Destination')}>
							<Text style={{color: "white", fontSize: 15, fontWeight: "bold"}}>Your final destination:</Text>
							<Text style={{color: "white", fontSize: 15}}>{finalDestination}</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.topRightButton} onPress={() => setChangeDestinationVisible(true)}>
							<Text style={styles.topRightButtonText}>Change</Text>
						</TouchableOpacity>
					</View>

				</View>
			</Modal>
		</View>
	)

	} else {
		return(<View />)
	}

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