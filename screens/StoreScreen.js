import { Text, StyleSheet, View, TouchableOpacity, Alert, Dimensions, ImageBackground, Linking, Platform } from 'react-native';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons'; 
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';

import { MonoText } from '../components/StyledText';
import GetStoreData from '../api/GetStoreData';
import GetCurrentLocation from '../api/GetCurrentLocation';

export default class StoreScreen extends React.Component {
	state = {contents: {}, loading: true, modalVisible: false, modalItemIndex: 0, clicked_item_name: ""}

	async componentDidMount() {
		const { route } = this.props;
		const { store_id, firstItem } = route.params;

		const { latitude, longitude } = await GetCurrentLocation();

		var c = await GetStoreData({store_id: store_id, latitude: latitude, longitude: longitude});

		if (c !== null) {
			c.shownName = c.name;
			c.shownAddress = c.address;
			if (c.name.length > 23) {
				c.shownName = c.shownName.slice(0, 14) + "...";
			}
			if (c.address.length > 35) {
				c.shownAddress = c.shownAddress.slice(0, 33) + "...";
			}

			if (firstItem !== null) {
				c.inventory.forEach((item, index) => {
					if (item.item_name === firstItem) {
						[c.inventory[0], c.inventory[index]] = [c.inventory[index], c.inventory[0]];
					}
				});
			}
		}

		this.setState({ contents: c});
		this.setState({ loading: false});
		this.setState({ clicked_item_name: "item_name"})
	}

	cleanInventoryOpen = () => {
		this.state.contents.inventory[this.state.modalItemIndex].crowdsourced_data.reverse();
		this.state.contents.inventory[this.state.modalItemIndex].crowdsourced_data = this.state.contents.inventory[this.state.modalItemIndex].crowdsourced_data.slice(0, 7);
	}

	cleanInventoryClose = () => {
		this.state.contents.inventory[this.state.modalItemIndex].crowdsourced_data.reverse();
	}

	openMapsApp = () => {
		const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
		const latLng = `${this.state.contents.coordinates[1]},${this.state.contents.coordinates[0]}`;
		const label = this.state.contents.name;
		const url = Platform.select({
			ios: `${scheme}${label}@${latLng}`,
			android: `${scheme}${latLng}(${label})`,
		});

		Linking.openURL(url);
	}


	render() {
		const { navigation } = this.props;
		try {
			this.state.contents.distance = this.state.contents.distance.toFixed(1);
		} catch (error) {

		}
		return (

			<View style={styles.main}>
				<ImageBackground source={require('../assets/images/background-2.png')} style={{width: '100%', height: '100%'}}>
					<View style={styles.main}>

						<Modal isVisible={this.state.modalVisible} onBackdropPress={() => {this.setState({modalVisible: false}); this.cleanInventoryClose()}} animationIn="slideInLeft" animationOut="slideOutLeft" backdropOpacity={0.55}>

							{
								this.state.loading === false && this.state.contents.inventory.length !== 0 ?

								<View style={styles.modalContainer}>

									<View>
									{
										this.state.contents.inventory.length !== 0 ?

										<View style={styles.modalTitleContainer}>
											<Text style={styles.modalTitle}>Most recent reports</Text>

							            	<TouchableOpacity style={styles.modalBackButton} onPress={() => {this.setState({modalVisible: false}); this.cleanInventoryClose()} }>
							            		<Icon name="remove" size={30} color={"#fff"} />
							            	</TouchableOpacity>
							            </View>

						            	:

						            	<View />

						            }

						            </View>
						            {
						            	this.state.contents.inventory[this.state.modalItemIndex].crowdsourced_data.map((item, index) => (
											<View key={index} style={styles.modalButton}>
												<Text style={styles.modalText}>{item.quantity} units</Text>
												<Text style={styles.modalText}>{item.recency.toFixed(0)} min ago</Text>
											</View>
										))
						            }

					            </View>

					            :
					            <View />
					    }
						</Modal>

						<View style={styles.container}>
							<View style={styles.nameContainer}>
								<Text style={styles.name}>{this.state.contents.shownName}</Text>
								<TouchableOpacity style={styles.backbutton} onPress={() => navigation.goBack()}>
									<Icon name="arrow-left" size={30} color={"#fff"} />
								</TouchableOpacity>
							</View>
							<View style={styles.storeDetails}>
								<View style={styles.detailsNavRow}>
									<Text style={styles.title}>Details</Text>
									<TouchableOpacity style={styles.navigateButton} onPress={() => this.openMapsApp()}>
										<Text style={{color: "#9495FD", fontWeight: "bold"}}>Navigate</Text>
										<Ionicons name="md-navigate" size={15} color="#9495FD" />
									</TouchableOpacity>
								</View>
								<View onPress={() => Alert.alert("this will open maps application")}>
									<Text style={{color: "#fff", fontSize: 16}}>{this.state.contents.shownAddress}</Text>
									<Text style={{color: "#fff", fontSize: 16}}>{this.state.contents.distance} miles away</Text>
								</View>
							</View>
							<View style={styles.inventory}>
								<Text style={styles.title}>Inventory</Text>
								<Text style={styles.inventoryDescription}>Click on an item for specific information</Text>
								<ScrollView>
								{
									this.state.contents.numberOfItems === 0 || this.state.loading ?

									<Text style={{color: "#fff", fontSize: 20}}>No reports of items in stock.</Text>
									:

									this.state.contents.inventory.map((item, index) => (
										<TouchableOpacity
											key={index}
											style={styles.itemContainer}
											onPress={() => {this.setState({modalVisible: true}); this.setState({modalItemIndex: index}); this.cleanInventoryOpen(); this.setState({clicked_item_name: item.item_name})}} >
											<Text style={styles.itemLeft}>{item.item_name}</Text>
											<Text style={styles.itemRight}>~ {item.approximate_quantity.toFixed(0)} units</Text>
										</TouchableOpacity>
									))
								}
								</ScrollView>
							</View>
						</View>
					</View>
				</ImageBackground>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		flexDirection: "column",
		justifyContent: "space-evenly",
		alignItems: "center",
		height: "100%",
		width: "100%",
	},
	container: {
		width: "90%",
		height: "90%",
		backgroundColor: "#7897F4",
		borderRadius: 35,
		paddingVertical: "8%",
		paddingHorizontal: "5%",
		marginTop: "20%",
		marginBottom: "10%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.29,
		elevation: 7,
	},
	nameContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: "2%",
	},
	name: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 30,
	},
	backbutton: {
		height: 40,
		width: 40,
		borderRadius: 25,
		backgroundColor: "#9495FD",
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
	storeDetails: {
		height: "27%",
		marginTop: "5%",
		paddingHorizontal: "5%",
		backgroundColor: "#9495FD",
		borderRadius: 25,
		flexDirection: "column",
		justifyContent: "space-evenly",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.2,
		elevation: 7,
	},
	detailsNavRow: {
		flexDirection: "row",
		height: "25%",
		width: "100%",
		justifyContent: "space-between",
		alignItems: "center",
	},
	navigateButton: {
		backgroundColor: "#fff",
		width: "35%",
		paddingHorizontal: "3%",
		height: "100%",
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
	inventory: {
		marginTop: "5%",
		height: "80%",
		borderRadius: 25,
		paddingHorizontal: "5%",
		paddingTop: "5%",
		backgroundColor: "#9495FD",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.25,
		elevation: 7,
	},
	inventoryDescription: {
		color: "#fff",
		marginTop: 5,
		marginBottom: 5,
	},
	title: {
		color: "#fff",
		fontSize: 22,
		fontWeight: "bold",
	},
	itemContainer: {
		backgroundColor: "#fff",
		marginTop: 10,
		borderRadius: 20,
		height: 45,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	itemLeft: {
		color: "#7e84f3",
		fontSize: 17,
		fontWeight: "bold",
		paddingLeft: "6%",
	},
	itemRight: {
		color: "#7e84f3",
		fontSize: 17,
		fontWeight: "bold",
		paddingRight: "6%",
	},
	modalContainer: {
		backgroundColor:"white",
		width: Dimensions.get("window").width*0.90,
		borderRadius: 30,
		backgroundColor: "#7b85f4",
		padding: "5%",
    },
    modalTitleContainer: {
	    flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	modalTitle: {
		fontWeight: "bold",
		fontSize: 25,
		color: "#fff",
	},
	modalButton: {
		width: "100%",
		backgroundColor: "#fff3",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
		height: 60,
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
	modalBackButton: {
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
	modalText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
});