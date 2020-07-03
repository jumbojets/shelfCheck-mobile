import * as React from 'react';
import { Alert } from 'react-native';

import keys from './keys.config';

const ROUTE = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

const finishEndpoint = ({longitude, latitude}) => {
	return ROUTE + longitude.toString() + ',' + latitude.toString() + '.json?types=address&access_token=' + keys.mapbox;
};

const API = async ({contents, onSuccess, onFailure, onError}) => {
	const endpoint = finishEndpoint(contents);
	return fetch(endpoint)
		.then((response) => {
			if (response.status == 200) return response.json();
			else return onFailure(response);
		})
		.catch((err) => {
			console.log("[MAPBOX API] Error: ", err);
			return onError(err);
		})
};

const ReverseGeocode = async (longitude, latitude) => {
	const contents = {
		longitude: longitude,
		latitude: latitude
	};

	const onSuccess = (c) => (c);

	const onFailure = (c) => {
		Alert.alert("Failure", "There was a problem getting current app data from the server");
	};

	const onError = (c) => {
		Alert.alert("Error", "There was a problem getting current app data from the server");
	};

	var resp = await API({
		contents: contents,
		onSuccess: onSuccess,
		onFailure: onFailure,
		onError: onError,
	});

	// need better contigency lets say if it does not exist

	var address = resp.features[0].place_name;

	address = address.split(' ').slice(0, -3).join(' ').replace('North Carolina', 'NC');

	return address;
};

export default ReverseGeocode;