import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StoreScreen from './StoreScreen'

import { MonoText } from '../components/StyledText';

import GetClosestStores from '../api/GetClosestStores';

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
		const latitude = 35.82;
		const longitude = -78.77;

		var c = await GetClosestStores({latitude: latitude, longitude: longitude});
		this.setState({ contents: c });
		this.setState({ loading: false });
	}

	render() {
		const { navigation } = this.props;
		return (
			<View style={styles.main}>
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
									<Text style={styles.distanceText}>{item.distance.toFixed(2)} miles away</Text>
								</TouchableOpacity>
							))
						}

					</ScrollView>
				</View>
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
		top: "3%",
		textAlign: "center",
	},
	container: {
		backgroundColor: '#7999ed',
		paddingTop: 0,
		paddingHorizontal: 20,
		paddingBottom: 0,
		borderRadius: 20,
		marginHorizontal: "5%",
		marginTop: "15%",
		height: "90%",
  	},
  	storeButton: {
  		marginTop: 27,
  		height: 100,
  		backgroundColor: "#fff",
  		borderRadius: 25,
  		flexDirection: "column",
  		justifyContent: "space-evenly"
  	},
  	storeNameText: {
  		color: "#7e84f3",
  		left: "6%",
  		fontSize: 20
  	},
  	addressText: {
  		color: "#7e84f3",
  		left: "6%",
  		fontSize: 15
  	},
  	distanceText: {
  		color: "#7e84f3",
  		left: "6%",
  	},
});
