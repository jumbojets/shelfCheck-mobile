import React from 'react';
import PouchDB from 'pouchdb-react-native';

const localdb = new PouchDB('local-db-dev0');

export default class GreedyShopperDb {

	static store(contents) {
		localdb.get('greedyshopper').then(function(doc) {
			return localdb.put({
				_id: 'greedyshopper',
				_rev: doc._rev,
				...contents
			});
		}).then(function (response) {
			console.log('THIS IS SO FRUSTRATING')
			return response;
		}).catch(function (err) {
			localdb.put({
				_id: 'greedyshopper',
			}).catch(function (err) {
				console.log(err);
			})
		})
	}

	static retrieve() {
		return localdb.get('greedyshopper').then(function (doc) {
			return doc;
		}).catch(function (err) {
			localdb.put({
				_id: 'greedyshopper',
			}).catch(function (err) {
				console.log(err);
			})
		})
	}
}