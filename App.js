import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, Alert, AsyncStorage, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Constants  from 'expo-constants';
import { Notifications } from 'expo';

import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Layout, Text } from '@ui-kitten/components';
import CheckRegionAvailability from './api/CheckRegionAvailability';
import GetCurrentLocation from './api/GetCurrentLocation';
import IsAppVersionCurrent from './api/IsAppVersionCurrent';

const Stack = createStackNavigator();

alertRegionAvailability = async () => {
  const { latitude, longitude } = await GetCurrentLocation();
  const c = await CheckRegionAvailability({latitude: latitude, longitude: longitude});

  if (! c.available) {
    Alert.alert("Thanks for checking shelfCheck out!", "Unfortunately, the app is not available in your region. Stay tuned at shelfcheck.io for when it may come to your region.");
  }

};

alertIfTermsNotChecked = async () => {
  try {
    const value = await AsyncStorage.getItem('hasAgreedTerms');
    if (value === null) {
      Alert.alert(
        "Welcome to shelfCheck!",
        "By using our app you agree to our Terms and Conditions.",
        [
          {
            text: "Review Terms and Conditions",
            onPress: () => WebBrowser.openBrowserAsync('https://www.shelfcheck.io/terms'),
          },
          {
            text: "Sounds good!",
            onPress: () => {},
          }
        ]
      )
    }
    await AsyncStorage.setItem('hasAgreedTerms', "true");
  } catch (error) {
  }
}

alertIfOldVersion = async () => {
  // this will not work in expo app because it has a different version number
  const contents = await IsAppVersionCurrent({version: Constants.nativeAppVersion});

  if (!contents.current) {

    Alert.alert(
      "Welcome back!",
      "There is a new update to the app! It has new features and bug fixes. We strongly recommend installing it.",
      [
        {
          text: "No Thanks!",
          onPress: () => {},
        },
        {
          text: "Let's do it!",
          onPress: () => {
            const url = Platform.select({
              ios: 'https://apps.apple.com/us/app/shelfcheck-shop-smarter/id1514416220',
              android: 'https://play.google.com/store/apps/details?id=com.shelfcheck.shelfcheck'
            });

            Linking.openURL(url);
          },
        }
      ]
    )

  }
}

export default function App(props) {
  const [timesLogged, setTimesLogged] = React.useState(0);

  if (timesLogged === 0) {
    alertRegionAvailability();
    alertIfTermsNotChecked();
    alertIfOldVersion();
    setTimesLogged(1);
  }

  const isLoadingComplete = useCachedResources();


  // test notification
  const localNotification = {
    title: 'Title',
    body: 'Here is a little bit of body text!'
  };

  const schedulingOptions = {
    time: (new Date()).getTime() + 10000
  }

  // Notifications show only when app is not active.
  // (ie. another app being used or device's screen is locked)
  Notifications.scheduleLocalNotificationAsync(
    localNotification, schedulingOptions
  );


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
