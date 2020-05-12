import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';

export default function HomeScreen() {
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

          <View style={styles.itemCategoryButtonsContainer}>

            <Text style={styles.questionText}>What would you{"\n"}like to find?</Text>

            <View style={{width:"100%", height: "32%", backgroundColor:"white", flexDirection: "row", justifyContent: "space-evenly"}}>

              <TouchableOpacity style={{height: "100%", width: "40%", borderRadius: "90", backgroundColor: "#7256f3"}} />

              <TouchableOpacity style={{height: "100%", width: "40%", borderRadius: "90", backgroundColor: "#7999ed"}} />

            </View>

            <View style={{width:"100%", height: "32%", backgroundColor:"white", flexDirection: "row", justifyContent: "space-evenly"}}>

              <TouchableOpacity style={{height: "100%", width: "40%", borderRadius: "90", backgroundColor: "#7b85f4", alignItems: "center", flexDirection: "column", justifyContent: "space-evenly"}}>

              </TouchableOpacity>

              <TouchableOpacity style={{height: "100%", width: "40%", borderRadius: "90", backgroundColor: "#6048d9"}} />

            </View>

          </View>

          <TouchableOpacity
            onPress = {() => { Alert.alert("add inventory data button triggered. this is a placeholder") }}
            style = {styles.addDataButtonContainer}
          >

            <LinearGradient
              colors = {['#74d3dc', "#7e84f3"]}
              style={{width: "100%", height: "100%", justifyContent: "space-around", borderRadius: 25}}
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
    borderRadius: 30,
    justifyContent: "space-evenly"
  },
  addDataButtonContainer: {
    width: "85%",
    height: "10%",
    backgroundColor: "#fff",
    borderRadius: 25,
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
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
});
