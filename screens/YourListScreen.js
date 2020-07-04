import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, Alert, AsyncStorage, Linking, Platform, Dimensions } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as React from 'react';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import ViewPager from '@react-native-community/viewpager';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import * as Haptics from 'expo-haptics';

import AddDataScreen from './AddDataScreen';
import StoreScreen from './StoreScreen';
import GetCurrentLocation from '../api/GetCurrentLocation';
import GetClosestStoresMultipleItems from '../api/GetClosestStoresMultipleItems';
import Items from '../constants/Items';
import PathRouter from '../components/PathRouter';

const Stack = createStackNavigator();

export default function YourListPage() {
	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator screenOptions={{headerShown: false}}>
				<Stack.Screen name="MainScreen" component={AutoRefreshWrapper} />
				<Stack.Screen name="AddDataScreen" component={AddDataScreen} />
				<Stack.Screen name="StoreScreen" component={StoreScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);

	
}

function AutoRefreshWrapper(props) {
	const isFocused = useIsFocused();

	return (
		<View style={{flex:1}}>
			<View style={{flex:1}}>
				{isFocused
					? <View style={{flex:1}}><YourListScreen navigation={props.navigation} /></View>
					: <View />
				}
			</View>
		</View>
	)
}

class YourListScreen extends React.Component {
	state = {contents: [], userItems: [], itemStates: {}, loading: true, contentHeight: 0, modalVisible: false, routeVisible: true};

	clearList = () => {
		Items.forEach(async (item, index) => {
			try {
				await AsyncStorage.removeItem(item);
			} catch {
				Alert.alert("Error", "We were unable to remove your items");
			}
		});
		this.setState({userItems: []});
		this.setState({itemStates: {}});
		this.setState({contents: []});
	}

	pressClearList = () => {
		Alert.alert(
			"Are you sure that you want to clear your list?",
			"",
			[
			{
				text: "Please Don't!",
				onPress: () => {}
			},
			{
				text: "Go for it!",
				onPress: () => this.clearList()
			},
			]
		)
	}

	getItemListAndStates = async () => {
		this.setState({userItems: []});
		this.setState({itemStates: {}});

		await Items.forEach(async (item, index) => {
			try {
				const value = await AsyncStorage.getItem(item);
				if (value !== null) {
					this.state.userItems.push(item);
					this.state.itemStates[item] = value;
				}
			} catch (error) {
				Alert.alert("Error", "We are unable to properly retrieve your list" + error);
			}
		});
	}

	openMapsApp = (lng, lat, label) => {
		const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
		const latLng = `${lat},${lng}`;
		const url = Platform.select({
			ios: `${scheme}${label}@${latLng}`,
			android: `${scheme}${latLng}(${label})`,
		});

		Linking.openURL(url);
	}


	submitData = (storeName, itemName) => {
		const { navigation } = this.props;
		return () => {
			Haptics.impactAsync();
			navigation.push('AddDataScreen', {
				defaultStore: storeName,
				defaultItem: itemName,
			});
		}
	}

	toggleItem = async (item) => {
		var newItems = this.state.userItems;
		var newStates = this.state.itemStates;
		try {
			if (item in this.state.itemStates) {
				const indexToRemove = this.state.userItems.indexOf(item);
				newItems.splice(indexToRemove, 1);
				this.setState({ userItems: newItems })
				delete newStates[item];
				this.setState({ itemStates: newStates })
				await AsyncStorage.removeItem(item);
			} else {
				newItems.push(item);
				newItems.sort();
				this.setState({ userItems: newItems })
				newStates[item] = "true";
				this.setState({ itemStates: newStates })
				await AsyncStorage.setItem(item, "true");
			}
			await AsyncStorage.setItem("updateRoute", "true");
		} catch (error) {
			Alert.alert("Error", error);
		}
		Haptics.impactAsync();
	}

	closeModal = async () => {
		this.setState({ modalVisible: false });
		await this.resetContents();
		try {
			await AsyncStorage.setItem("lastToggleTime", Date.now().toString());
		} catch {
			Alert.alert("Error", "error setting the last toggle time")
		}
	}

	resetContents = async () => {
		const { latitude, longitude } = await GetCurrentLocation();

		var c = await GetClosestStoresMultipleItems({
			items: this.state.userItems,
			latitude: latitude,
			longitude: longitude,
		});

		c.forEach((item, index) => {
			if (item.name.length > 13 + 3) {
				c[index].name = item.name.slice(0, 13) + "...";
			}
			c[index].itemsHeight = c[index].approximate_quantities.length * 45;
			if (c[index].itemsHeight > Dimensions.get("window").height * 0.35) {
				c[index].itemsHeight = Dimensions.get("window").height * 0.35;
			}
		});


		this.setState({ contents: c });
	}

	closeRoute = () => {
		this.setState({ routeVisible: false })
	}

	componentDidMount = async () => {
		await this.getItemListAndStates();
		await this.resetContents();
		
		this.setState({ loading: false });
	}

	render() {
		const { navigation } = this.props;
		var allItemsHeight = this.state.userItems.length * 45;
		const scrollEnabled = allItemsHeight > Dimensions.get("window").height * 0.39;

		if (scrollEnabled) {
			allItemsHeight = Dimensions.get("window").height * 0.39;
		}

		return (
			<ImageBackground source={require('../assets/images/background.png')} style={{width: '100%', height: '100%'}}>
				<View style={styles.main}>

					<PathRouter isVisible={this.state.routeVisible} closeModal={this.closeRoute} />

					<Modal isVisible={this.state.modalVisible} onBackdropPress={() => this.closeModal()} animationIn="slideInLeft" animationOut="slideOutLeft" backdropOpacity={0.55}>
						<View style={styles.modalContainer}>
							<View style={styles.modalTitleContainer}>
								<Text style={styles.modalTitle}>Edit your list</Text>
							</View>
							<Text style={styles.storeDistance}>Click an item to add or remove it from your list</Text>
							<View style={{flex: 1, marginTop: 10}}>
								<ScrollView>
								{
									Items.map((item, index) => (
										<TouchableOpacity
											key={index}
											state={this.state.itemStates[item]}
											style={[styles.modalItemContainer, {"backgroundColor": item in this.state.itemStates? "#7b85f4" : "#fff"}]}
											onPress={() => this.toggleItem(item)}>
											<Text style={[styles.modalItemText, 
														  {color: item in this.state.itemStates? "#fff": "#66c1e0"}]}>{item}</Text>
											<View key={this.state.itemStates[item]} style={[styles.checkButton, {"backgroundColor": item in this.state.itemStates? "#66c1e0": "0"}]}>
												{
													item in this.state.itemStates?
													<Icon name="check" size={23} color={"#fff"} />
													:
													<Feather name="plus" size={30} color="#66c1e0" />
												}
											</View>
										</TouchableOpacity>
									))
								}
								</ScrollView>
							</View>
							<View style={styles.navigateRowContainer}>
								<TouchableOpacity style={[styles.navigateButton, {width: "40%", backgroundColor: "#4cd6de"}]} onPress={() => this.closeModal()}>
									<Text style={{color: "#fff", fontWeight: "bold", fontSize: 17}}>I'm done!</Text>
								</TouchableOpacity>
								<TouchableOpacity style={[styles.navigateButton, {width: "40%"}]} onPress={() => this.pressClearList()}>
									<Text style={{color: "#4cd6de", fontWeight: "bold", fontSize: 17}}>Clear list</Text>
								</TouchableOpacity>
							</View>
				        </View>
					</Modal>



					<View style={styles.container}>
						<View style={styles.titleRow}>
							<Text style={styles.titleText}>Your List</Text>
							<TouchableOpacity style={styles.editListButton} onPress={() => this.setState({modalVisible: true})}>
								<Text style={styles.clearText}>Edit list</Text>
							</TouchableOpacity>
						</View>

						{
							this.state.userItems.length !== 0?
							<View>
							{
								this.state.contents.length !== 0?
								<View><Text style={styles.captionText}>Swipe through the best stores we found for the items you need</Text></View>
								:
								<View><Text style={styles.captionText}>There aren't reports for items on your list. Go out and add some!</Text></View>
							}

								<ViewPager style={styles.viewPager} initialPage={0} >

								<View key={0}>
									<View style={[styles.storeContainer, {backgroundColor: "#68ADEB"}]}>
									<View style={styles.storeInfoContainer} >
										<Text style={styles.storeName}>Items</Text>
										<Text style={styles.storeDistance}>Let us know what's in stock when you are finished</Text>
									</View>

										<ScrollView style={[styles.allItemsContainer, {paddingVertical: 10, height: allItemsHeight + 30}]}>

										{
											this.state.userItems.map((item, index) => (
												<View key={index} style={styles.itemContainer}>
													<Text style={[this.state.itemStates[item] === "true" ? styles.itemName : styles.itemNameDone]}>{item}</Text>

													<View style={styles.unitsAddContainer}>

														{
															this.state.itemStates[item] === "true" ?

															<TouchableOpacity style={styles.rightButton} onPress={this.submitData("", item)}>

																<LinearGradient
																	style={styles.buttonInner}
																	colors = {['#74d3dc', "#7e84f3"]}
																	start = {[0, 0.5]}
																	end = {[1, 0.5]}>
																	<Text style={styles.buttonText}>Add data</Text>
																</LinearGradient>

															</TouchableOpacity>

															:

															<View style={styles.rightButton}>
																<View style={[styles.buttonInner, {backgroundColor: "#aaa"}]}>
																	<Text style={styles.buttonText}>Done</Text>
																	<Icon name="check" size={18} color={"#fff"} />
																</View>
															</View>
														}
													</View>
												</View>
											))


										}
										</ScrollView>

									</View>
								</View>

								{
									this.state.contents.map((store, index) => (

										<View key={index + 1}>
											<View style={styles.storeContainer}>

												<View style={styles.topRowContainer}>

													<TouchableOpacity style={styles.storeInfoContainer} onPress={() => {
																											navigation.push('StoreScreen', {
																												store_id: store._id
																											})
																										}}>

														<Text style={styles.storeName}>{store.name}</Text>

														<Text style={styles.storeDistance}>{store.distance.toFixed(1)} miles away</Text>

													</TouchableOpacity>

													<View style={styles.percentageContainer}>
														<Text style={styles.percentageText}><Text style={{fontWeight: "bold"}}>{(store.stock_proportion * 100).toFixed(0)}%</Text><Text> of</Text></Text>
														<Text style={styles.percentageText}>your list</Text>
													</View>

												</View>


												<ScrollView style={[styles.allItemsContainer, {height: store.itemsHeight + 17 }]} >

													{
														store.approximate_quantities.map((item, index) => (

															<View key={index} style={styles.itemContainer}>
																<Text style={this.state.itemStates[item.item_name] === "true" ? styles.itemName : styles.itemNameDone}>{item.item_name}</Text>


																<View style={styles.unitsAddContainer}>
																	<Text style={this.state.itemStates[item.item_name] === "true" ? styles.itemName : styles.itemNameDone}>~ {item.quantity.toFixed(0)} units</Text>
																</View>
															</View>

														))
													}

												</ScrollView>

												<View style={styles.navigateRowContainer}>
													<TouchableOpacity style={styles.navigateButton} onPress={() => this.openMapsApp(store.coordinates[0], store.coordinates[1], store.name)}>
														<Text style={{color: "#4cd6de", fontWeight: "bold", fontSize: 17}}>Navigate</Text>
														<Ionicons name="md-navigate" size={17} color="#4cd6de" />
													</TouchableOpacity>
												</View>

											</View>
										</View>


									))
								}

								</ViewPager>
							</View>
							:
							<View>
								{
									this.state.userItems.length === 0 ?
									<Text style={styles.captionText}>Looks like nothing's here! Add some items to your list to get started!</Text>
									:
									<Text style={styles.captionText}>No stores nearby reported with items on your list</Text>
								}
							</View>
						}
					</View>
				</View>
			</ImageBackground>
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
		backgroundColor: "#d8f4f6",
		borderRadius: 30,
		marginTop: "15%",
		paddingTop: "8%",
		paddingBottom: "1%",
		height: "90%",
		width: "90%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.25,
		elevation: 7,
	},
	modalContainer: {
		width: Dimensions.get("window").width*0.90,
		height: Dimensions.get("window").height*0.70,
		borderRadius: 30,
		backgroundColor: "#68ADEB",
		paddingTop: "5%",
		paddingHorizontal: "5%",
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
	modalItemContainer: {
		width: "100%",
		marginVertical: 5,
		height: 57,
		borderRadius: 30,
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: "5%",
	},
	modalItemText: {
		fontWeight: "bold",
		fontSize: 17,
	},
	checkButton: {
		height: 35,
		width: 35,
		borderRadius: 17.5,
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "space-around",
	},
	titleRow: {
		flexDirection: "row",
		justifyContent: "space-between"
	},
	titleText: {
		fontWeight: "bold",
		marginHorizontal: "5%",
		fontSize: 30,
		color: "#52c4e3",
	},
	editListButton: {
		backgroundColor: "#68ADEB",
		borderRadius: 25,
		height: "110%",
		width: "25%",
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginRight: "5%",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 3,
		shadowOpacity: 0.15,
		elevation: 7,
	},
	clearText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	captionText: {
		color: "#52c4e3",
		fontSize: 22,
		marginTop: "5%",
		marginBottom: "2%",
		marginHorizontal: "5%",
	},
	viewPager: {
		height: "90%",
		marginTop: 10,
	},
	storeContainer: {
		backgroundColor: "#52c4e3",
		marginHorizontal: "5%",
		width: "90%",
		borderRadius: 35,
		paddingHorizontal: "5%",
		paddingTop: "5%",
		paddingBottom: "3%",
		shadowColor: "#000",
		marginBottom: 20,
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.25,
		elevation: 7,
		// flex: 1,
	},
	topRowContainer: {
		width: "100%",
		height: 70,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	storeInfoContainer: {
		flexDirection: "column",
		justifyContent: "space-between",
		paddingVertical: 5,
	},
	storeName: {
		color: "#fff",
		fontSize: 22,
		fontWeight: "bold",
	},
	storeDistance: {
		color: "#fff",
		fontSize: 18,
	},
	percentageContainer: {
		backgroundColor: "#fff",
		paddingVertical: 13,
		height: "100%",
		width: "35%",
		flexDirection: "column",
		justifyContent: "space-between",
		borderRadius: 25,
		alignItems: "center",
	},
	nothing: {
		color: "white",
		fontSize: 18,
	},
	percentageText: {
		fontSize: 17,
		color: "#52C4E3",
	},
	allItemsContainer: {
		backgroundColor: "#fff",
		borderRadius: 25,
		marginTop: 10,
		width: "100%",
	},
	itemContainer: {
		height: 45,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: "5%",
	},
	itemName: {
		fontWeight: "bold",
		fontSize: 17,
		color: "#52C4E3",
	},
	itemNameDone: {
		fontWeight: "bold",
		fontSize: 17,
		color: "#aaa",
		textDecorationLine: 'line-through',
	},
	unitsAddContainer: {
		flexDirection: "row",
		height: "100%",
		alignItems: "center",
	},
	rightButton: {
		height: "75%",
		width: 80,
		borderRadius: 30 / 2,
	},
	buttonInner: {
		height: "100%",
		width: "100%",
		borderRadius: 17,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		paddingHorizontal: 5,
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 12,
	},
	navigateRowContainer: {
		flexDirection: "row",
		marginTop: 18,
		justifyContent: "space-around",
		alignItems: "center",
		height: 43
	},
	navigateButton: {
		backgroundColor: "#fff",
		width: "48%",
		paddingHorizontal: "5%",
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