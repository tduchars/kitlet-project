import React from "react";
import {
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import ImageUploader from "../components/ImageUploader";
import { ScrollView } from "react-native-gesture-handler";
import tintColor from "../constants/Colors";
import mainRed from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome5";
import * as api from "../utils/api";

// about to connect to api

const width = Dimensions.get("window").width;

export default class LetScreen extends React.Component {
  state = {
    whatItem: "",
    describeItem: "",
    priceInFocus: false,
    selectedCat: "",
    price: 0,
    loggedInUser: "tonyboi",
    fireBaseUrl: "",
    userLocation: "Pontefract",
    nullPrompt: false
  };

  focusOnPrice = bool => {
    this.setState({ priceInFocus: bool });
  };

  toggleCategory(category) {
    this.setState({
      selectedCat: category,
      activeCategory: category
    });
  }

  componentDidMount = () => {
    //update allCategories upon mounting this page for scroll
  };
  handleInput = (key, e) => {
    this.setState({ [key]: e });
  };
  updateFirebaseUrl = url => {
    const formatUrl = url.replace(/(\/)/, "%2F");
    const formatHttp = formatUrl.replace(":", "&colon;");
    const urlBasic = `https://firebasestorage.googleapis.com/v0/b/kitlet-784db.appspot.com/o/${formatHttp}?alt=media&token=4b845296-f44e-4ad8-8c35-e999319770fd`;
    this.setState({ fireBaseUrl: urlBasic });
  };
  sendListing = e => {
    e.preventDefault();
    const {
      whatItem,
      loggedInUser,
      selectedCat,
      describeItem,
      price,
      fireBaseUrl,
      userLocation
    } = this.state;
    if (
      whatItem === "" ||
      loggedInUser === "" ||
      selectedCat === "" ||
      describeItem === "" ||
      price === 0 ||
      fireBaseUrl === "" ||
      userLocation === ""
    ) {
      this.setState({ nullPrompt: true });
    } else {
      api
        .postNewListing(
          whatItem,
          loggedInUser,
          selectedCat,
          describeItem,
          price,
          fireBaseUrl,
          userLocation
        )
        .then(() => {
          Alert.alert("Successfully Added Listing");
        })
        .then(() => {
          this.setState({
            whatItem: "",
            describeItem: "",
            selectedCat: "",
            price: 0,
            fireBaseUrl: "",
            nullPrompt: false
          });
        });
    }
  };
  render() {
    const {
      whatItem,
      describeItem,
      price,
      selectedCat,
      loggedInUser,
      fireBaseUrl,
      nullPrompt
    } = this.state;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="position"
        enabled={this.state.priceInFocus}
      >
        <View style={styles.top}>
          <ImageUploader updateFirebaseUrl={this.updateFirebaseUrl} />
        </View>
        <View style={styles.middle}>
          <TextInput
            style={styles.addListing}
            onChangeText={e => this.handleInput("whatItem", e)}
            placeholder="What are you letting?"
            value={whatItem}
          />
          <TextInput
            style={styles.describeListing}
            onChangeText={e => this.handleInput("describeItem", e)}
            placeholder="Describe it best you can..."
            value={describeItem}
          />
        </View>
        <ScrollView style={styles.categoryDrop} horizontal={true}>
          <>
            <View style={styles.outerContainer}>
              <TouchableOpacity
                onPress={() => this.toggleCategory("audio")}
                style={
                  this.state.activeCategory === "audio"
                    ? styles.categoryButtonActive
                    : styles.categoryButton
                }
              >
                <Ionicons
                  name="ios-microphone"
                  size={30}
                  style={
                    this.state.activeCategory === "audio"
                      ? styles.iconActive
                      : styles.icon
                  }
                />
                <Text
                  style={
                    this.state.activeCategory === "audio"
                      ? styles.buttonTextActive
                      : styles.buttonText
                  }
                >
                  Audio
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.toggleCategory("video")}
                style={
                  this.state.activeCategory === "video"
                    ? styles.categoryButtonActive
                    : styles.categoryButton
                }
              >
                <Ionicons
                  name="ios-videocam"
                  size={30}
                  style={
                    this.state.activeCategory === "video"
                      ? styles.iconActive
                      : styles.icon
                  }
                />
                <Text
                  style={
                    this.state.activeCategory === "video"
                      ? styles.buttonTextActive
                      : styles.buttonText
                  }
                >
                  Video
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.toggleCategory("art")}
                style={
                  this.state.activeCategory === "art"
                    ? styles.categoryButtonActive
                    : styles.categoryButton
                }
              >
                <Icon
                  name="paint-brush"
                  size={26}
                  style={
                    this.state.activeCategory === "art"
                      ? styles.faIconActive
                      : styles.faIcon
                  }
                />

                <Text
                  style={
                    this.state.activeCategory === "art"
                      ? styles.buttonTextActive
                      : styles.buttonText
                  }
                >
                  Art &amp; Design
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.toggleCategory("tech")}
                style={
                  this.state.activeCategory === "tech"
                    ? styles.categoryButtonActive
                    : styles.categoryButton
                }
              >
                <Icon
                  name="network-wired"
                  size={26}
                  style={
                    this.state.activeCategory === "tech"
                      ? styles.faIconActive
                      : styles.faIcon
                  }
                />

                <Text
                  style={
                    this.state.activeCategory === "tech"
                      ? styles.buttonTextActive
                      : styles.buttonText
                  }
                >
                  Tech
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </ScrollView>
        <View style={styles.bottom}>
          <View style={styles.addPrice}>
            <Text style={styles.currencyPrefix}>£</Text>
            <TextInput
              onFocus={() => this.focusOnPrice(true)}
              onBlur={() => this.focusOnPrice(false)}
              keyboardType="numeric"
              onChangeText={e => this.handleInput("price", e)}
              placeholder="Per Day"
              number={price}
              maxLength={6}
              style={styles.priceInput}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Submit Listing"
              style={styles.submit}
              color={tintColor.tintColor}
              onPress={this.sendListing}
            />
            {nullPrompt && (
              <Text style={styles.prompt}>
                Make sure no fields are empty...
              </Text>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

LetScreen.navigationOptions = {
  title: "Post New Item to Kitlet"
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  top: {
    flex: 3,
    width,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  middle: {
    flex: 2.5,
    width,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee"
  },
  categoryDrop: {
    paddingBottom: 16,
    height: 64,
    width
  },
  bottom: { flex: 3, width, alignItems: "center" },
  addListing: {
    height: 40,
    width: width * 0.9,
    borderColor: "grey",
    borderBottomWidth: 1,
    fontSize: 16
  },
  describeListing: {
    fontSize: 16,
    width: width * 0.9,
    height: 40
  },
  catButton: {
    fontSize: 16,
    width: width / 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    margin: 8
  },
  addPrice: {
    width: 128,
    margin: "auto",
    borderWidth: 1,
    borderColor: "#eee",
    textAlign: "center",
    justifyContent: "center",
    fontSize: 16,
    marginBottom: 32,
    paddingTop: 8,
    borderRadius: 5,
    paddingBottom: 8,
    display: "flex",
    alignItems: "center",
    flexDirection: "row"
  },
  outerContainer: {
    display: "flex",
    width: width - 32,
    justifyContent: "space-between",
    marginLeft: 16,
    marginRight: 16,
    marginTop: 32,
    alignItems: "center",
    flexDirection: "row"
  },
  icon: { fontSize: 30, color: tintColor.tintColor },
  iconActive: { fontSize: 30, color: "white" },
  categoryButton: {
    height: (width - 64) / 4,
    width: (width - 64) / 4,
    borderRadius: 5,
    marginBottom: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee"
  },
  categoryButtonActive: {
    height: (width - 64) / 4,
    width: (width - 64) / 4,
    borderRadius: 5,
    marginBottom: 16,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: tintColor.tintColor
  },
  faIcons: {
    marginBottom: 4
  },
  buttonText: {
    color: tintColor.tintColor,
    marginTop: 4
  },
  buttonTextActive: {
    color: "white",
    marginTop: 4
  },
  activeIcon: {
    color: "white"
  },
  faIcon: {
    marginBottom: 4,
    color: tintColor.tintColor
  },
  faIconActive: {
    marginBottom: 4,
    color: "white"
  },
  buttonContainer: {
    width: 128
  },
  currencyPrefix: {
    marginRight: 8,
    flex: 1,
    marginLeft: 8,
    textAlign: "center"
  },
  priceInput: {
    flex: 3,
    marginLeft: 8
  },
  prompt: {
    textAlign: "center",
    color: mainRed.mainRed
  }
});
