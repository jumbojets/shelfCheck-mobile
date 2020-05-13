import { Text, View, StyleSheet } from 'react-native';
import * as React from 'react';

export default class YourListScreen extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<Text>Nothing here yet :(</Text>
				<Text>Come back later!</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		top: "10%",
		left: "10%",
	},
});