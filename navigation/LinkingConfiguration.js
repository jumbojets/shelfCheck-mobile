import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    Root: {
      path: 'root',
      screens: {
        Home: 'home',
        Stores: 'stores',
        List: 'list',
        More: 'more',
      },
    },
  },
};
