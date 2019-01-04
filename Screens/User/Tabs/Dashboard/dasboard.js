import React from "react";
import CountdownCircle from "react-native-countdown-circle";
import {
  View,
  Text as NativeText,
  ActivityIndicator,
  TouchableOpacity,
  AsyncStorage,
  Alert
} from "react-native";
import styles from "./style";
import { Button, Text } from "native-base";
import { Firebase } from "../../../../Config";
export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      authProfile: props.userProfile,
      boughtTokkens: null,
      currentAuth: null
    };
  }

  async componentDidMount() {
    const currentAuth = JSON.parse(await AsyncStorage.getItem("authUser"));
    // const boughtTokkens = await this.handleValidateTokkens(currentAuth);
    this.setState({ loading: false, currentAuth });
  }

  static getDerivedStateFromProps(props, state) {
    return { authProfile: props.userProfile };
  }

  //= ==================Header handles===================//

  handleUpdateTokkenTime(secondsElapsed, totalSeconds) {
    if (totalSeconds > 0) return totalSeconds - secondsElapsed;
    return 0;
  }

  //Handle to get the view layout size
  handleGetSize = e => {
    const { height, width } = e.nativeEvent.layout;
    console.log({ height, width });
    this.setState({ viewSize: { height, width } });
  };

  handleValidateTokkens = async currentAuth => {
    console.log("handleValidateTokkens");
    const userTokkensMetaRef = Firebase.fireStore.collection("userTokkensMeta");
    try {
      let boughtTokkens = null;
      const query = userTokkensMetaRef.where("uid", "==", currentAuth.uid);
      const snap = await query.get();
      if (snap.size) {
        let tokkensData = [];
        snap.forEach(doc => {
          const data = doc.data();
          tokkensData = tokkensData.concat(data);
        });
        boughtTokkens = { tokkensData, uid: currentAuth.uid };
      }
      return boughtTokkens;
    } catch (err) {
      Alert.alert(
        "Error!!",
        err,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      return null;
    }
  };

  //= ==================End of Header handles===================//

  //= ==================Main handles===================//

  //= ==================End of Main handles===================//

  render() {
    const { loading, authProfile, boughtTokkens } = this.state;
    console.log("Dashboard authProfile ==>", authProfile);
    if (loading)
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000000" animating={loading} />
        </View>
      );
    if (!authProfile) return this.renderProfileErr();

    if (!boughtTokkens) return this.renderTokkensErr();

    return this.renderView();
  }

  //render view
  renderView = () => {
    return (
      <View>
        {this.renderHeader()}
        {this.renderMain()}
      </View>
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.header}>{this.renderCurrentTokkenStatus()}</View>
    );
  };

  renderMain = () => {
    const { boughtTokkens } = this.state;
    return (
      <View style={styles.main}>
        {this.renderCards(
          this.renderCard(boughtTokkens.bought, "Bought Tokkens", "#0C8040")
        )}
        {this.renderCards(
          this.renderCard(boughtTokkens.waiting, "Waiting Tokkens", "#EC3646")
        )}
        {this.renderCards(
          this.renderCard(boughtTokkens.done, "Done Tokkens", "#52A5DD")
        )}
      </View>
    );
  };

  renderProfileErr = () => {
    return (
      <View>
        <NativeText style={styles.profileErrBrand}>
          Profile not setup :(
        </NativeText>
        <NativeText style={styles.profileErrText}>
          Please setup your profile
        </NativeText>
        <TouchableOpacity>
          <Button
            block
            dark
            bordered
            style={{ marginLeft: 20, marginRight: 20 }}
            onPress={() => this.props.handleChangePage(2)}
          >
            <Text>Setup</Text>
          </Button>
        </TouchableOpacity>
      </View>
    );
  };

  renderTokkensErr = () => {
    return (
      <View>
        <NativeText style={styles.profileErrBrand}>
          Tokkens Not Bought Yet :(
        </NativeText>
        <NativeText style={styles.profileErrText}>
          Please buy some tokkens or search for companies
        </NativeText>
        <TouchableOpacity>
          <Button
            block
            dark
            bordered
            style={{ marginLeft: 20, marginRight: 20 }}
            onPress={() => this.props.handleChangePage(1)}
          >
            <Text>Buy Tokkens</Text>
          </Button>
        </TouchableOpacity>
      </View>
    );
  };

  //= ==================Header methods===================//

  //Method to render the current tokken status
  renderCurrentTokkenStatus = () => {
    const { viewSize } = this.state;
    return (
      <View>
        <View style={styles.currentTokkenTimmer}>
          <CountdownCircle
            seconds={0}
            radius={viewSize ? viewSize.width / 2 - 135 : 45}
            borderWidth={8}
            color="#ff003f"
            bgColor="#fff"
            textStyle={{ fontSize: 20 }}
            onTimeElapsed={() => console.log("Elapsed!")}
            updateText={this.handleUpdateTokkenTime}
          />
        </View>
        <NativeText
          style={{
            fontSize: 16,
            paddingTop: 8,
            backgroundColor: "transparent"
          }}
        >
          CURRENT TOKKEN
        </NativeText>
      </View>
    );
  };

  //= ==================End of Header methods===================//

  //= ==================Main methods===================//

  //To render the card
  renderCards = Element => {
    return <View style={styles.card}>{Element}</View>;
  };

  //To display total buyed cards
  renderCard = (circleStatistics, brand, color) => {
    return (
      <View>
        <View style={styles.cardUpperColorContainer}>
          <View style={[styles.cardUppercolor, { backgroundColor: color }]} />
        </View>
        <View style={[styles.circleStatisticsContainer]}>
          <View style={styles.circleStatistics}>
            <NativeText style={styles.cardStatisticsMetaText}>
              {circleStatistics}
            </NativeText>
          </View>
        </View>
        <NativeText
          style={[styles.cardStatisticsMetaText, styles.cardStatisticsBrand]}
        >
          {brand.toUpperCase()}
        </NativeText>
      </View>
    );
  };

  //= ==================End of statistics methods===================//
}
