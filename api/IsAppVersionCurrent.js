import React from 'react';
import { Alert } from 'react-native';
import CommonAPI from './CommonAPI';

const FUNCTION = 'is-app-version-current';

const IsAppVersionCurrent = ({version}) => {
	const contents = {
		version: version,
	};

	const onSuccess = (c) => (c);

	const onFailure = (c) => {
		Alert.alert("Failure", "There was a problem getting current app data from the server");
	};

	const onError = (c) => {
		Alert.alert("Error", "There was a problem getting current app data from the server");
	};

	return CommonAPI({
		fn: FUNCTION,
		contents: contents,
		onSuccess: onSuccess,
		onFailure: onFailure,
		onError: onError,
	});
}

export default IsAppVersionCurrent;