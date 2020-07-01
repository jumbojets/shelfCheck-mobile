import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { StyleSheet, Text, View, Linking, ImageBackground, TouchableOpacity, AsyncStorage, Dimensions, TextInput, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import UserOperations from '../api/UserOperations';

const getStoredEmail = async () => {
  try {
    const value = await AsyncStorage.getItem("email");
    if (value !== null) {
      return value;
    } else {
      return "Email address not set";  // Default placeholder
    }
  } catch {
    Alert.alert("Error getting email stored locally");
  }
};

export default function LinksScreen() {
  const placeholder = getStoredEmail();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [currentEmail, setCurrentEmail] = React.useState("Email address not set");

  React.useEffect(() => {
    async function GOOO() {
      const stored_email = await getStoredEmail()
      setCurrentEmail(stored_email);
    }
    GOOO();
  });


  const validateEmail = (trial) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(trial).toLowerCase());
  };

  const checkValidEmail = () => {
    if (email === "") {
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert("Not a valid email!", "Leave input empty if you do not want to share one.");
    }
  };

  const removeEmail = async () => {
    try {
      await AsyncStorage.removeItem("email");
    } catch {
      Alert.alert("Error removing email from your local device.")
    }

    const c = await UserOperations({action: "remove", email: currentEmail.toLowerCase()});

    if (c.status !== "worked") {
      Alert.alert(c.status);
      return;
    }

    setCurrentEmail("Email address not set");
    setEmail("");
  };

  const removeConfirmation = () => {
    Alert.alert(
      "Are you sure you want to remove your email?",
      "This cannot be reversed. All of your impact data will be completely deleted.",
      [
        {
          "text": "Please don't!",
        },
        {
          "text": "Go for it!",
          onPress: () => removeEmail()
        }
      ]
    )
  };

  const closeModal = async () => {
    if (email !== "") {
      if (!validateEmail(email)) {
        Alert.alert("Not a valid email!", "Delete your input if you do not want to change it.");
        return;
      }

      // not currently set
      if (currentEmail === "Email address not set") {
        const c = await UserOperations({action: "add", email: email.toLowerCase()});

        if (c.status !== "worked") {
          Alert.alert(c.status);
          return;
        }
      } else {
        const c = await UserOperations({action: "edit", old_email: currentEmail.toLowerCase(), new_email: email.toLowerCase()});

        if (c.status !== "worked") {
          Alert.alert(c.status);
          return;
        }
      }

      const new_email = email.toLowerCase();
      const active_email = "";

      setCurrentEmail(new_email);
      setEmail("");

      try {
        await AsyncStorage.setItem("email", new_email);
      } catch {
        Alert.alert("Could not properly save your email!")
      }
    }
    setModalVisible(false);
  };

  return (
    <View style={styles.main}>

      <Modal isVisible={modalVisible} animationIn="slideInLeft" animationOut="slideOutLeft" backdropOpacity={0.55}>
        <View style={styles.modalContainer}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitle}>Join the community</Text>
          </View>
          <View style={{flexDirection: "row"}}>
            <Text style={styles.modalCaption}>•</Text><Text style={styles.modalCaption}> Consider signing up to join the community</Text>
          </View>
          <View style={{flexDirection: "row"}}>
            <Text style={styles.modalCaption}>•</Text><Text style={styles.modalCaption}> Track your impact: see how many shoppers you helped by reporting</Text>
          </View>
          <View style={{flexDirection: "row"}}>
            <Text style={styles.modalCaption}>•</Text><Text style={styles.modalCaption}> Climb your local leaderboard every time you contribute</Text>
          </View>
          <View style={{flexDirection: "row"}}>
            <Text style={styles.modalCaption}>•</Text><Text style={styles.modalCaption}> It’s free, secure and completely optional</Text>
          </View>

          <View style={styles.emailForm} intensity={1}>
            <TextInput
              style={styles.emailInput}
              placeholder={currentEmail}
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholderTextColor="#68ADEB"
              selectionColor="#4cd6d3"
              onBlur={() => checkValidEmail(email)}
              onChangeText={text => setEmail(text)}
            />
          </View>
          <View style={styles.doneRowContainer}>
            <TouchableOpacity style={[styles.doneButton, {width: "40%", backgroundColor: "#4cd6de"}]} onPress={() => closeModal()}>
              <Text style={{color: "#fff", fontWeight: "bold", fontSize: 16}}>I'm done!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.doneButton, {width: "40%"}]} onPress={() => removeConfirmation()}>
              <Text style={{color: "#4cd6de", fontWeight: "bold", fontSize: 16}}>Unsubscribe</Text>
            </TouchableOpacity>
          </View>
            </View>
      </Modal>



      <ImageBackground source={require('../assets/images/background-2.png')} style={{width: '100%', height: '100%'}}>
        <View style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.title}>More</Text>
          <OptionButton
            icon="md-open"
            label="Visit our website"
            onPress={() => WebBrowser.openBrowserAsync('https://www.shelfcheck.io')}
          />

          <OptionButton
            icon="md-paper-plane"
            label="Contact us"
            onPress={() => Linking.openURL('mailto:contact@shelfcheck.io')}
          />

          <OptionButton
            icon="md-paper"
            label="Terms and Conditions"
            onPress={() => WebBrowser.openBrowserAsync('https://www.shelfcheck.io/terms')}
          />

          <OptionButton
            icon="md-information-circle-outline"
            label="Privacy Policy"
            onPress={() => WebBrowser.openBrowserAsync('https://www.shelfcheck.io/privacy')}
          />

          <OptionButton
            icon="ios-at"
            label="Join the community"
            onPress={() => setModalVisible(true)}
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
  modalContainer: {
    width: Dimensions.get("window").width*0.90,
    height: 330,
    borderRadius: 30,
    backgroundColor: "#68ADEB",
    paddingTop: "5%",
    paddingHorizontal: "5%",
    flexDirection: "column",
    justifyContent: "space-between",
    bottom: "15%",
  },
  modalTitleContainer: {
      flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 25,
    color: "#fff",
  },
  modalCaption: {
    color: "#fff",
    fontSize: 15,
    marginVertical: -8,
  },
  emailForm: {
    marginTop: 5,
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 30,
    paddingVertical: 5,
    flexDirection: "column",
    justifyContent: "space-around",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4.7,
    shadowOpacity: 0.3,
    elevation: 8,
  },
  emailInput: {
    height: 40,
    borderRadius: 20,
    borderColor: "#fff",
    borderWidth: 2,
    paddingHorizontal: 20,
    color: "#68ADEB",
  },
  doneRowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 40,
  },
  doneButton: {
    backgroundColor: "#fff",
    paddingHorizontal: "0%",
    height: "100%",
    borderRadius: 25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 3,
    shadowOpacity: 0.15,
    elevation: 7,
  },
});
