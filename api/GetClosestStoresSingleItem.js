import React from 'react';
import { Alert } from 'react-native';

import CommonAPI from './CommonAPI';

const FUNCTION = 'get-closest-stores-single-item';

const GetClosestStoresSingleItem = ({item_name, longitude, latitude}) => {
	const contents = {
		item_name: item_name,
		longitude: longitude,
		latitude: latitude,
	};

	const onSuccess = (c) => (c);

	const onFailure = (c) => {
		Alert.alert("Failure", "There was a problem getting nearest stores for item: " + item_name);
		console.log(c);
	};

	const onError = (c) => {
		Alert.alert("Error", "There was a problem getting nearest stores for item: " + item_name);
	};

	return CommonAPI({
		fn: FUNCTION,
		contents: contents,
		onSuccess: onSuccess,
		onFailure: onFailure,
		onError: onError,
	});
};

export default GetClosestStoresSingleItem;