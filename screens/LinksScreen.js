import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Linking, ImageBackground, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default function LinksScreen() {
  return (
    <View style={styles.main}>
      <ImageBackground source={require('../assets/images/background-2.png')} style={{width: '100%', height: '100%'}}>
        <View style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>More info</Text>
          <OptionButton
            icon="md-open"
            label="Visit our website"
            onPress={() => WebBrowser.openBrowserAsync('https://www.shelfcheck.io')}
          />

          <OptionButton
            icon="md-paper-plane"
            label="Contact us"
            onPress={() => Linking.openURL('mailto:contact.shelfcheck@gmail.com')}
          />

          <OptionButton
            icon="md-paper"
            label="Terms and Conditions"
            opPress={() => Linking.openURL('https://www.shelfcheck.io/terms')}
          />

          <OptionButton
            icon="md-information-circle-outline"
            label="Privacy Policy"
            opPress={() => Linking.openURL('https://www.shelfcheck.io/privacy')}
          />

          <OptionButton
            icon="md-heart-empty"
            label="Buy us a coffee"
            onPress={() => Linking.openURL('https://www.shelfcheck.io/coffee')}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="#66c1e0" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "column",
  },
  container: {
    top: "10%",
    paddingVertical: "5%",
    backgroundColor: "#7256f3",
    borderRadius: 35,
    marginHorizontal: "5%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 4.65,
    shadowOpacity: 0.29,
    elevation: 7,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    marginHorizontal: "5%",
    marginVertical: "3%",
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 0,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.20,
    elevation: 7,
  },
  optionText: {
    fontSize: 17,
    color: "#66c1e0", 
    alignSelf: 'flex-start',
    marginTop: 1,
    fontWeight: "bold",
  },
});
