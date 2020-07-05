import * as React from 'react';
import { Alert } from 'react-native';

import keys from './keys.config';

const ROUTE = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';

const finishEndpoint = ({text}) => {
	// must be within 50 miles of current location. use bbox
	text = text.split(' ').join('%20');

	return ROUTE + text + '.json?types=address&access_token=' + keys.mapbox;
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

const ForwardGeocode = async (text) => {
	const contents = {
		text: text,
	};

	const onSuccess = (c) => (c);

	const onFailure = (c) => {
		Alert.alert("Failure", "There was a problem getting current app data from the server");
	};

	const onError = (c) => {
		Alert.alert("Error", "There was a problem getting current app data from the server");
	};

	const resp = await API({
		contents: contents,
		onSuccess: onSuccess,
		onFailure: onFailure,
		onError: onError,
	});

	var ret;

	if (resp.features.length !== 0) {
		ret = {
			longitude: resp.features[0].center[0],
			latitude: resp.features[0].center[1],
		};
	} else {
		ret = {
			longitude: null,
			latitude: null,
		}
	}

	return ret;
};

export default ForwardGeocode;