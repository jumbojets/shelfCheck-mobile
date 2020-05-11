import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';

export default function HomeScreen() {
  return (
    
    <View style={styles.container}>
      <View style={styles.container} contentContainerStyle={styles.contentContainer}>
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

            <View style={{width:"100%", height: "30%", backgroundColor:"white", flexDirection:"row", justifyContent: "space-evenly"}}>

              <TouchableOpacity style={{height: "100%", width: "40%", borderRadius: "90", backgroundColor: "#7256f3"}} />

              <TouchableOpacity style={{height: "100%", width: "40%", borderRadius: "90", backgroundColor: "#7999ed"}} />

            </View>

            <View style={{width:"100%", height: "30%", backgroundColor:"white", flexDirection: "row", justifyContent: "space-evenly"}}>

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

      
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use useful development
        tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change'
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  itemCategoryButtonsContainer: {
    backgroundColor: '#fff',
    width: "85%",
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
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
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
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
