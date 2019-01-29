import React from "react";
import { View, Alert, AsyncStorage, TouchableOpacity } from "react-native";
import { Icon, Text } from "native-base";
import { Firebase } from "../../Config";
import { Facebook } from "expo";
import styles from "./style";
export default class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  async componentWillMount() {
    await this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    try {
      const authUser = await AsyncStorage.getItem("authUser");
      // This will switch to the App scsreen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      if (authUser) {
        this.props.navigation.replace("Home");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //handle login click
  handleLogin = async () => {
    console.log("handleLogin");
    try {
      const res = await FacebookLogIn();
      if(res.err){
        Alert.alert("Error!!", err, [{ text: "OK" }]);
        return;
      }
      if (res.res) {
        console.log(res);
        const user = JSON.stringify(res.res);
        await AsyncStorage.setItem("authUser", user);
        this.props.navigation.replace("Home");
      }
    } catch (err) {

      // Alert.alert("Error!!", err, [{ text: "OK" }]);
      console.log(err);
    }
  };

  render() {
    return this.renderView();
  }

  //renders the main view
  renderView = () => {
    return (
      <View style={styles.container}>
        {this.renderMain()}
        {this.renderActionContainer()}
      </View>
    );
  };

  //render the main content
  renderMain = () => {
    return (
      <View style={styles.main}>
        <Text style={styles.mainBrand}>{"Welcome".toUpperCase()}</Text>
        <Text style={styles.mainText1}>All you want</Text>
        <Text style={styles.mainText2}>Please login to continue</Text>
      </View>
    );
  };

  //render the login action container
  renderActionContainer = () => {
    return (
      <View style={styles.actionContainer}>
        <TouchableOpacity onPress={this.handleLogin}>
          <View style={styles.actionBtnContainer}>
            <Icon name="facebook" type="FontAwesome" style={styles.actionBtn} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
}

async function FacebookLogIn() {
  try {
    const { type, token } = await Facebook.logInWithReadPermissionsAsync(
      "729087654139322",
      {
        permissions: ["public_profile", "email"]
      }
    );
    if (type === "success") {
      // Get the user's name using Facebook's Graph API
      const credential = Firebase.firebase.auth.FacebookAuthProvider.credential(
        token
      );
      const res = await Firebase.firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential);
      const { user } = res;
      const { displayName, email, photoURL, uid } = user;
      return {
        status: 200,
        res: { displayName, email: "", photoURL, uid },
        err: null
      };
    } else {
      // type === 'cancel'
      return {
        status: 500,
        res: null,
        err: { msg: "Unable to login" }
      };
    }
  } catch ({ message }) {
    return {
      status: 404,
      res: null,
      err: message
    };
  }
}
