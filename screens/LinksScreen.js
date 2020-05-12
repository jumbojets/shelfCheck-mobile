import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

export default function LinksScreen() {
  return (
    <View style={styles.main}>
      <Text style={styles.title}>More info</Text>
      <View style={styles.container} contentContainerStyle={styles.contentContainer}>
        <OptionButton
          icon="md-compass"
          label="Visit our website"
          onPress={() => WebBrowser.openBrowserAsync('https://www.shelfcheck.io')}
        />

        <OptionButton
          icon="ios-people"
          label="Learn more about us"
          onPress={() => WebBrowser.openBrowserAsync('https://www.shelfcheck.io')}
        />

        <OptionButton
          icon="md-at"
          label="Contact us"
          onPress={() => Linking.openURL('mailto:contact.shelfcheck@gmail.com')}
        />

        <OptionButton
          icon="md-cafe"
          label="Buy us a coffee"
          onPress={() => Linking.openURL('https://www.shelfcheck.io/buyacoffee')}
          isLastOption
        />
      </View>
    </View>
  );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "column",
  },
  container: {
    backgroundColor: '#fafafa',
    top: "10%"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#7e84f3",
    top: "7%",
    textAlign: "center",
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});
