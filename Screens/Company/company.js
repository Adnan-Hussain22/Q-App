import React from "react";
import _ from "lodash";
import CountdownCircle from "../../Components/react-native-countdown-circle";
import StepIndicator from "../../Components/react-native-step-indicator";
import {
  View,
  TouchableOpacity,
  Text as NativeText,
  Alert
} from "react-native";
import { Firebase } from "../../Config";
import {
  Container,
  Content,
  Button,
  Text,
  Icon,
  Thumbnail,
  Radio
} from "native-base";
import { MetaModal, NumericInput } from "../../Components";
import styles, { customStyles } from "./style";
import Loader from "../Loader/loader";
import { ImagePicker, Permissions, FaceDetector } from "expo";
export default class Compony extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      companyId: "",
      showMetaModal: false,
      startTokkenTimer: false,
      currentStartedTokkenData: null,
      tokkenTimer: null,
      meta: null,
      setupType: "new",
      tokkenCount_d: 0,
      tokkenCount: 0,
      tokkenTime: 0,
      tokkenSetuped: false,
      tokkenSetup_Id: "",
      companyData: null,
      companyTodayTokkenData: null,
      admins: [],
      tokkenUsers: null,
      currentTokkenUser: false,
      currentUserAllowed: false,
      autoStartTokken: false
    };
  }

  async componentDidMount() {
    await this.handleValidateTokkenSetup();
    this.handleFetchTokkensMeta();
    this.handleFetchTokkenUsers();
  }

  //Handle to get the tokkens realtime updates
  handleFetchTokkensMeta = async () => {
    const { companyId } = this.state;
    const tokkensMetaRef = Firebase.fireStore.collection("tokkensMeta");
    try {
      const query = tokkensMetaRef
        .where("companyId", "==", companyId)
        .where("date", "==", new Date().toDateString());
      query.onSnapshot(snap => {
        snap.forEach(doc => {
          const data = doc.data();
          console.log("handleFetchTokkensMeta onSnapshot==>", data);
          this.setState({
            companyTodayTokkenData: data,
            tokkenCount: data.limit,
            tokkenTime: data.time,
            autoStartTokken: data.autoStartTokken
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  //Method to validate either the tokkens are setup or not
  handleValidateTokkenSetup = () => {
    if (this.props.navigation.state.params) {
      const {
        companyData,
        status,
        companyId,
        tokkenSetupId
      } = this.props.navigation.state.params;
      console.log("handleValidateTokkenSetup tokkenSetupId==>", tokkenSetupId);
      if (status) {
        this.setState({
          loading: false,
          tokkenSetuped: true,
          companyData,
          companyId,
          tokkenSetup_Id: tokkenSetupId
        });
        return;
      }
      this.setState({
        companyData,
        loading: false,
        tokkenSetuped: false,
        companyId
      });
    }
  };

  //handle to fetch the current tokken user at realtime
  handleFetchTokkenUsers = async () => {
    const { companyId, companyData } = this.state;
    // const companyTiming = companyData.timing.from;
    // const userTiming = new Date(
    //   new Date().setHours(
    //     companyTiming.amPM == "AM"
    //       ? +companyTiming.hour
    //       : +companyTiming.hour + 12,
    //     +companyTiming.minute,
    //     0
    //   )
    // )
    //   .toLocaleTimeString()
    //   .substr(0, 8);
    const userTokkensMeta = Firebase.fireStore.collection("userTokkensMeta");
    // const snap = await userTokkensMeta.get();
    // snap.forEach(doc=>{
    //   const data = doc.data();
    //   console.log('date==>',new Date().toDateString());
    //   console.log('data.date==>',data.date);
    //   console.log('date === data.date',new Date().toDateString() === data.date);
    //   console.log('companyId==>',companyId);
    //   console.log('data.companyId==>',data.company.id);
    //   console.log('companyId === data.companyId ==>',companyId === data.company.id);
    //   console.log('data.status ==>',data.status === "not set");
    //   console.log('data.status === not set ==>',data.status);
    // })
    const query = userTokkensMeta
      .where("date", "==", new Date().toDateString())
      .where("company.id", "==", companyId)
      .where("status", "==", "not set");
    query.onSnapshot(snap => {
      let tokkenUsers = [];
      snap.forEach(doc => {
        const data = doc.data();
        tokkenUsers = tokkenUsers.concat({ ...data, docId: doc.id });
      });
      const currentTokkenUser = this.handleFetchRecentTokkenUser(tokkenUsers);
      this.setState({ currentTokkenUser });
    });
  };

  //handle get the recent tokken user
  handleFetchRecentTokkenUser = tokkenUsers =>
    _.orderBy(
      tokkenUsers,
      ["time"],
      // [e => e.formatedTime.hours, e => e.timing.minutes, e => e.timing.seconds],
      ["asc"]
    )[0];

  // Handle awake when the current tokken timmer is elapsed
  handleTimeElapsed(secondsElapsed, totalSeconds) {
    if (totalSeconds > 0) return totalSeconds - secondsElapsed;
    return 0;
  }

  // Handle to get the layout width and height
  handleGetSize = e => {
    const { height, width } = e.nativeEvent.layout;
    console.log({ height, width });
    this.setState({ headerElementsSize: { height, width } });
  };

  //Method to setup the tokken
  handleSetupTokken = type => {
    const { tokkenCount, tokkenTime } = this.state;
    if (tokkenCount && tokkenTime) {
      this.setState({
        showMetaModal: false,
        meta: this.renderTokkenSetupConfirmation(type)
      });
      setTimeout(() => {
        this.setState({ showMetaModal: true });
      }, 1300);
    }
  };

  //method to save the tokkens in db
  handleSaveTokkens = async type => {
    const { tokkenCount, companyId, tokkenTime } = this.state;
    this.setState({ loading: true });
    try {
      const tokkensMeta = Firebase.fireStore.collection("tokkensMeta");
      if (type == "new") {
        const obj = {
          limit: tokkenCount,
          time: tokkenTime,
          bought: 0,
          remaining: tokkenCount,
          date: new Date().toDateString(),
          companyId,
          waiting: 0,
          finished: 0
        };
        const id = (await tokkensMeta.add(obj)).id;
        this.setState({
          tokkenSetup_Id: id,
          tokkenSetuped: true,
          showMetaModal: false,
          meta: null,
          loading: false
        });
        return;
      }
      this.handleEditTokkens();
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
    }
  };

  handleEditTokkens = async () => {
    console.log("Editting tokkens man!!!");
    const {
      tokkenCount,
      tokkenTime,
      companyTodayTokkenData,
      tokkenSetup_Id
    } = this.state;
    try {
      const tokkensMeta = Firebase.fireStore.collection("tokkensMeta");
      const obj = {
        ...companyTodayTokkenData,
        limit: tokkenCount,
        time: tokkenTime,
        remaining: tokkenCount - companyTodayTokkenData.bought
      };
      await tokkensMeta.doc(tokkenSetup_Id).set(obj);
      console.log("Editting the obj ==>", obj);
      this.setState({ showMetaModal: false, meta: null, loading: false });
      // console.log("Editted id man!=>", tokkenSetup_Id);
    } catch (err) {
      console.log(err);
    }
  };

  //= ==================Header handles===================//

  // handle to recognize user face
  handleRecognizeUser = async () => {
    const { userImage } = this.state;
    try {
      const results = await Promise.all([
        Permissions.askAsync(Permissions.CAMERA),
        Permissions.askAsync(Permissions.CAMERA_ROLL)
      ]);
      if (!results.some(({ status }) => status !== "granted")) {
        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [5, 5]
        });
        if (!result.cancelled) {
          this.setState({ showMetaModal: false, loading: true });
          const res = await this.handleDetectFaces(result.uri);
          if (!res.faces.length) {
            this.setState({
              loading: false,
              meta: this.renderFaceRecongnizationErrorMsg(),
              showMetaModal: true
            });
            return;
          }
          this.setState({ loading: false });
          this.handleAllowCurrentTokkenUser();
        }
      }
    } catch (err) {
      this.setState({ loading: false });
      console.log(err);
    }
  };
  handleDetectFaces = async imageUri => {
    const options = { mode: FaceDetector.Constants.Mode.fast };
    return await FaceDetector.detectFacesAsync(imageUri, options);
  };

  //handle to validate current tokken status
  //status; either the today tokkens are setup, any current tokken user etc
  handleValidateCurrentTokken = async () => {
    const {
      currentUserAllowed,
      companyTodayTokkenData,
      currentTokkenUser,
      startTokkenTimer,
      tokkenTimer
    } = this.state;
    try {
      if (!companyTodayTokkenData) {
        this.setState({
          showMetaModal: true,
          meta: this.renderTokkenErrorMsg()
        });
        return;
      }
      if (!currentTokkenUser) {
        this.setState({
          showMetaModal: true,
          meta: this.renderCurrentTokkenUserErrorMsg()
        });
        return;
      }
      if (this.state.currentStartedTokkenData) {
        Alert.alert(
          "Warning",
          "Cannot start a new tokken, already a tokken is in progress",
          [
            {
              text: "Ok",
              onPress: () => console.log("Cannot start a new tokken Ok")
            }
          ]
        );
      }
      this.setState({ loading: true });
      let currentTokkenUserData = this.state.currentTokkenUserData;
      if (!currentTokkenUserData)
        currentTokkenUserData = await this.handleFetchCurrentTokkenUserData();
      this.setState({
        loading: false,
        showMetaModal: true,
        currentTokkenUserData,
        meta: this.renderStartCurrentTokken(currentTokkenUserData)
      });
      // if (!currentUserAllowed) {
    } catch (err) {
      console.log(err);
    }

    //   return;
    // }
    // if (currentUserAllowed)
    //   this.setState({
    //     showMetaModal: true,
    //     meta: this.renderCurrentStartedTokken()
    //   });
  };

  //handle to fetch the current tokken user data
  handleFetchCurrentTokkenUserData = async () => {
    try {
      const { currentTokkenUser } = this.state;
      const usersRef = Firebase.fireStore.collection("users");
      const currentTokkenUserDoc = await usersRef
        .doc(currentTokkenUser.uid)
        .get();
      if (currentTokkenUserDoc.exists) {
        return currentTokkenUserDoc.data();
      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  //show the alert confirmation to reject the current tokken user
  handleRejectCurrentTokkenConfirmation = () => {
    Alert.alert(
      "Rejection Confirmation",
      "Are you sure you want to reject the current tokken user ?",
      [
        { text: "YES", onPress: this.handleRejectCurrentTokken },
        { text: "NO", onPress: () => console.log("No dont Reject") }
      ]
    );
  };

  //handle to reject the current tokken
  handleRejectCurrentTokken = async () => {
    const { currentTokkenUser } = this.state;
    console.log("Rejecting " + currentTokkenUser.docId);
    this.setState({ loading: true, meta: null, showMetaModal: false });
    try {
      const usersTokkensMeta = Firebase.fireStore.collection("userTokkensMeta");
      await usersTokkensMeta
        .doc(currentTokkenUser.docId)
        .update({ status: "rejected" });
      this.setState({ loading: false });
    } catch (err) {
      console.log(err);
    }
  };

  //handle to allow the current tokken user and start the timmer for it
  handleAllowCurrentTokkenUser = async () => {
    const { companyTodayTokkenData, currentTokkenUser } = this.state;
    console.log("Allowing==>", currentTokkenUser.docId);
    this.setState({ loading: true });
    try {
      const tokkenTimer = companyTodayTokkenData.time * 60;
      const usersTokkensMeta = Firebase.fireStore.collection("userTokkensMeta");
      await usersTokkensMeta
        .doc(currentTokkenUser.docId)
        .update({ status: "started",started:new Date().getTime() });
      this.setState({
        loading: false,
        startTokkenTimer: true,
        tokkenTimer,
        currentStartedTokkenData: currentTokkenUser
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleOnTokkenTimeElapsed = async () => {
    const { currentStartedTokkenData } = this.state;
    try {
      this.setState({ loading: true });
      const usersTokkensMeta = Firebase.fireStore.collection("userTokkensMeta");
      await usersTokkensMeta
        .doc(currentStartedTokkenData.docId)
        .update({ status: "done" });
      this.setState({
        startTokkenTimer: false,
        tokkenTimer: null,
        loading: false,
        currentStartedTokkenData: null
      });
    } catch (err) {}
  };

  //= ==================End of Header handles===================//

  //= ==================Main handles===================//

  //= ==================End of main handles===================//

  //= ==================Footer handles===================//

  //handle to fetch the admins of the company
  handleFetchAdmins = async () => {
    const { tokkenSetup } = this.state;
    const compayRef = Firebase.fireStore.collection("company");
    try {
      const data = (await compayRef.doc(tokkenSetup.company).get()).data();
      const admins = [...data.certificates];
      this.setState({ admins });
    } catch (err) {
      console.log(err);
    }
  };

  //= ==================End of footer handles===================//

  render() {
    const { loading, meta, showMetaModal, tokkenSetuped } = this.state;
    if (loading) return <Loader loading={this.state.loading} />;
    return (
      <Container style={styles.container}>
        <Content>
          <MetaModal
            showModal={showMetaModal}
            meta={meta}
            handleOnCloseModal={() => this.setState({ showMetaModal: false })}
          />
          <NativeText style={styles.brand}>WELCOME</NativeText>
          {!tokkenSetuped && this.renderTokkenSetupMsg()}
          {tokkenSetuped && this.renderView()}
        </Content>
      </Container>
    );
  }

  renderView = () => {
    return (
      <View>
        {this.renderHeader()}
        {this.renderMain()}
        {this.renderFooter()}
      </View>
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.header} onLayout={this.handleGetSize}>
        {this.renderStepsIndicator()}
        {this.renderTokkenTimmer()}
      </View>
    );
  };

  renderMain = () => {
    return <View style={styles.main}>{this.renderCardsConatainer()}</View>;
  };

  renderFooter = () => {
    return (
      <View style={styles.footer}>
        {this.renderEditTokkens()}
        {this.renderAdmins()}
      </View>
    );
  };

  //= ==================Header methods===================//
  // method to render steps navigator
  renderStepsIndicator = () => {
    const { currentTokkenUser } = this.state;
    const labels = [
      {
        text: "Date:" + new Date().toLocaleDateString(),
        icon: (
          <Icon
            style={{ color: "white" }}
            type="MaterialIcons"
            name="date-range"
          />
        ),
        handle: null
      },
      {
        text: "Current Tokken",
        textStyle: currentTokkenUser ? styles.currentTokkenActiveText : null,
        icon: (
          <Icon
            style={[
              currentTokkenUser
                ? styles.currentTokkenActiveIcon
                : { color: "white" }
            ]}
            type="MaterialCommunityIcons"
            name="coins"
          />
        ),
        handle: this.handleValidateCurrentTokken
      },
      {
        text: "Notifications",
        icon: (
          <Icon
            style={{ color: "white" }}
            type="Ionicons"
            name="md-notifications"
          />
        ),
        handle: null
      }
    ];
    return (
      <View style={[styles.headerElements]}>
        <StepIndicator
          customStyles={customStyles.stepIndicator}
          currentPosition={-1}
          direction="vertical"
          labels={labels}
          stepCount={3}
          stepHandle={() => console.log("asd")}
        />
      </View>
    );
  };

  // method to render tokken timmer
  renderTokkenTimmer = () => {
    const {
      headerElementsSize,
      startTokkenTimer,
      companyTodayTokkenData,
      tokkenTimer
    } = this.state;
    return (
      <View style={[styles.headerElements]}>
        <View style={styles.tokkenTimmer}>
          <CountdownCircle
            seconds={
              startTokkenTimer && companyTodayTokkenData && tokkenTimer
                ? tokkenTimer
                : 0
            }
            radius={headerElementsSize ? headerElementsSize.width / 3 - 50 : 90}
            borderWidth={8}
            color="#ff003f"
            bgColor="#fff"
            textStyle={{ fontSize: 20 }}
            onTimeElapsed={this.handleOnTokkenTimeElapsed}
            updateText={this.handleTimeElapsed}
          />
        </View>
        <NativeText
          style={[
            styles.brand,
            { fontSize: 16, paddingTop: 8, backgroundColor: "transparent" }
          ]}
        >
          CURRENT TOKKEN
        </NativeText>
      </View>
    );
  };

  //method to render message to start the current tokken
  renderStartCurrentTokken = currentTokkenUserData => {
    const uri =
      "https://facebook.github.io/react-native/docs/assets/favicon.png";
    return (
      <View style={[styles.startTokkenContainer]}>
        <View style={[styles.startCurrentTokkenHeader]}>
          <Text style={styles.metaBrand}>Allow Current Tokken User</Text>
        </View>
        <View style={[styles.metaItem, { justifyContent: "center" }]}>
          <Thumbnail
            large
            source={{
              uri: currentTokkenUserData.image
                ? currentTokkenUserData.image
                : uri
            }}
          />
        </View>
        <NativeText
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10,
            marginTop: 5
          }}
        >
          {currentTokkenUserData.nickName}
        </NativeText>
        <NativeText
          style={{ fontSize: 16, color: "#757475", marginBottom: 10 }}
        >
          Email : {currentTokkenUserData.email}
        </NativeText>
        <NativeText
          style={{ fontSize: 16, color: "#757475", marginBottom: 10 }}
        >
          Phone : {currentTokkenUserData.phoneNo}
        </NativeText>
        <View style={[styles.confirmModalBtnContainer, { marginTop: 10 }]}>
          <TouchableOpacity>
            <Button
              bordered
              light
              style={{ borderColor: "#757375" }}
              onPress={this.handleRejectCurrentTokkenConfirmation}
            >
              <Text style={{ color: "#757375" }}>Reject</Text>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity>
            <Button
              bordered
              light
              style={{ borderColor: "#757375" }}
              onPress={this.handleRecognizeUser}
            >
              <Text style={{ color: "#757375" }}>Allow</Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //Method to show the info of the current started tokken user
  renderCurrentStartedTokken = () => {
    return (
      <View style={[styles.startTokkenContainer]}>
        <View style={[styles.startCurrentTokkenHeader]}>
          <Text style={styles.metaBrand}>Allow Current Tokken User</Text>
        </View>
        <View style={[styles.metaItem, { justifyContent: "center" }]}>
          <Thumbnail large source={{ uri: uri }} />
        </View>
        <NativeText
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10,
            marginTop: 5
          }}
        >
          User Name
        </NativeText>
        <NativeText
          style={{ fontSize: 16, color: "#757475", marginBottom: 10 }}
        >
          Email
        </NativeText>
        <NativeText
          style={{ fontSize: 16, color: "#757475", marginBottom: 10 }}
        >
          Address
        </NativeText>
        <View
          style={[
            styles.confirmModalBtnContainer,
            { marginTop: 10, justifyContent: "flex-end" }
          ]}
        >
          <TouchableOpacity>
            <Button
              bordered
              light
              style={{ borderColor: "#757375" }}
              onPress={() => this.setState({ showMetaModal: false })}
            >
              <Text style={{ color: "#757375" }}>OK</Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //Method to show msg that no tokkens are bought yet
  renderTokkenErrorMsg = () => {
    return (
      <View style={[styles.startTokkenContainer]}>
        <View style={[styles.startCurrentTokkenHeader]}>
          <Text style={styles.metaBrand}>Tokkens Information</Text>
        </View>
        <View>
          <Text>
            Sorry no tokkens has been bought yet, please try again later
          </Text>
        </View>
        <View
          style={[
            styles.confirmModalBtnContainer,
            { marginTop: 10, justifyContent: "flex-end" }
          ]}
        >
          <TouchableOpacity>
            <Button
              bordered
              light
              style={{ borderColor: "#757375" }}
              onPress={() => this.setState({ showMetaModal: false })}
            >
              <Text style={{ color: "#757375" }}>OK</Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //Method to show msg that no tokken user is currently available
  renderCurrentTokkenUserErrorMsg = () => {
    return (
      <View style={[styles.startTokkenContainer]}>
        <View style={[styles.startCurrentTokkenHeader]}>
          <Text style={styles.metaBrand}>Tokkens Information</Text>
        </View>
        <View>
          <Text>
            Sorry no tokken users are currently available, please try again
            later
          </Text>
        </View>
        <View
          style={[
            styles.confirmModalBtnContainer,
            { marginTop: 10, justifyContent: "flex-end" }
          ]}
        >
          <TouchableOpacity>
            <Button
              bordered
              light
              style={{ borderColor: "#757375" }}
              onPress={() => this.setState({ showMetaModal: false })}
            >
              <Text style={{ color: "#757375" }}>OK</Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //Method to show msg that application is unable to recognize user face
  renderFaceRecongnizationErrorMsg = () => {
    return (
      <View style={[styles.startTokkenContainer]}>
        <View style={[styles.startCurrentTokkenHeader]}>
          <Text style={styles.metaBrand}>Facial Reconization Error!!</Text>
        </View>
        <View>
          <Text>
            Sorry we are unable to recognize the user face, still allow or
            reject the user
          </Text>
        </View>
        <View style={[styles.confirmModalBtnContainer, { marginTop: 10 }]}>
          <TouchableOpacity>
            <Button
              bordered
              light
              style={styles.confirmModalBtn}
              onPress={() => console.log("dont allow user")}
            >
              <Text style={{ color: "#009083" }}>Reject</Text>
            </Button>
          </TouchableOpacity>

          <TouchableOpacity>
            <Button
              bordered
              light
              style={styles.confirmModalBtn}
              onPress={() => console.log("still allow user")}
            >
              <Text style={{ color: "#009083" }}>Allow</Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //= ==================End of Header methods===================//

  //= ==================Main methods===================//
  // method to render card cantainer
  renderCardsConatainer = () => {
    return (
      <View style={styles.cardContainerOverlay}>
        {this.renderCard(this.renderTotalTokkensCard())}
        {this.renderCard(this.renderBoughtTokkensCard())}
        {this.renderCard(this.renderRemainingTokkensCard())}
        {this.renderCard(this.renderWatingTokkenCard())}
      </View>
    );
  };

  // method to render a card
  renderCard = Element => {
    return <View style={styles.card}>{Element}</View>;
  };

  // method to render the card showing the total tokkens
  renderTotalTokkensCard = () => {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <View style={[styles.cardItems]}>
          <Icon
            type="Foundation"
            name="compass"
            style={[
              styles.cardIcon,
              { color: "#484848", backgroundColor: "#EAEAEA" }
            ]}
          />
        </View>
        <View>
          <NativeText style={[styles.cardMeta, { color: "#484848" }]}>
            {this.state.companyTodayTokkenData
              ? this.state.companyTodayTokkenData.limit
              : 0}
          </NativeText>
        </View>
        <View style={{ marginTop: 20 }}>
          <NativeText style={[styles.cardBrand]}>TOTAL TOKKENS</NativeText>
        </View>
      </View>
    );
  };

  // method to render the card showing the bought tokkens
  renderBoughtTokkensCard = () => {
    return (
      <View>
        <View style={[styles.cardItems]}>
          <Icon
            type="FontAwesome"
            name="universal-access"
            style={[
              styles.cardIcon,
              {
                color: "#484848",
                backgroundColor: "#EAEAEA",
                padding: 10,
                fontSize: 35
              }
            ]}
          />
        </View>
        <View>
          <NativeText style={[styles.cardMeta, { color: "#484848" }]}>
            {this.state.companyTodayTokkenData
              ? this.state.companyTodayTokkenData.bought
              : 0}
          </NativeText>
        </View>
        <View style={{ marginTop: 20 }}>
          <NativeText style={[styles.cardBrand]}>BOUGHT TOKKENS</NativeText>
        </View>
      </View>
    );
  };

  // method to render the card showing the remaining tokkens
  renderRemainingTokkensCard = () => {
    return (
      <View>
        <View style={[styles.cardItems]}>
          <Icon
            type="Foundation"
            name="social-game-center"
            style={[
              styles.cardIcon,
              { color: "#484848", backgroundColor: "#EAEAEA" }
            ]}
          />
        </View>
        <View>
          <NativeText style={[styles.cardMeta, { color: "#484848" }]}>
            {this.state.companyTodayTokkenData
              ? this.state.companyTodayTokkenData.remaining
              : 0}
          </NativeText>
        </View>
        <View style={{ marginTop: 20 }}>
          <NativeText style={[styles.cardBrand]}>REMAINING TOKKENS</NativeText>
        </View>
      </View>
    );
  };

  // method to render the card showing the next tokken
  renderWatingTokkenCard = () => {
    return (
      <View>
        <View style={[styles.cardItems]}>
          <Icon
            type="Ionicons"
            name="ios-cog"
            style={[
              styles.cardIcon,
              { color: "#484848", backgroundColor: "#EAEAEA" }
            ]}
          />
        </View>
        <View>
          <NativeText style={[styles.cardMeta, { color: "#484848" }]}>
            {this.state.companyTodayTokkenData
              ? this.state.companyTodayTokkenData.waiting
              : 0}
          </NativeText>
        </View>
        <View style={{ marginTop: 20 }}>
          <NativeText style={[styles.cardBrand]}>WAITING TOKKENS</NativeText>
        </View>
      </View>
    );
  };

  //= ==================End of Main methods===================//

  //= ==================Footer methods===================//

  // method to render edit tokkens
  renderEditTokkens = () => {
    return (
      <View style={[styles.footerItem, { marginTop: 30 }]}>
        <View style={styles.footerItemMeta}>
          <NativeText style={styles.footerItemBrand}>Edit Tokkens</NativeText>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                showMetaModal: true,
                meta: this.renderTokkenSetup("edit")
              });
            }}
          >
            <Icon
              type="MaterialCommunityIcons"
              name="circle-edit-outline"
              style={styles.footerItemIcon}
            />
          </TouchableOpacity>
        </View>
        <NativeText style={styles.footerItemText}>
          Total:
          {this.state.companyTodayTokkenData
            ? this.state.companyTodayTokkenData.limit
            : 0}
        </NativeText>
      </View>
    );
  };

  // method to render admins
  renderAdmins = () => {
    const { admins } = this.state;
    const uri =
      "https://facebook.github.io/react-native/docs/assets/favicon.png";
    return (
      <View style={[styles.footerItem, { marginTop: 10 }]}>
        <View style={styles.footerItemMeta}>
          <NativeText style={[styles.footerItemBrand]}>Admins</NativeText>
          <Icon type="Entypo" name="users" style={styles.footerItemIcon} />
        </View>
        <View style={styles.adminsContainer}>
          {admins.map((value, index) => (
            <Thumbnail
              square
              source={{ uri: value }}
              style={styles.adminItem}
              key={value + index}
            />
          ))}
        </View>
      </View>
    );
  };

  // renderTokkenTimmer = () => {}
  //= ==================End of footer methods===================//

  //= ==================Tokken Setup methods===================//

  //Method to render the tokken setup message
  renderTokkenSetupMsg = () => {
    return (
      <View>
        <View style={{ marginBottom: 15, marginTop: 15 }}>
          <Text style={styles.metaBrand}>
            You have not setup today's tokken, Please setup today's tokkens
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "row"
          }}
        >
          <TouchableOpacity>
            <Button
              bordered
              dark
              onPress={() =>
                this.setState({
                  showMetaModal: true,
                  meta: this.renderTokkenSetup()
                })
              }
            >
              <Text>Setup Tokkens</Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //Method to render the tokken setup form
  renderTokkenSetup = (type = "new") => {
    const { companyTodayTokkenData, autoStartTokken } = this.state;
    console.log("renderTokkenSetup type==>", type);
    return (
      <View>
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.metaBrand}>Please Setup Today's Tokkens</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={[styles.metaItemMeta]}>TOKKENS</Text>
          <NumericInput
            type="up-down"
            initValue={
              companyTodayTokkenData ? companyTodayTokkenData.limit : 0
            }
            onChange={value => this.setState({ tokkenCount: value })}
            value={this.state.tokkenCount}
            totalWidth={200}
            totalHeight={50}
            minValue={0}
            iconSize={35}
            rounded
          />
        </View>
        <View style={styles.metaItem}>
          <Text style={[styles.metaItemMeta]}>TIME(MIN)</Text>
          <NumericInput
            type="up-down"
            initValue={companyTodayTokkenData ? companyTodayTokkenData.time : 0}
            onChange={value => this.setState({ tokkenTime: value })}
            value={this.state.tokkenTime}
            totalWidth={200}
            totalHeight={50}
            iconSize={35}
            minValue={0}
            rounded
          />
        </View>
        <View style={styles.metaItem}>
          <TouchableOpacity>
            <Text
              style={[styles.metaItemMeta]}
              onPress={() =>
                this.setState({ autoStartTokken: !autoStartTokken })
              }
            >
              AUTO START TOKKEN
            </Text>
          </TouchableOpacity>
          <Radio
            selected={autoStartTokken}
            selectedColor="black"
            onPress={() => this.setState({ autoStartTokken: !autoStartTokken })}
          />
        </View>
        <View
          style={[styles.metaItem, { justifyContent: "center", marginTop: 10 }]}
        >
          <TouchableOpacity>
            <Button bordered dark onPress={() => this.handleSetupTokken(type)}>
              <Text>Setup</Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderTokkenSetupConfirmation = type => {
    return (
      <View>
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.metaBrand}>Setup Confirmation</Text>
        </View>
        <View style={styles.metaItem}>
          <Text>Today's tokkens: {this.state.tokkenCount}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text>Each tokken time: {this.state.tokkenTime}</Text>
        </View>
        <View style={styles.confirmModalBtnContainer}>
          <TouchableOpacity style={{ borderRadius: 5 }}>
            <Button
              light
              style={styles.confirmModalBtn}
              onPress={() => {
                this.setState({ meta: this.renderTokkenSetup(type) });
              }}
            >
              <Text style={{ color: "yellow" }}> NO </Text>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity style={{ borderRadius: 5 }}>
            <Button
              light
              style={styles.confirmModalBtn}
              onPress={() => {
                this.handleSaveTokkens(type);
              }}
            >
              <Text style={{ color: "red" }}> YES </Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //= ==================End of tokken Setup methods===================//
}
