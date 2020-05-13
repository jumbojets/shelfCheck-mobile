import React from 'react';
import { Alert } from 'react-native'

import CommonAPI from './CommonAPI.js';

const FUNCTION = 'get-closest-stores';

const GetClosestStores = ({longitude, latitude}) => {
	const contents = {
		longitude: longitude,
		latitude: latitude,
	};

	const onSuccess = (c) => (c);

	const onFailure = (c) => {
		Alert.alert("Failure", "There was a problem sending data to the server");
		console.log(c);
	};

	const onError = (c) => {
		Alert.alert("Error", "There was a problem sending data to the server");
		console.log(c);
	};

	return CommonAPI({
		fn: FUNCTION,
		contents: contents,
		onSuccess: onSuccess,
		onFailure: onFailure,
		onError: onError,
	});
}

export default GetClosestStores;