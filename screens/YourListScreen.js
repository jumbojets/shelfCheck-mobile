import { Text, View, StyleSheet, ImageBackground, TouchableOpacity, Alert, AsyncStorage } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

import ViewPager from '@react-native-community/viewpager';

import AddDataScreen from './AddDataScreen';

const Stack = createStackNavigator();

export default function YourListPage() {
	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator screenOptions={{headerShown: false}}>
				<Stack.Screen name="MainScreen" component={YourListScreen} />
				<Stack.Screen name="AddDataScreen" component={AddDataScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const items = ['Batteries', 'Bottled Water', 'Bread', 'Diapers', 'Disinfectant Wipes', 'Eggs', 'Flashlights', 'Garbage Bags',
			   'Ground Beef', 'Hand Sanitizer', 'Hand Soap', 'Masks', 'Milk', 'Paper Towels', 'Toilet Paper'];

export class YourListScreen extends React.Component {

	clearList = () => {
		items.forEach(async (item, index) => {
			await AsyncStorage.removeItem(item);
		});
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

	getItemList = () => {
		var items = [];
		items.forEach(async (item, index) => {

		});
	}

	openMapsApp = () => {

	}

	componentDidMount = async () => {

	}

	render() {
		return (
			<View style={{flex: 1}}>
				<ImageBackground source={require('../assets/images/background.png')} style={{width: '100%', height: '100%'}}>
					<View style={styles.main}>
						<View style={styles.container}>
							<View style={styles.titleRow}>
								<Text style={styles.titleText}>Your List</Text>
								<TouchableOpacity style={styles.clearListButton} onPress={this.pressClearList}>
									<Text style={styles.clearText}>Clear list</Text>
								</TouchableOpacity>
							</View>
							<Text style={styles.captionText}>Swipe through the best stores we found for the items you need</Text>

							<ViewPager style={styles.viewPager} initialPage={0} showPageIndicator={true}>


								<View key="1">
									<View style={styles.storeContainer}>

										<View style={styles.topRowContainer}>

											<TouchableOpacity style={styles.storeInfoContainer}>

												<Text style={styles.storeName}>Taylor Farm</Text>

												<Text style={styles.storeDistance}>1.4 miles away</Text>

											</TouchableOpacity>

											<View style={styles.percentageContainer}>
												<Text style={styles.percentageText}><Text style={{fontWeight: "bold"}}>75%</Text><Text> of</Text></Text>
												<Text style={styles.percentageText}>your list</Text>
											</View>

										</View>


										<View style={styles.allItemsContainer}>

											<View style={styles.itemContainer}>
												<Text style={styles.itemName}>Bread</Text>


												<View style={styles.unitsAddContainer}>
													<Text style={styles.itemName}>~10 units</Text>

													<TouchableOpacity style={styles.icon}>

														<LinearGradient
															style = {{height: "100%", width: "100%", borderRadius:15, flexDirection: "row", justifyContent: "space-around", alignItems: "center"}}
															colors = {['#74d3dc', "#7e84f3"]}
															start = {[0, 0.5]}
															end = {[1, 0.5]}>
															<Feather name="plus" size={26} color="#fff" />
														</LinearGradient>


													</TouchableOpacity>
												</View>
											</View>

										</View>

										<View style={styles.navigateRowContainer}>
											<TouchableOpacity style={styles.navigateButton} onPress={() => this.openMapsApp()}>
												<Text style={{color: "#4cd6dE", fontWeight: "bold", fontSize: 17}}>Navigate</Text>
												<Ionicons name="md-navigate" size={17} color="#4cd6dE" />
											</TouchableOpacity>
										</View>

									</View>
								</View>

							</ViewPager>

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
		backgroundColor: "#d8f4f6",
		borderRadius: 30,
		marginTop: "15%",
		paddingTop: "8%",
		paddingBottom: "5%",
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
	clearListButton: {
		backgroundColor: "#52c4e3",
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
		marginVertical: "3%",
		marginHorizontal: "5%",
	},
	viewPager: {
		height: "100%",
		marginTop: 10,
	},
	storeContainer: {
		backgroundColor: "#52c4e3",
		marginHorizontal: "5%",
		width: "90%",
		borderRadius: 35,
		padding: "5%",
		paddingBottom: "6%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.25,
		elevation: 7,
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
	percentageText: {
		fontSize: 17,
		color: "#52C4E3",
	},
	allItemsContainer: {
		backgroundColor: "#fff",
		borderRadius: 25,
		marginVertical: 20,
		width: "100%",
	},
	itemContainer: {
		height: 50,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: "5%",
	},
	itemName: {
		fontWeight: "normal",
		fontSize: 17,
		color: "#52C4E3",
	},
	unitsAddContainer: {
		flexDirection: "row",
		height: "100%",
		alignItems: "center",
	},
	icon: {
		marginLeft: 8,
		height: 30,
		width: 30,
		borderRadius: 30 / 2,
	},
	navigateRowContainer: {
		flexDirection: "row",
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