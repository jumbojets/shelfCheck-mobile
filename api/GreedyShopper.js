import React from 'react';
import { Alert } from 'react-native';

import CommonAPI from './CommonAPI';

const FUNCTION = 'greedy-shopper';

const GreedyShopper = (contents) => {
	const onSuccess = (c) => (c);

	const onFailure = (c) => {
		Alert.alert("Failure", "There was a problem getting the route for your list");
	};

	const onError = (c) => {
		Alert.alert("Error", "There was a problem getting the route for your list");
	}

	return CommonAPI({
		fn: FUNCTION,
		contents: contents,
		onSuccess: onSuccess,
		onFailure: onFailure,
		onError: onError,
	});
}

export default GreedyShopper;