import { Text, StyleSheet, View, TouchableOpacity, Alert, Dimensions, ImageBackground } from 'react-native';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';

import GetStoreData from '../api/GetStoreData';
import GetCurrentLocation from '../api/GetCurrentLocation';

export default class StoreScreen extends React.Component {
	state = {contents: {}, loading: true}

	async componentDidMount() {
		const { route } = this.props;
		const { store_id } = route.params;

		const { latitude, longitude } = await GetCurrentLocation();

		var c = await GetStoreData({store_id: store_id, latitude: latitude, longitude: longitude});

		this.state.contents = {};
		this.setState({ contents: c});
		this.setState({ loading: false});
	}

	render() {
		const { navigation } = this.props;
		try {
			this.state.contents.distance = this.state.contents.distance.toFixed(1);
		} catch {

		}
		return (
			<View style={styles.main}>
				<ImageBackground source={require('../assets/images/background.png')} style={{width: '100%', height: '100%'}}>
					<View style={styles.main}>
						<View style={styles.container}>
							<View style={styles.nameContainer}>
								<Text style={styles.name}>{this.state.contents.name}</Text>
								<TouchableOpacity style={styles.backbutton} onPress={() => navigation.goBack()}>
									<Icon name="arrow-left" size={30} color={"#fff"} />
								</TouchableOpacity>
							</View>
							<View style={styles.storeDetails}>
								<Text style={styles.title}>Details</Text>
								<TouchableOpacity onPress={() => Alert.alert("this will open maps application")}>
									<Text style={{color: "#fff", fontSize: 16}}>{this.state.contents.address}</Text>
									<Text style={{color: "#fff", fontSize: 16}}>{this.state.contents.distance} miles away</Text>
									<Text style={{color: "#fff", fontSize: 16}}>Click to Navigate</Text>
								</TouchableOpacity>
							</View>
							<View style={styles.inventory}>
								<Text style={styles.title}>Inventory</Text>
								<Text style={styles.inventoryDescription}>According to user reports, these are estimated quantities of items left.</Text>
								<Text style={styles.inventoryDescription}>Click on an item for more information.</Text>
								<ScrollView>
								{
									this.state.contents.numberOfItems === 0 || this.state.loading ?

									<Text style={{color: "#fff", fontSize: 20}}>No reports of items in stock.</Text>
									:
									this.state.contents.inventory.map((item, index) => (
										<TouchableOpacity key={index} style={styles.itemContainer}>
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
		backgroundColor: "#7e84f3",
		borderRadius: 20,
		padding: "5%",
		marginTop: "20%",
		marginBottom: "10%",
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
		backgroundColor: "#66c1e0",
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: "center",
	},
	storeDetails: {
		height: "25%",
		marginTop: "5%",
		paddingHorizontal: "5%",
		backgroundColor: "#66c1e0",
		borderRadius: 15,
		flexDirection: "column",
		justifyContent: "space-evenly",
	},
	inventory: {
		marginTop: "5%",
		height: "80%",
		borderRadius: 15,
		paddingHorizontal: "5%",
		paddingTop: "5%",
		backgroundColor: "#66c1e0",
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
		borderRadius: 15,
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
	}
});