import * as React from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';

import GetClosestStoresSingleItem from '../api/GetClosestStoresSingleItem';

export default class ItemScreen extends React.Component {
	state = { contents: [], loading: true, item_name: "", addedToList: false };

	async componentDidMount() {
		const { item_name } = this.props.route.params;

		this.setState({item_name: item_name});

		const latitude = 35.82;
		const longitude = -78.77;

		const c = await GetClosestStoresSingleItem({item_name: item_name, latitude: latitude, longitude: longitude});

		this.setState({ contents: c });
		this.setState({ loading: false });
	}

	toggleItem = () => {
		this.setState({ addedToList : !this.state.addedToList });
	};

	render() {
		const { navigation } = this.props;

		return (
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
									<Text style={styles.bottomRowText}>0.6 miles away</Text>
									<Text style={styles.bottomRowText}>14 min ago</Text>
								</View>

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
		flex: 1,
		flexDirection: "column",
		backgroundColor: "#fff",
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
	},
	addButtonInactive: {
		height: "7%",
		width: 175,
		backgroundColor: "#fff",
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "center",
		borderRadius: 25,
	},
	addButtonActive: {
		height: "7%",
		width: 175,
		backgroundColor: "#4cd6de",
		alignItems: "center",
		flexDirection: "column",
		justifyContent: "center",
		borderRadius: 25,
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
		marginTop: "0%",
		flexDirection: "column",
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	storeButton: {
		height: "16%",
		width: "100%",
		backgroundColor: "#fff",
		borderRadius: 25,
		paddingHorizontal: 25,
		paddingVertical: 12,
		flexDirection: "column",
		justifyContent: "space-around",
	},
	rowContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	topRowText: {
		color: "#4cd6de",
		fontSize: 17,
		fontWeight: "bold",
	},
	bottomRowText: {
		color: "#4cd6de",
		fontSize: 15,
		fontWeight: "bold",
	},
});