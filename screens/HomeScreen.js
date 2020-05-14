import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Alert, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import { MonoText } from '../components/StyledText';

import AddDataScreen from './AddDataScreen';
import ItemScreen from './ItemScreen';
import StoreScreen from './StoreScreen';

const Stack = createStackNavigator();

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

export function HomePageScreen({ navigation }) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [itemCategory, setItemCategory] = React.useState("Nutrition");
  const [modalColor, setModalColor] = React.useState("");

  return (
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

        <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(false)} animationIn="slideInLeft" backdropOpacity={0.55}>
          <View style={{
            marginTop: "16%",
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
                      item_name: item
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

            <Text style={styles.questionText}>What would you{"\n"}like to find?</Text>

            <View style={{width:"100%", height: "32%", backgroundColor:"white", flexDirection: "row", justifyContent: "space-evenly"}}>

              <TouchableOpacity onPress={() => {setModalVisible(true); setItemCategory("Nutrition"); setModalColor("#7256f3")}} style={{height: "100%", width: "42%", borderRadius: "40", backgroundColor: "#7256f3"}} />

              <TouchableOpacity onPress={() => {setModalVisible(true); setItemCategory("Health"); setModalColor("#7999ed")}} style={{height: "100%", width: "42%", borderRadius: "40", backgroundColor: "#7999ed"}} />

            </View>

            <View style={{width:"100%", height: "32%", backgroundColor:"white", flexDirection: "row", justifyContent: "space-evenly"}}>

              <TouchableOpacity onPress={() => {setModalVisible(true); setItemCategory("Cleaning"); setModalColor("#7b85f4")}} style={{height: "100%", width: "42%", borderRadius: "40", backgroundColor: "#7b85f4", alignItems: "center", flexDirection: "column", justifyContent: "space-evenly"}} />

              <TouchableOpacity onPress={() => {setModalVisible(true); setItemCategory("Power"); setModalColor("#6048d9")}} style={{height: "100%", width: "42%", borderRadius: "40", backgroundColor: "#6048d9"}} />

            </View>

          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('AddDataScreen')}
            style = {styles.addDataButtonContainer}
          >

            <LinearGradient
              colors = {['#74d3dc', "#7e84f3"]}
              style={{width: "100%", height: "100%", justifyContent: "space-around", borderRadius: 30}}
              start = {[0, 0.5]}
              end = {[1, 0.5]}
            >
              <Text style={styles.addDataText}>Add Inventory Data</Text>
            
            </LinearGradient>
          </TouchableOpacity>

          <View style={{height: "0%"}} />

        </View>

      </ImageBackground>
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
    justifyContent: "space-evenly"
  },
  addDataButtonContainer: {
    width: "90%",
    height: "10%",
    backgroundColor: "#fff",
    borderRadius: 60,
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
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  addDataText: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    textAlignVertical: "center",
  },
  questionText: {
    color: "#6349d9",
    fontWeight: "bold",
    fontSize: 30,
    left: "5%"
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: "20%",
    marginBottom: 20,
  },
  welcomeImage: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  modalBackButton: {
    height: 40,
    width: 40,
    borderRadius: 25,
    backgroundColor: "#66c1e0",
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: "center",
  },
});

const itemsByCategory = {
  Nutrition: ["Bread", "Milk", "Eggs", "Bottled Water", "Ground Beef"],
  Health: ["Toilet Paper", "Diapers", "Masks"],
  Cleaning: ["Garbage Bags", "Disinfectant Wipes", "Hand Sanitizer", "Hand Soap", "Paper Towels"],
  Power: ["Batteries", "Flashlights"],
}