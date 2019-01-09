import React from "react";
import {
  View,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Button, Text, Icon } from "native-base";
import { Firebase } from "../../Config";
import styles from "./style";
import Loader from "../Loader/loader";
import { MetaModal } from "../../Components";
import { Permissions, Notifications } from "expo";
export default class Home extends React.Component {
  state = {
    authUser: null,
    companies: [],
    loading: false,
    showModal: false,
    modalMeta: null
  };

  async componentDidMount() {
    // console.log(this.props.navigation.state.params);
    const authUser = JSON.parse(await AsyncStorage.getItem("authUser"));
    this.setState({ authUser }, () => {
      this.handleRegisterPushNotificationsAsync();
    });
  }

  handleOnCloseModal = () => {
    this.setState({ showModal: false });
  };

  //handle to request for push notification
  handleRegisterPushNotificationsAsync = async () => {
    try {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;

      // only ask if permissions have not already been determined, because
      // iOS won't necessarily prompt the user a second time.
      if (existingStatus !== "granted") {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }

      // Stop here if the user did not grant permissions
      if (finalStatus !== "granted") {
        return;
      }

      // Get the token that uniquely identifies this device
      let token = await Notifications.getExpoPushTokenAsync();
      this.handleSaveUserTokken(token);
    } catch (err) {
      console.log(err);
    }
  };

  //handle save user expo tokken in firestore db
  handleSaveUserTokken = async Tokken => {
    Firebase.fireStore
      .collection("users")
      .doc(this.state.authUser.uid)
      .update({ expoTokken: Tokken });
  };

  //= =======================ALL HANDLES RELATED TO COMPANY=====================//

  // check if the user is registered with some company
  handleCompanyValidation = async () => {
    const companiesRef = Firebase.fireStore.collection("company");
    try {
      const query = companiesRef.where(
        "admins",
        "array-contains",
        this.state.authUser.email
      );
      const snap = await query.get();
      if (snap.size) {
        console.log("have snap");
        return {
          snap,
          status: 200,
          err: null
        };
      }
      return {
        snap: null,
        status: 404,
        err: null
      };
    } catch (err) {
      return { snap: null, status: 500, err };
    }
  };

  handleCompanyClick = async () => {
    this.setState({ loading: true });
    let companies = [];
    try {
      //
      const { snap, status, err } = await this.handleCompanyValidation();
      if (snap) {
        snap.forEach(res => {
          const data = res.data();
          companies = companies.concat(data);
        });
        this.setState({ loading: false, companies }, () => {
          this.props.navigation.navigate("Companies", { companies });
        });
      } else {
        this.setState({
          loading: false,
          showModal: true,
          meta: this.renderCompanyNonValidated()
        });
      }
    } catch (err) {}
  };

  handleRegisterCompany = () => {
    this.setState({ showModal: false }, () => {
      this.props.navigation.navigate("CompanyData");
    });
  };

  //= =======================END OF COMPANY HANDLES===========================//

  //= =======================USER MODE HANDLES=====================//

  handleUserClick = () => {
    this.props.navigation.navigate("User");
  };

  //= =======================END OF USER MODE HANDLES===========================//

  // Check if there is no activity than render the view else render loader
  render() {
    const { loading } = this.state;
    if (loading) {
      return <Loader loading={loading} />;
    }
    return this.renderView();
  }
  renderView = () => {
    const { meta, showModal } = this.state;
    return (
      <View style={styles.container}>
        <MetaModal
          showModal={showModal}
          meta={meta}
          handleOnCloseModal={this.handleOnCloseModal}
        />
        {this.renderMain()}
        {this.renderFooter()}
      </View>
    );
  };

  //render the main
  renderMain = () => {
    return (
      <View style={styles.main}>
        {this.renderEmoji()}
        <Text style={styles.mainBrand}>{"Welcome".toUpperCase()}</Text>
        <Text style={styles.mainText1}>
          {"Please tell me your identity".toUpperCase()}
        </Text>
      </View>
    );
  };

  //render smile container
  renderEmoji = () => {
    return (
      <View style={styles.emojiContianer}>
        <Icon name="smile-o" type="FontAwesome" style={styles.emoji} />
      </View>
    );
  };

  //render the footer
  renderFooter = () => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity style={styles.actionBtn}>
          <Button
            iconRight
            dark
            style={{ borderRadius: 5 }}
            onPress={this.handleUserClick}
          >
            <Text>User</Text>
            <Icon name="user" type="Feather" />
          </Button>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Button
            iconRight
            dark
            style={{ borderRadius: 5 }}
            onPress={this.handleCompanyClick}
          >
            <Text>Company</Text>
            <Icon name="users" type="Feather" />
          </Button>
        </TouchableOpacity>
      </View>
    );
  };

  //= =======================COMPANY RENDER METHODS===========================//

  renderCompanyNonValidated = () => {
    return (
      <View style={styles.confirmModal}>
        <View style={{ padding: 10 }}>
          <Text>Sorry:( You are not registered with any company</Text>
          <Text>Do you want to register a company ?</Text>
        </View>
        <View style={styles.confirmModalBtnContainer}>
          <TouchableOpacity style={{ borderRadius: 5 }}>
            <Button
              light
              style={styles.confirmModalBtn}
              onPress={() => this.setState({ showModal: false })}
            >
              <Text style={{ color: "yellow" }}> Cancel </Text>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity style={{ borderRadius: 5 }}>
            <Button
              light
              style={styles.confirmModalBtn}
              onPress={this.handleRegisterCompany}
            >
              <Text style={{ color: "red" }}> OK </Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //= =======================END OF COMPANY RENDERS===========================//
}

const cusstyles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: "white",
    zIndex: 6,
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width
  }
});
