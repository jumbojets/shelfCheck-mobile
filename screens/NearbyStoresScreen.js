import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';


import { MonoText } from '../components/StyledText';

import GetClosestStores from '../api/GetClosestStores';

export default class NearbyStoresScreen extends React.Component {
	state = {contents: [], loading: true};

	async componentDidMount() {
		const latitude = 35.82;
		const longitude = -78.77;

		var c = await GetClosestStores({latitude: latitude, longitude: longitude});
		this.setState({ contents: c });
		this.setState({ loading: false });
	}

	render() {
		return (
			<View style={styles.main}>
				<View style={styles.container}>
					<ScrollView showsVerticalScrollIndicator={false}>
						{
							this.state.contents.map((item, index) => (
								<TouchableOpacity
									onPress={() => Alert.alert("CLICKED", item._id)}
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
			</View>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		//backgroundColor: '#66c1e0',
		backgroundColor: '#e8eff1',
		height: "100%",
	},
	container: {
		flex: 1,
		//backgroundColor: '#e8eff1',
		backgroundColor: '#66c1e0',
		paddingTop: 0,
		paddingHorizontal: 20,
		paddingBottom: 0,
		borderRadius: 30,
		margin: "5%",
  	},
  	storeButton: {
  		marginTop: 27,
  		height: 100,
  		backgroundColor: "#7e84f3",
  		borderRadius: 25,
  		flexDirection: "column",
  		justifyContent: "space-evenly"
  	},
  	storeNameText: {
  		color: "#fff",
  		left: "6%",
  		fontSize: 20
  	},
  	addressText: {
  		color: "#fff",
  		left: "6%",
  		fontSize: 15
  	},
  	distanceText: {
  		color: "#fff",
  		left: "6%",
  	},
});
