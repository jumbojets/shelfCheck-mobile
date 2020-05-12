import React from 'react';
import CommonAPI from './CommonAPI.js';

import { Alert } from 'react-native'

const FUNCTION = 'get-closest-stores'

// cannot keep this in plaintext
const KEY = 'EYTXEa2hwU39JK2MgbCEt3uuej2nuQZG4tsjEBvt'



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
	};


	return CommonAPI({
		fn: FUNCTION,
		key: KEY,
		contents: contents,
		onSuccess: onSuccess,
		onFailure: onFailure,
		onError: onError,
	});
}

export default GetClosestStores;