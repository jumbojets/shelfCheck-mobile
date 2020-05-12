import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Dimensions } from 'react-native';

import { MonoText } from '../components/StyledText';

import GetStoreData from '../api/GetStoreData';

export default class StoreScreen extends React.Component {
	state = {contents: {}, loading: true}

	async componentDidMount() {
		const { route } = this.props;
		const { store_id } = route.params;

		const latitude = 35.82;
		const longitude = -78.77;

		var c = await GetStoreData({store_id: store_id, latitude: latitude, longitude: longitude});

		this.state.contents = {};
		this.setState({ contents: c});
		this.setState({ loading: false});
	}

	render() {
		const { navigation } = this.props;
		try {
			this.state.contents.distance = this.state.contents.distance.toFixed(2);
		} catch {

		}
		return (
			<View style={styles.main}>
				<View style={styles.container}>
					<TouchableOpacity style={styles.backbutton} onPress={() => navigation.goBack()}>
						<Icon name="arrow-left" size={30} color={"#fff"} />
					</TouchableOpacity>
					<View style={styles.storeDetails}>
						<Text style={styles.name}>{this.state.contents.name}</Text>
						<TouchableOpacity onPress={() => Alert.alert("this will open maps application")}>
							<Text style={{color: "#fff"}}>{this.state.contents.address}</Text>
							<Text style={{color: "#fff"}}>{this.state.contents.distance} miles away</Text>
							<Text style={{color: "#fff"}}>Click to Navigate</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.inventory}>
						<Text style={styles.name}>Inventory</Text>
						<Text style={styles.inventoryDescription}>According to user reports, these are estimated quantities of items left.</Text>
						<Text style={styles.inventoryDescription}>Click on an item for more information.</Text>
						{
							this.state.contents.numberOfItems === 0 || this.state.loading ?
							<Text style={{color: "#fff"}}>No reports of items in stock.</Text>
							:
							this.state.contents.inventory.map((item, index) => (
								<TouchableOpacity style={styles.itemContainer}>
									<Text style={styles.item}>{item.item_name} ~ {item.approximate_quantity} units</Text>
								</TouchableOpacity>
							))
						}
					</View>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		flexDirection: "column",
		backgroundColor: '#e8eff1',
		justifyContent: "space-evenly",
		alignItems: "center",
		height: "100%",
		width: "100%",
	},
	container: {
		width: "90%",
		height: "80%",
		backgroundColor: "#7e84f3",
		borderRadius: 20,
		padding: "5%",
		marginTop: "20%",
		marginBottom: "10%",
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
		height: 0.14 * Dimensions.get('window').height,
		marginTop: "5%",
		paddingHorizontal: "5%",
		backgroundColor: "#66c1e0",
		borderRadius: 15,
		flexDirection: "column",
		justifyContent: "space-evenly",
	},
	inventory: {
		marginTop: "5%",
		borderRadius: 15,
		paddingHorizontal: "5%",
		paddingTop: "5%",
		backgroundColor: "#66c1e0",
		paddingBottom: "5%",
		marginBottom: "5%"
	},
	inventoryDescription: {
		color: "#fff",
		marginTop: 3,
	},
	name: {
		color: "#fff",
		fontSize: 22,
		fontWeight: "bold",
	},
	itemContainer: {
		paddingTop: 6,
	},
	item: {
		color: "#fff",
		fontSize: 20,
	}
});