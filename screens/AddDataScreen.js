import { Text, StyleSheet, View, TouchableOpacity, Alert, Picker } from 'react-native';
import * as React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

import { Dimensions } from 'react-native';

import { MonoText } from '../components/StyledText';
import GetClosestStores from '../api/GetClosestStores';
import AppendCrowdsourcedData from '../api/AppendCrowdsourcedData';

import { Select, SelectItem, Toggle, Input } from '@ui-kitten/components';

var items = ["Bread", "Toilet Paper"];

export default class AddDataScreen extends React.Component {
	state = {contents: [], loading: true, 
			 selectedStoreIndex: 0, selectedItemIndex: 0,
			 selectedStore: "", selectedItem: "", 
			 checked: true, quantity: "",
			};

	changeQuantity = (nextValue) => {
		if (isNaN(nextValue) || parseInt(nextValue) < 1 || parseInt(nextValue) > 100) {
			Alert.alert("Incorrect format", "Quantity must be an integer between 1 and 100");
		}
		this.setState({quantity: nextValue});
	}

	async componentDidMount() {
		const latitude = 35.82;
		const longitude = -78.77;

		var c = await GetClosestStores({latitude: latitude, longitude: longitude});
		this.setState({ contents: c });
		this.setState({ loading: false });
	}

	submitData = () => {
		const { navigation } = this.props;

		const contents = {
			inventory_id: this.state.contents[this.state.selectedStoreIndex].inventory_id,
			item_name: items[this.state.selectedItemIndex],
			in_stock: this.state.checked,
			quantity: parseInt(this.state.quantity),
		}

		AppendCrowdsourcedData(contents);

		navigation.goBack();
	}

	render() {
		const { navigation } = this.props;
		return (
			<View style={styles.main}>
				<LinearGradient style={styles.container}
					colors = {['#74d3dc', "#7e84f3"]}
					start = {[0, 0.5]}
              		end = {[1, 0.5]}>

              		<View>
						<TouchableOpacity style={styles.backbutton} onPress={() => navigation.goBack()}>
							<Icon name="arrow-left" size={30} color={"#ffff"} />
						</TouchableOpacity>


						<Text style={styles.title}>Add Inventory Data</Text>

						<View style={styles.formContainer}>

							<View style={styles.selectContainer}>

								<Select
									value={this.state.selectedStore}
									placeholder="Select a store"
									selectedIndex={this.state.selectedStoreIndex}
									style={{ width: "95%" }}
									onSelect={(index) => {
										this.setState({selectedStoreIndex: index - 1});
										this.setState({selectedStore: this.state.contents[index - 1].name})
									}} >

									{
										this.state.contents.map((item, index) => (
											<SelectItem key={index} title={item.name + " | " + item.distance.toFixed(2) + " miles"} />
										))
									}

								</Select>

							</View>

							<View style={styles.selectContainer}>

								<Select
									placeholder="Select an item"
									selectedIndex={this.state.selectedItemIndex}
									value={this.state.selectedItem}
									style={{ width: "95%" }}
									onSelect={(index) => {
										this.setState({selectedItemIndex: index - 1});
										this.setState({selectedItem: items[index - 1]});
									}} >

									<SelectItem title="Bread" />
									<SelectItem title="Toilet Paper" />
								</Select>

							</View>

							<View style={styles.captionedContainer}>

								<Text style={styles.caption}>Is it in stock?</Text>

								<Toggle checked={this.state.checked} onChange={() => this.setState({checked: !this.state.checked})} />

							</View>

							

							<View style={styles.captionedContainer}>
								<Text style={styles.caption}>Approximate Quantity?</Text>
								<Input
									placeholder='--'
									disabled={!this.state.checked}
									value={this.state.quantity}
									onChangeText={this.changeQuantity}
								/>
							</View>


						</View>
					</View>

					<TouchableOpacity style={styles.submitButton} onPress={this.submitData}>

						<Text style={styles.submitText}>Submit</Text>

					</TouchableOpacity>
					
				</LinearGradient>
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
		flexDirection: "column",
		flex: 1,
		justifyContent: "space-between",
	},
	backbutton: {
		height: 40,
		width: 40,
		borderRadius: 25,
		backgroundColor: "#0000",
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: "center",
	},
	title: {
		marginVertical: "5%",
		fontSize: 30,
		fontWeight: "bold",
		color: "#fff",
	},
	formContainer: {
		backgroundColor: "#fffc",
		borderRadius: 25,
		flexDirection: "column",
		justifyContent: "space-evenly",
		height: "70%",
		paddingHorizontal: "5%",
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
		height: 60,
		marginHorizontal: "4%",
		borderRadius: 25,
	},
	caption: {
		fontSize: 15,
		color: "#0008",
	},
	submitButton: {
		width: "100%",
	    height: "12%",
	    backgroundColor: "#fffc",
	    borderRadius: 25,
	    flexDirection: "column",
	    justifyContent: "space-evenly",
	},
	submitText: {
		color: "#7e84f3",
	    fontSize: 23,
	    fontWeight: "bold",
	    textAlign: "center",
	}
});