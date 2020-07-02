import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Alert, AsyncStorage, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Constants  from 'expo-constants';

import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';

const Stack = createStackNavigator();

export default function App(props) {

  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
