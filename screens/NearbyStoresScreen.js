import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StoreScreen from './StoreScreen'

import { MonoText } from '../components/StyledText';

import GetClosestStores from '../api/GetClosestStores';
import GetCurrentLocation from '../api/GetCurrentLocation';

const Stack = createStackNavigator();

export default function NearbyStoresPage() {
	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator screenOptions={{headerShown: false}}>
				<Stack.Screen name="MainScreen" component={NearbyStoresScreen} />
				<Stack.Screen name="StoreScreen" component={StoreScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export class NearbyStoresScreen extends React.Component {
	state = {contents: [], loading: true};

	async componentDidMount() {
		const { latitude, longitude } = await GetCurrentLocation();

		var c = await GetClosestStores({latitude: latitude, longitude: longitude});
		this.setState({ contents: c });
		this.setState({ loading: false });
	}

	render() {
		const { navigation } = this.props;
		return (
			<View style={styles.main}>
				<ImageBackground source={require('../assets/images/background-2.png')} style={{width: '100%', height: '100%'}}>
					<View style={styles.container}>
						<Text style={styles.title}>Closest stores to you</Text>
						<ScrollView showsVerticalScrollIndicator={false} style={{padding: 0, marginTop: "7%"}}>
							{
								this.state.contents.map((item, index) => (
									<TouchableOpacity
										onPress={() =>
											navigation.push('StoreScreen', {
												store_id: item._id
											})
										}
										key={item._id}
										style={styles.storeButton}
									>
										<Text style={styles.storeNameText}>{item.name}</Text>
										<Text style={styles.addressText}>{item.address}</Text>
										<Text style={styles.distanceText}>{item.distance.toFixed(1)} miles away</Text>
									</TouchableOpacity>
								))
							}

						</ScrollView>
					</View>
				</ImageBackground>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		backgroundColor: '#e8eff1',
		height: "100%",
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		color: "#fff",
		top: "3.5%",
		textAlign: "center",
	},
	container: {
		backgroundColor: '#7256f3',
		paddingTop: 0,
		paddingHorizontal: 0,
		paddingBottom: 0,
		borderRadius: 30,
		marginHorizontal: "5%",
		marginTop: "15%",
		height: "90%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.29,
		elevation: 7,
  	},
  	storeButton: {
  		marginTop: 15,
  		height: 100,
  		backgroundColor: "#fff",
  		borderRadius: 25,
  		flexDirection: "column",
  		justifyContent: "space-evenly",
  		shadowOffset: {
	    	width: 0,
	    	height: 4,
	    },
	    shadowRadius: 4.7,
	    shadowOpacity: 0.3,
	    elevation: 8,
	    marginHorizontal: 20,
  	},
  	storeNameText: {
  		color: "#4524AC",
  		fontWeight: "bold",
  		left: "9%",
  		fontSize: 18
  	},
  	addressText: {
  		color: "#693CE1",
  		left: "9%",
  		fontSize: 15
  	},
  	distanceText: {
  		color: "#693CE1",
  		left: "9%",
  	},
});
