import React from 'react';
import { Alert } from 'react-native';
import CommonAPI from './CommonAPI';

const FUNCTION = 'is-near-store';

const IsNearStore = ({longitude, latitude}) => {
	const contents = {
		longitude: longitude,
		latitude: latitude,
	};

	const onSuccess = (c) => (c);

	const onFailure = (c) => {
		Alert.alert('Failure', 'There was a problem getting data from the server');
	};

	const onError = (c) => {
		Alert.alert('Error', 'There was a problem getting data from the server');
	};

	return CommonAPI({
		fn: FUNCTION,
		contents: contents,
		onSuccess: onSuccess,
		onFailure: onFailure,
		onError: onError,
	});
};

export default IsNearStore;