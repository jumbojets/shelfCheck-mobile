import React from 'react';
import { Alert } from 'react-native';

import CommonAPI from './CommonAPI';

const FUNCTION = 'get-closest-stores-multiple-items';

const GetClosestStoresMultipleItems = ({items, longitude, latitude}) => {
	const contents = {
		items: items,
		longitude: longitude,
		latitude: latitude,
	}

	const onSuccess = (c) => (c);

	const onFailure = (c) => {
		Alert.alert("Failure", "There was a problem getting the closest stores for your list");
	};

	const onError = (c) => {
		Alert.alert("Error", "There was a problem getting the closest stores for your list");
	}

	return CommonAPI({
		fn: FUNCTION,
		contents: contents,
		onSuccess: onSuccess,
		onFailure: onFailure,
		onError: onError,
	});
};

export default GetClosestStoresMultipleItems;