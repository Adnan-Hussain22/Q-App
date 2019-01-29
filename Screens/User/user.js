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
    todayBoughtTokken: null,
    currentPage: 0,
    currentTokken: null,
    currentTokkenTimer: null,
    currentTokkenCompany: null
    // {
    //   email: "adnanrajput42@gmail.com",
    //   uid: "REILSdSgReZEJiHuohSqpqztv6q2",
    //   nickName: "Adnan Hussain"
    // },
  };

  async componentDidMount() {
    const currentAuth = JSON.parse(await AsyncStorage.getItem("authUser"));
    // console.log(this.props.navigation.state.params);
    try {
      const authProfile = await this.handleValidateProfile(currentAuth);
      this.handleFetchCurrentTokken(currentAuth);
      this.setState({ loading: false, currentAuth, authProfile });
    } catch (err) {
      console.log(err);
    }
  }

  //handle to fetch the current tokken
  handleFetchCurrentTokken = async currentAuth => {
    const userTokkensMeta = Firebase.fireStore.collection("userTokkensMeta");
    // const snap = await userTokkensMeta.get();
    // snap.forEach(doc => {
    //   const data = doc.data();
    //   console.log("user tokken meta=>", data);
    //   console.log("date==>", new Date().toDateString());
    //   console.log("date.date==>", data.date);
    //   console.log(
    //     "date === data.date ==>",
    //     new Date().toDateString() === data.date
    //   );
    //   console.log("uid==>", currentAuth.uid);
    //   console.log("data.uid==>", data.uid);
    //   console.log("uid === data.uid ==>", currentAuth.uid === data.uid);
    //   console.log("status ==>", data.status);
    //   console.log("status === started ==>", data.status === "started");
    // });
    const query = userTokkensMeta
      .where("date", "==", new Date().toDateString())
      .where("uid", "==", currentAuth.uid)
      .where("status", "==", "started");
    query.onSnapshot(snap => {
      snap.forEach(doc => {
        const data = doc.data();
        console.log("handleFetchCurrentTokken onSnap==>", data);
        this.handleFetchCurrentCompanyTokkenTime(data.company.id).then(
          currentTokkenTime => {
            console.log("currentTokkenTime==>", currentTokkenTime);
            const currentTokkenTimer = this.handleGetTokkenTimer(
              data.started,
              currentTokkenTime
            );
            this.setState({ currentTokken: data, currentTokkenTimer });
          }
        );
      });
    });
  };

  //handle to fetch the company data of associated company with current tokken
  handleFetchCurrentCompanyTokkenTime = async companyId => {
    try {
      console.log(
        "handleFetchCurrentCompanyTokkenTime companyId==>",
        companyId
      );
      const tokkensMetaRef = Firebase.fireStore.collection("tokkensMeta");
      const query = tokkensMetaRef
        .where("date", "==", new Date().toDateString())
        .where("companyId", "==", companyId);
      const snap = await query.get();
      let time = null;
      snap.forEach(doc => {
        const data = doc.data();
        time = data.time;
      });
      return time;
    } catch (err) {}
  };

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

  handleValidateTodayTokkens = async () => {
    const { currentAuth } = this.state;
    const userTokkensMetaRef = Firebase.fireStore.collection("userTokkensMeta");
    try {
      let todayBoughtTokken = null;
      const query = userTokkensMetaRef
        .where("uid", "==", currentAuth.uid)
        .where("date", "==", new Date().toDateString());
      const snap = await query.get();
      if (snap.size) {
        snap.forEach(doc => {
          const data = doc.data();
          console.log("handleValidateTodayTokkens==>", data);
          todayBoughtTokken = { ...data, uid: currentAuth.uid };
        });
      }
      this.setState({ todayBoughtTokken });
      return todayBoughtTokken;
    } catch (err) {
      console.log(err);
    }
  };

  //get the elapsed time of the started tokken
  handleGetTokkenTimer = (startedTime_MiliSec, companyTiming_Min) => {
    //get the now timing in miliseconds
    const now_MiliSec = new Date().getTime();
    //get the elapse time in seconds in miliseconds
    const timeElapsed_Sec = (now_MiliSec - startedTime_MiliSec) / 1000;
    // get the company time in seconds
    const companyTiming_Sec = companyTiming_Min * 60;
    //finaly get the tokken timer by subtract elapsed time sec from company time seconds
    const tokkenTiming_Sec =
      companyTiming_Sec - timeElapsed_Sec > 0
        ? Math.ceil(companyTiming_Sec - timeElapsed_Sec)
        : 0;
    return tokkenTiming_Sec;
  };

  handleOnCurrentTokkenTimeElapsed = () => {
    this.setState({ currentTokken: null, currentTokkenTimer: null });
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
    console.log("renderTabs==>");
    return (
      <UserTabs
        userProfile={this.state.authProfile}
        currentPage={this.state.currentPage}
        handleChangePage={this.handleChangePage}
        todayBoughtTokken={this.state.todayBoughtTokken}
        handleValidateTodayTokkens={this.handleValidateTodayTokkens}
        handleFetchProfile={this.handleFetchProfile}
        currentTokken={this.state.currentTokken}
        currentTokkenTimer={this.state.currentTokkenTimer}
        handleOnCurrentTokkenTimeElapsed={this.handleOnCurrentTokkenTimeElapsed}
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
    const { currentAuth } = this.state;
    const uri = "http://creex.club/app/img/avatar.jpg";
    const authAvatar = currentAuth.photoURL ? currentAuth.photoURL : "";
    return (
      <View style={[styles.userAvatarContainer]}>
        <Thumbnail small source={{ uri: !authAvatar ? uri : authAvatar }} />
      </View>
    );
  };
  //= ==================End of Header methods===================//
}
