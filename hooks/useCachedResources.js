import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import * as Location from 'expo-location';
import { Alert, AsyncStorage } from 'react-native';
import * as Permissions from 'expo-permissions';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();

    // set up location retreiver and setter

    const getAndSetLocation = async () => {

      let { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status !== "granted") {
        Alert.alert("We need to borrow your location!", "To properly determine the stores around you, we need to have access to your location. Please go to privacy settings and allow us to access it.");
      }

      await Permissions.askAsync(Permissions.NOTIFICATIONS);

      let location = await Location.getCurrentPositionAsync();

      const latitude = location.coords.latitude.toString();
      const longitude = location.coords.longitude.toString();

      try {
        await AsyncStorage.setItem("latitude", latitude);
        await AsyncStorage.setItem("longitude", longitude);
      } catch (error) {
        console.warn("[getAndSetLocation] " + error);
      }

    };

    getAndSetLocation();

    const locationInterval = setInterval(() => {
      getAndSetLocation();

    }, 60000);


  }, []);

  return isLoadingComplete;
}
