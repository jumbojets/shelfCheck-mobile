import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Alert } from 'react-native';

import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import CheckRegionAvailability from './api/CheckRegionAvailability';
import GetCurrentLocation from './api/GetCurrentLocation';

const Stack = createStackNavigator();

alertRegionAvailability = async () => {
  const { latitude, longitude } = await GetCurrentLocation();
  const c = await CheckRegionAvailability({latitude: latitude, longitude: longitude});

  if (! c.available) {
    Alert.alert("Thanks for checking shelfCheck out!", "Unfortunately, the app is not available in your region. Stay tuned at shelfcheck.io for when it may come to your region.");
  }
};

export default function App(props) {
  const isLoadingComplete = useCachedResources();

  alertRegionAvailability();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApplicationProvider {...eva} theme={eva.light}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
          <NavigationContainer linking={LinkingConfiguration}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <Stack.Screen
                name="Root"
                component={BottomTabNavigator}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </ApplicationProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
