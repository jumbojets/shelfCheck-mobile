import React from 'react';
import { Alert } from 'react-native';

import CommonAPI from './CommonAPI';

const FUNCTION = 'append-crowdsourced-data';

const AppendCrowdsourcedData = (contents) => {
	const onSuccess = (c) => (Alert.alert("Success", "Thank you for submitting inventory data!"));

	const onFailure = (c) => {
		Alert.alert("Failure", "There was a problem submitting your inventory data");
		console.log(c);
	};

	const onError = (c) => {
		Alert.alert("Error", "There was a problem sending data to the server");
		console.log(c);
	}

	return CommonAPI({
		fn: FUNCTION,
		contents: contents,
		onSuccess: onSuccess,
		onFailure: onFailure,
		onError: onError,
	});
}

export default AppendCrowdsourcedData;