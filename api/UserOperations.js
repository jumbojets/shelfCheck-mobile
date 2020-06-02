import React from 'react';
import { Alert } from 'react-native';
import CommonAPI from './CommonAPI';

const FUNCTION = 'user-operations';

const UserOperations = ({action, email, old_email, new_email}) => {
	const contents = {
		action: action,
		contents: {
			email: email,
			old_email: old_email,
			new_email: new_email
		}
	};

	const onSuccess = (c) => (c);

	const onFailure = (c) => {
		Alert.alert("Failure", "There was a problem running user operation action: " + action);
		console.log(c);
	};

	const onError = (c) => {
		Alert.alert("Error", "There was a problem running user operation action: " + action);
	};

	return CommonAPI({
		fn: FUNCTION,
		contents: contents,
		onSuccess: onSuccess,
		onFailure: onFailure,
		onError: onError,
	});
};

export default UserOperations;