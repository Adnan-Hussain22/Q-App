import React from "react";
import { Text, View, AsyncStorage } from "react-native";
import UserTabs from "./Tabs";
import styles from "./style";
import { Container, Content, Thumbnail } from "native-base";
import LoaderScreen from "../Loader/loader";
import { Firebase } from "../../Config";
export default class User extends React.Component {
  state = {
    loading: true,
    currentAuth: null,
    authProfile: null,
    boughtTokkens: null,
    // {
    //   email: "adnanrajput42@gmail.com",
    //   uid: "REILSdSgReZEJiHuohSqpqztv6q2",
    //   nickName: "Adnan Hussain"
    // },
    currentPage: 0
  };

  async componentDidMount() {
    const currentAuth = JSON.parse(await AsyncStorage.getItem("authUser"));
    // console.log(this.props.navigation.state.params);
    try {
      const authProfile = await this.handleValidateProfile(currentAuth);
      this.setState({ loading: false, currentAuth,authProfile });
    } catch (err) {
      console.log(err);
    }
  }

  //= ==========================================================//
  //= ==========================Tabs Handles===================//
  //= ========================================================//

  handleChangePage = pageNo => {
    console.log("handleChangePage ==>", pageNo);
    this.setState({ currentPage: pageNo });
  };

  //--------------------Profile Handles------------//
  handleValidateProfile = async currentAuth => {
    try {
      const storageProfile = await AsyncStorage.getItem("authProfile");
      let authProfile = storageProfile ? JSON.parse(storageProfile) : null;
      if (!(authProfile && authProfile.uid == currentAuth.uid)) {
        const usersRef = Firebase.fireStore.collection("users");
        const doc = await usersRef.doc(currentAuth.uid).get();
        if (doc.exists) {
          const data = doc.data();
          authProfile = { ...data, uid: currentAuth.uid };
          AsyncStorage.setItem("authProfile", JSON.stringify(authProfile));
        }
      }
      return authProfile;
    } catch (err) {
      console.log(err);
    }
  };

  handleFetchProfile = profileObj => {
    if (profileObj) {
      this.setState({ authProfile: { ...profileObj } });
    }
  };

  //--------------------End of Profile Handles------------//

  //--------------------Dasboard Handles------------//

  handleValidateTokkens = async () => {
    const { currentAuth } = this.state;
    const userTokkensMetaRef = Firebase.fireStore.collection("userTokkensMeta");
    try {
      let boughtTokkens = null;
      const query = userTokkensMetaRef
        .where("uid", "==", currentAuth.uid)
        .where("date", "==", new Date().toDateString());
      const snap = await query.get();
      if (snap.size) {
        snap.forEach(doc => {
          const data = doc.data();
          console.log("handleValidateTokkens==>", data);
          boughtTokkens = { ...data, uid: currentAuth.uid };
        });
      }
      this.setState({ boughtTokkens });
      return boughtTokkens;
    } catch (err) {
      console.log(err);
    }
  };

  //--------------------End of Dasboard Handles------------//

  //= ==========================================================//
  //= ==================End of Tabs Handles===================//
  //= ========================================================//

  //Main render method
  render() {
    const { loading } = this.state;
    if (loading) return <LoaderScreen loading={loading} />;
    return <View style={styles.container}>{this.renderView()}</View>;
  }

  //Method to render the view
  renderView = () => {
    return (
      <Container style={styles.container}>
        <Content>
          {this.renderHeader()}
          {this.renderTabs()}
          {/* {this.renderFooter()} */}
        </Content>
      </Container>
    );
  };

  //Method to render the header
  renderHeader = () => {
    return (
      <View style={[styles.headerContainer]}>
        {this.renderUserName()}
        {this.renderUserAvatar()}
      </View>
    );
  };

  //Method to render the main
  renderTabs = () => {
    return (
      <UserTabs
        userProfile={this.state.authProfile}
        currentPage={this.state.currentPage}
        handleChangePage={this.handleChangePage}
        boughtTokkens={this.state.boughtTokkens}
        handleValidateTokkens={this.handleValidateTokkens}
        handleFetchProfile={this.handleFetchProfile}
      />
    );
  };

  //Method to render the footer
  renderFooter = () => {
    return <View style={styles.footer} />;
  };

  //= ==================Header methods===================//

  //Method to render the header
  renderUserName = () => {
    return (
      <View>
        <Text style={[styles.headerText]}>User Name</Text>
      </View>
    );
  };

  //Method to render the header
  renderUserAvatar = () => {
    const uri = "http://creex.club/app/img/avatar.jpg";
    return (
      <View style={[styles.userAvatarContainer]}>
        <Thumbnail small source={{ uri: uri }} />
      </View>
    );
  };
  //= ==================End of Header methods===================//
}
