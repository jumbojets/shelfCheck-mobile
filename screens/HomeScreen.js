import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Alert, AsyncStorage, Dimensions, Linking } from 'react-native';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons, MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import LandingPage from '../components/LandingPage';
import { MonoText } from '../components/StyledText';

import AddDataScreen from './AddDataScreen';
import ItemScreen from './ItemScreen';
import StoreScreen from './StoreScreen';

import CheckRegionAvailability from '../api/CheckRegionAvailability';
import GetCurrentLocation from '../api/GetCurrentLocation';
import IsAppVersionCurrent from '../api/IsAppVersionCurrent';
import Constants  from 'expo-constants';


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


export default function HomePage() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="MainScreen" component={HomePageScreen} />
        <Stack.Screen name="AddDataScreen" component={AddDataScreen} />
        <Stack.Screen name="ItemScreen" component={ItemScreen} />
        <Stack.Screen name="StoreScreen" component={StoreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function HomePageScreen({ navigation, route }) {
  const [timesLogged, setTimesLogged] = React.useState(1);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [itemCategory, setItemCategory] = React.useState("Nutrition");
  const [modalColor, setModalColor] = React.useState("");

  React.useEffect(() => {
    if (timesLogged === 1) {
      alertRegionAvailability();
      alertIfTermsNotChecked();
      alertIfOldVersion();
      setTimesLogged(2);
    }
  });
  
  return (
    <View>

      <LandingPage />

      <View style={styles.container}>
      <ImageBackground source={require('../assets/images/background.png')} style={{width: '100%', height: '100%'}}>
        <View style={styles.welcomeContainer}>
          <Image
            source={require('../assets/images/home-logo.png')}
            style={styles.welcomeImage}
          />
        </View>

        <View style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}>

        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} animationIn="slideInLeft" animationOut="slideOutLeft" backdropOpacity={0.55}>
          <View style={{
            backgroundColor:"white",
            width: Dimensions.get("window").width*0.90,
            borderRadius: 30,
            backgroundColor: modalColor,
            padding: "5%",
          }}>

            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>{itemCategory}</Text>

              <TouchableOpacity style={styles.modalBackButton} onPress={() => setModalVisible(false)}>
                <Icon name="remove" size={30} color={"#fff"} />
              </TouchableOpacity>
            </View>

            {

              itemsByCategory[itemCategory].map((item, index) => (
                <TouchableOpacity key={index} style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.push('ItemScreen', {
                      item_name: item,
                      item_category: itemCategory,
                    })
                  }}
                  >
                  <Text style={styles.modalButtonText}>{item}</Text>
                </TouchableOpacity>

              ))

            }

          </View>
        </Modal>


          <View style={styles.itemCategoryButtonsContainer}>

            <View>
              <Text style={styles.questionText}>What would you like to find?</Text>
              <Text style={styles.questionText2}>Select a category to begin</Text>
            </View>

            <View style={{width:"100%", height: "32%", flexDirection: "row", justifyContent: "space-evenly"}}>

              <TouchableOpacity onPress={() => {setModalVisible(true); setItemCategory("Nutrition"); setModalColor("#7256f3")}} style={[styles.categoryButton, {backgroundColor: "#7256f3"}]}>
                <MaterialCommunityIcons name="food-apple" size={74} color="#fff" />
                <Text style={styles.categoryText}>Nutrition</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {setModalVisible(true); setItemCategory("Health"); setModalColor("#7999ed")}} style={[styles.categoryButton, {backgroundColor: "#7999ed"}]}>
                <MaterialIcons name="local-hospital" size={82} color="#fff" />
                <Text style={styles.categoryText}>Health</Text>
              </TouchableOpacity>

            </View>

            <View style={{width:"100%", height: "30%", flexDirection: "row", justifyContent: "space-evenly"}}>

              <TouchableOpacity onPress={() => {setModalVisible(true); setItemCategory("Cleaning"); setModalColor("#7b85f4")}} style={[styles.categoryButton, {backgroundColor: "#7b85f4"}]}>
                <MaterialCommunityIcons name="spray-bottle" size={74} color="#fff" />
                <Text style={styles.categoryText}>Cleaning</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {setModalVisible(true); setItemCategory("Power"); setModalColor("#6048d9")}} style={[styles.categoryButton, {backgroundColor: "#6048d9"}]}>
                <Ionicons name="ios-flashlight" size={74} color="#fff" />
                <Text style={styles.categoryText}>Power</Text>
              </TouchableOpacity>

            </View>

          </View>

          <TouchableOpacity
            onPress={() => {Haptics.impactAsync(); navigation.push('AddDataScreen', {defaultStore: "", defaultItem: ""})}}
            style = {styles.addDataButtonContainer}
          >

            <LinearGradient
              colors = {['#74d3dc', "#7e84f3"]}
              style={{width: "100%", height: "100%", justifyContent: "space-around", borderRadius: 22, flexDirection: "row", alignItems: "center"}}
              start = {[0, 0.5]}
              end = {[1, 0.5]}
            >
              <Text style={styles.addDataText}>Report what's in stock</Text>

              <Feather name="plus" size={43} color="#fff" />
            
            </LinearGradient>
          </TouchableOpacity>

          <View style={{height: "0%"}} />

        </View>

      </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: "100%",
  },
  itemCategoryButtonsContainer: {
    backgroundColor: '#fff',
    width: "90%",
    height: "80%",
    borderRadius: 40,
    justifyContent: "space-evenly",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 4.65,
    shadowOpacity: 0.22,
    elevation: 5,
  },
  addDataButtonContainer: {
    width: "90%",
    height: "10%",
    backgroundColor: "#ffff",
    borderRadius: 22,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4.7,
    shadowOpacity: 0.3,
    elevation: 8,
  },
  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 40,
    color: "#fff",
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#fff3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: 60,
    marginVertical: 5,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 7,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  addDataText: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  questionText: {
    color: "#6349d9",
    fontWeight: "bold",
    fontSize: 22,
    left: "5%"
  },
  questionText2: {
    color: "#6349d9",
    fontWeight: "normal",
    fontSize: 20,
    left: "5%"
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: "16%",
    marginBottom: "3%",
  },
  welcomeImage: {
    width: "65%",
    height: 75,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  categoryButton: {
    paddingTop: "3%",
    paddingBottom: "15%",
    height: "100%",
    width: "42%",
    borderRadius: 38,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  categoryText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
  },
  modalBackButton: {
    height: 40,
    width: 40,
    borderRadius: 25,
    backgroundColor: "#66c1e0",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 7,
  },
});

const itemsByCategory = {
  Nutrition: ["Bread", "Milk", "Eggs", "Bottled Water", "Ground Beef", "Flour", "Yeast"],
  Health: ["Toilet Paper", "Diapers", "Masks", "Tissues"],
  Cleaning: ["Disinfectant Wipes", "Hand Sanitizer", "Hand Soap", "Paper Towels", "Disinfectant Spray"],
  Power: ["Batteries", "Flashlights"],
}