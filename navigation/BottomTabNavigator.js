import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import NearbyStoresScreen from '../screens/NearbyStoresScreen';
import LinksScreen from '../screens/LinksScreen';
import Colors from '../constants/Colors';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}
      tabBarOptions={{
        activeTintColor: Colors.tabIconSelected,
        inactiveTintColor: Colors.tabIconDefault,
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
        }}
      />
      <BottomTab.Screen
        name="Stores"
        component={NearbyStoresScreen}
        options={{
          title: 'Stores',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-business" />,
        }}
      />
      <BottomTab.Screen
        name="List"
        component={HomeScreen}
        options={{
          title: 'Your List',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-cart" />,
        }}
      />
      <BottomTab.Screen
        name="More"
        component={LinksScreen}
        options={{
          title: 'More',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-menu" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return '';
    case 'Stores':
      return 'Nearby Stores';
    case 'List':
      return 'Your List';
    case 'More':
      return 'More Links';
  }
}
