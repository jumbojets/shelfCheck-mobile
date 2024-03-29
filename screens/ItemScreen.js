import * as React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, AsyncStorage, Alert, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';
import GetClosestStoresSingleItem from '../api/GetClosestStoresSingleItem';
import GetCurrentLocation from '../api/GetCurrentLocation';
import Items from '../constants/Items';

export default class ItemScreen extends React.Component {
	state = { contents: "none", loading: true, item_name: "", item_category: "", addedToList: false, isListEmpty: true };

	async componentDidMount() {
		const { item_name, item_category } = this.props.route.params;

		this.setState({item_name: item_name});
		this.setState({item_category: item_category});

		try {
			const value = await AsyncStorage.getItem(item_name);

			if (value === "true" || value === "done") {
				this.setState({addedToList: true});
			}
		} catch {
			Alert.alert("Error", "Unable to get item on list state");
		}

		const { latitude, longitude } = await GetCurrentLocation();

		var c = await GetClosestStoresSingleItem({item_name: item_name, latitude: latitude, longitude: longitude});

		if (c !== "none") {
			c.forEach((item, index) => {
				if (item.name.length > 20) {
					c[index].name = item.name.slice(0, 17) + "...";
				}
				if (item.recency === 301) {
					item.recency = "Daily trend est.";
				} else if (item.recency === 300) {
					item.recency = "> 6 hours ago";
				} else if (item.recency > 100) {
					const hours = Math.round(item.recency / 60);
					item.recency = "~ " + hours.toString() + " hours ago";
				} else {
					item.recency = item.recency.toFixed(0).toString() + " min ago";
				}
			});
		}

		this.setState({ contents: c });
		this.setState({ loading: false });

		this.findIfListIsEmpty()
	}

	findIfListIsEmpty = async () => {
		this.setState({isListEmpty: true});

		await Items.forEach(async (item, index) => {
			try {
				const value = await AsyncStorage.getItem(item);
				if (value !== null) {
					this.setState({isListEmpty: false});
				}
			} catch (error) {
				Alert.alert("Error", "We are unable to properly retrieve your list" + error);
			}
		});
	}

	clearList = async () => {
		Items.forEach(async (item, index) => {
			try {
				if (item !== this.state.item_name) {
					await AsyncStorage.removeItem(item);
				}
			} catch {
				Alert.alert("Error", "We were unable to remove your items");
			}
		});
	}

	toggleItem = async () => {
		try {

			const value = parseInt(await AsyncStorage.getItem("lastToggleTime"));

			if (((Date.now() - value) > 43200000) && !this.state.isListEmpty) {
				Alert.alert(
					"It's been over 12 hours since you have added to your current list. Do you want to clear it?",
					"",
					[
					{
						text: "Please Don't!",
						onPress: () => {}
					},
					{
						text: "Go for it!",
						onPress: async () => await this.clearList()
					},
					]
				)
			}


			if (! this.state.addedToList) {
				await AsyncStorage.setItem(this.state.item_name, "true");
			} else {
				await AsyncStorage.removeItem(this.state.item_name);
			}

			await AsyncStorage.setItem("lastToggleTime", Date.now().toString());

			await AsyncStorage.setItem("updateRoute", "false");

			this.setState({ addedToList : !this.state.addedToList });

		} catch (error) {
			Alert.alert("Error", "Unable to add the item." + error)
		}

		Haptics.impactAsync();
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
						<TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('MainScreen', { prevCategory: this.state.item_category })}>
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
												store_id: item._id,
												firstItem: this.state.item_name,
											})
										}>

										<View style={styles.rowContainer}>
											<Text style={styles.topRowText}>{item.name}</Text>
											<Text style={styles.topRowText}>~ {item.approximate_quantity.toFixed(0)} units</Text>
										</View>

										<View style={styles.rowContainer}>
											<Text style={styles.bottomRowText}>{item.distance.toFixed(1)} miles away</Text>
											<Text style={styles.bottomRowText}>{item.recency}</Text>
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
		paddingVertical: 13,
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