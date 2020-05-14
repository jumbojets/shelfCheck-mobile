import { Alert, AsyncStorage } from 'react-native';

const GetCurrentLocation = async () => {
	var latitude;
	var longitude;

	try {
		latitude = parseFloat(await AsyncStorage.getItem("latitude"));
		longitude = parseFloat(await AsyncStorage.getItem("longitude"));
	} catch (error) {
		Alert.alert("Error", "Unable to get stored location from device");
	}

	return { latitude: latitude, longitude: longitude }
}

export default GetCurrentLocation;