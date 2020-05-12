import * as React from 'react';

import { Alert } from 'react-native';

const ENDPOINT = 'https://api.shelfcheck.io/dev/'

const packageRequest = async (key, contents) => {
  return {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'x-api-key': key
    },
    body: JSON.stringify(contents),
  };
}

const CommonAPI = async ({fn, key, contents, onSuccess, onFailure, onError}) => {
  return fetch(ENDPOINT + fn, await packageRequest(key, contents))
    .then((response) => {
      if (response.status == 200) return response.json();
      else return onFailure(response);
    })
    .catch((err) => {
      console.log('[CommonAPI] Error:', err);
      return onError(err);
    });
}

export default CommonAPI;