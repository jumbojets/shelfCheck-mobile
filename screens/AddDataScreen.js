import { Text, StyleSheet, View, TouchableOpacity, Alert, Picker, AsyncStorage } from 'react-native';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { MonoText } from '../components/StyledText';
import GetClosestStores from '../api/GetClosestStores';
import AppendCrowdsourcedData from '../api/AppendCrowdsourcedData';
import GetCurrentLocation from '../api/GetCurrentLocation';

import { Select, SelectItem, Toggle, Input } from '@ui-kitten/components';

const items = ['Batteries', 'Bottled Water', 'Bread', 'Diapers', 'Detergent', 'Disinfectant Spray', 'Disinfectant Wipes', 'Eggs',
			   'Flashlights', 'Flour', 'Garbage Bags', 'Ground Beef', 'Hand Sanitizer', 'Hand Soap', 'Masks', 'Milk', 'Paper Towels', 'Toilet Paper'];

export default class AddDataScreen extends React.Component {
	state = {contents: [], loading: true, 
			 selectedStoreIndex: 0, selectedItemIndex: 0,
			 selectedStore: "", selectedItem: "", 
			 checked: true, quantity: "", itemPickerLocked: false
			};

	changeQuantity = (nextValue) => {
		if (isNaN(nextValue) || parseInt(nextValue) < 1 || parseInt(nextValue) > 100) {
			Alert.alert("Incorrect format", "Quantity must be an integer between 1 and 100");
		}
		this.setState({quantity: nextValue});
	}

	async componentDidMount() {
		const { latitude, longitude } = await GetCurrentLocation();

		var c = await GetClosestStores({latitude: latitude, longitude: longitude});

		const { defaultStore, defaultItem } = this.props.route.params;

		if (defaultItem !== "") {
			this.setState({selectedItem: defaultItem});
			this.setState({selectedItemIndex: items.indexOf(defaultItem) + 1});
			this.setState({itemPickerLocked: true})
		}

		this.setState({ contents: c });
		this.setState({ loading: false });

		this.setState({ selectedStore: c[0].name})
		this.setState({ selectedStoreIndex: 0})
	}

	submitData = async () => {
		const { navigation } = this.props;

		if (this.state.selectedStore === "") {
			Alert.alert("Please select a store!");
			return;
		}

		if (this.state.selectedItem === "") {
			Alert.alert("Please select an item!");
			return;
		}

		if (this.state.checked && this.state.quantity === "") {
			Alert.alert("Please enter a quantity!");
			return;
		}

		if (this.state.selectedStoreIndex === 0) {
			this.state.selectedStoreIndex = 1;
		}

		console.log(this.state.selectedStoreIndex)

		const contents = {
			inventory_id: this.state.contents[this.state.selectedStoreIndex - 1].inventory_id,
			item_name: items[this.state.selectedItemIndex - 1],
			in_stock: this.state.checked,
			quantity: parseInt(this.state.quantity),
		}

		AppendCrowdsourcedData(contents);

		try {
			await AsyncStorage.setItem(this.state.selectedItem, "done");
		} catch {
			Alert.alert("Error", "Problem setting state as done");
		}

		navigation.goBack();
	}

	render() {
		const { navigation } = this.props;
		return (
			<View style={styles.main}>
				<View style={styles.container}>
					<LinearGradient style={styles.container2}
						colors = {['#74d3dc', "#7e84f3"]}
						start = {[0, 0.5]}
	              		end = {[1, 0.5]}>

							<View>

								<View style={styles.topRow}>

									<Text style={styles.title}>Add Inventory Data</Text>

									<TouchableOpacity style={styles.backbutton} onPress={() => navigation.goBack()}>
										<Icon name="arrow-left" size={30} color={"#ffff"} />
									</TouchableOpacity>

								</View>

								<Text style={styles.description}>Lend a hand by estimating what's in stock</Text>
							</View>

							<View style={styles.formContainer}>

								<View style={styles.selectContainer}>

									<Select
										value={this.state.selectedStore}
										placeholder="Select a store"
										selectedIndex={this.state.selectedStoreIndex}
										style={{ width: "95%" }}
										onSelect={(index) => {
											this.setState({selectedStoreIndex: index});
											this.setState({selectedStore: this.state.contents[index.row].name})
										}} >

										{
											this.state.contents.map((item, index) => (
												<SelectItem key={index} title={item.name + " | " + item.distance.toFixed(1) + " miles"} />
											))
										}

									</Select>

								</View>

								<View style={styles.selectContainer}>

									<Select
										placeholder="Select an item"
										selectedIndex={this.state.selectedItemIndex}
										disabled={this.state.itemPickerLocked}
										value={this.state.selectedItem}
										style={{ width: "95%" }}
										onSelect={(index) => {
											this.setState({selectedItemIndex: index});
											this.setState({selectedItem: items[index.row]});
										}} >


										{
											items.map((item, index) => (
												<SelectItem key={index} title={item} />
											))
										}

									</Select>

								</View>

								<View style={styles.captionedContainer}>

									<Text style={styles.caption}>Is it in stock?</Text>

									<Toggle checked={this.state.checked} onChange={() => this.setState({checked: !this.state.checked})} />

								</View>

								

								<View style={styles.captionedContainer}>
									<Text style={styles.caption}>Approximate quantity?</Text>
									<Input
										placeholder='----'
										disabled={!this.state.checked}
										value={this.state.quantity}
										onChangeText={this.changeQuantity}
										size="medium"
									/>
								</View>


							</View>

						<View style={{height:"5%"}} />


						<TouchableOpacity style={styles.submitButton} onPress={this.submitData}>

							<Text style={styles.submitText}>Submit</Text>

						</TouchableOpacity>
						
					</LinearGradient>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	main: {
		flexDirection: "column",
		backgroundColor: '#e8eff1',
		justifyContent: "space-around",
		alignItems: "center",
		height: "100%",
		width: "100%",
	},
	container: {
		width: "90%",
		height: "85%",
		borderRadius: 30,
		marginTop: "5%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.29,
		elevation: 7,
	},
	container2: {
		width: "100%",
		height: "100%",
		borderRadius: 30,
		flexDirection: "column",
		paddingTop: "5%",
		justifyContent: "space-around",
		paddingHorizontal: "5%",
	},
	topRow: {
		flexDirection: "row",
		justifyContent: "space-between"
	},
	backbutton: {
		height: 40,
		width: 40,
		borderRadius: 25,
		backgroundColor: "#fff5",
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
	title: {
		fontSize: 27,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: "5%",
	},
	description: {
		color: "#fff",
		fontSize: 20,
		marginVertical: "0%",
	},
	formContainer: {
		backgroundColor: "#fff5",
		borderRadius: 25,
		flexDirection: "column",
		justifyContent: "space-evenly",
		paddingHorizontal: "5%",
		height: "50%",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.25,
		elevation: 7,
	},
	selectContainer: {
		width: "100%",
		borderRadius: 25,
		flexDirection: "row",
		justifyContent: "space-evenly",
		alignItems: "center",
	},
	captionedContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		height: 40,
		marginHorizontal: "4%",
		borderRadius: 25,
	},
	caption: {
		fontSize: 16,
		color: "#fff",
	},
	submitButton: {
		width: "100%",
	    height: "10%",
	    backgroundColor: "#fff5",
	    borderRadius: 45,
	    flexDirection: "column",
	    justifyContent: "space-evenly",
	    shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowRadius: 4.65,
		shadowOpacity: 0.25,
		elevation: 7,
	},
	submitText: {
		color: "#fff",
	    fontSize: 23,
	    fontWeight: "bold",
	    textAlign: "center",
	}
});