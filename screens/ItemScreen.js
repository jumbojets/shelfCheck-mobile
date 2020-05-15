import * as React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, AsyncStorage, Alert, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';

import GetClosestStoresSingleItem from '../api/GetClosestStoresSingleItem';
import GetCurrentLocation from '../api/GetCurrentLocation';

export default class ItemScreen extends React.Component {
	state = { contents: "none", loading: true, item_name: "", addedToList: false };

	async componentDidMount() {
		const { item_name } = this.props.route.params;

		this.setState({item_name: item_name});

		try {
			const value = await AsyncStorage.getItem(item_name);

			if (value === "true") {
				this.setState({addedToList: true});
			}
		} catch (error) {
			Alert.alert("Error", "Unable to get item on list state");
		}

		const { latitude, longitude } = await GetCurrentLocation();

		var c = await GetClosestStoresSingleItem({item_name: item_name, latitude: latitude, longitude: longitude});

		if (c !== "none") {
			c.forEach((item, index) => {
				if (item.name.length > 20) {
					c[index].name = item.name.slice(0, 17) + "...";
				}
			});
		}

		this.setState({ contents: c });
		this.setState({ loading: false });

	}

	toggleItem = async () => {
		try {

			if (! this.state.addedToList) {
				await AsyncStorage.setItem(this.state.item_name, "true");
			} else {
				await AsyncStorage.removeItem(this.state.item_name);
			}

			this.setState({ addedToList : !this.state.addedToList });

		} catch (error) {
			Alert.alert("Error", "Unable to add the item." + error)
		}

	};

	makeBlankItems = () => {

		const blankItemsCount = 5 - this.state.contents.length;
		var blankItems = [];

		for (var i = 0; i < blankItemsCount; i++) {
			blankItems.push(
				<View key={i} style={styles.blankStoreButton} />
			);
		}

		return blankItems;
		
	};

	render() {
		const { navigation } = this.props;

		return (
			<View style={{flex: 1}}>
				<ImageBackground source={require('../assets/images/background-2.png')} style={{width: '100%', height: '100%'}}>
				<View style={styles.main}>
				<View style={styles.container}>
					<View style={styles.titleContainer}>
						<Text style={styles.titleText}>{this.state.item_name}</Text>
						<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
			            	<Icon name="arrow-left" size={30} color={"#fff"} />
			            </TouchableOpacity>
					</View>
					<TouchableOpacity style={this.state.addedToList ? styles.addButtonActive : styles.addButtonInactive} onPress={this.toggleItem}>
							{
								!this.state.addedToList ?
									<Text style={styles.addTextInactive}>Add to your list</Text>
								:
								<View style={{width: "70%", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
									<Text style={styles.addTextActive}>Added!</Text>
									<Icon name="check" size={23} color={"#fff"} />
								</View>
							}
					</TouchableOpacity>


					
					{
						this.state.contents !== "none" ?
						<View style={styles.storesContainer}>
							{
								this.state.contents.map((item, index) => (
									
									<TouchableOpacity
										style={styles.storeButton}
										key={item._id}
										onPress={() =>
											navigation.push('StoreScreen', {
												store_id: item._id
											})
										}>

										<View style={styles.rowContainer}>
											<Text style={styles.topRowText}>{item.name}</Text>
											<Text style={styles.topRowText}>~ {item.approximate_quantity.toFixed(0)} units</Text>
										</View>

										<View style={styles.rowContainer}>
											<Text style={styles.bottomRowText}>{item.distance.toFixed(1)} miles away</Text>
											<Text style={styles.bottomRowText}>{item.recency.toFixed(0)} min ago</Text>
										</View>

									</TouchableOpacity>

								))
							}
							{ this.makeBlankItems() }
						</View>
						:
						<Text style={styles.nothingText}>No reports at any stores nearby</Text>
					}


				</View>
				</View>
				</ImageBackground>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		flexDirection: "column",
		alignItems: "center",
	},
	container: {
		height: "90%",
		width: "90%",
		borderRadius: 30,
		backgroundColor: "#7256f3",
		marginTop: "15%",
		paddingHorizontal: "5%",
		paddingTop: "5%",
		paddingBottom: "2%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.29,
		elevation: 7,
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: "2%",
	},
	titleText: {
		fontWeight: "bold",
		fontSize: 30,
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
	addButtonInactive: {
		height: "7%",
		width: 175,
		backgroundColor: "#fff",
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "center",
		borderRadius: 25,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.2,
		elevation: 7,
	},
	addButtonActive: {
		height: "7%",
		width: 175,
		backgroundColor: "#4cd6de",
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "center",
		borderRadius: 25,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.2,
		elevation: 7,
	},
	addTextInactive: {
		fontSize: 17,
		color: "#4cd6de",
		fontWeight: "bold",
	},
	addTextActive: {
		fontSize: 17,
		color: "#fff",
		fontWeight: "bold",
	},
	storesContainer: {
		height: "100%",
		width: "100%",
		marginTop: "5%",
		flexDirection: "column",
		justifyContent: "space-around",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 5,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.23,
		elevation: 7,
	},
	storeButton: {
		height: "16%",
		width: "100%",
		backgroundColor: "#fff",
		borderRadius: 35,
		paddingHorizontal: 25,
		paddingVertical: 19,
		flexDirection: "column",
		justifyContent: "space-around",
	},
	blankStoreButton: {
		height: "16%",
		width: "100%",
		backgroundColor: "#0000",
	},
	rowContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	topRowText: {
		color: "#4524AC",
		fontSize: 17,
		fontWeight: "bold",
	},
	bottomRowText: {
		color: "#693CE1",
		fontSize: 15,
		// fontWeight: "bold",
	},
	nothingText: {
		paddingTop: "7%",
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold",
	},
});