import React from 'react';
import { Alert } from 'react-native';

import CommonAPI from './CommonAPI';

const FUNCTION = 'get-store-data';

const GetStoreData = ({store_id, longitude, latitude}) => {
	const contents = {
		store_id: store_id,
		longitude: longitude,
		latitude: latitude,
	}

	const onSuccess = (c) => (c);

	const onFailure = (c) => {
		Alert.alert("Failure", "There was a problem getting data about the store from the server");
		console.log(c);
	}

	const onError = (c) => {
		Alert.alert("Error", "There was a problem getting data able the store from the server")
	}

	return CommonAPI({
		fn: FUNCTION,
		contents: contents,
		onSuccess: onSuccess,
		onFailure: onFailure,
		onError: onError,
	});
}

export default GetStoreData;