import styles from "./style";
import _ from "lodash";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Dimensions
} from "react-native";
import {
  Item,
  Icon,
  Input,
  List,
  ListItem,
  Left,
  Right,
  Button
} from "native-base";
import { MapView } from "expo";
import { Firebase } from "../../../../Config";
import { MetaModal } from "../../../../Components";
import { FaceDetector, Permissions, ImagePicker } from "expo";
import LoaderScreen from "../../../Loader/loader";
const { Marker } = MapView;
const company = {
  address: ["Creek Club Bakery, Phase VIII, DHA", "کراچی", "پاکستان"],
  admins: ["adnanrajput22@gmail.com", "adnanrajput42@gmail.com"],
  certificates: [
    "https://firebasestorage.googleapis.com/v0/b/qapp-ca040.appspot.com/o/companyCertificates%2Fa9f942ea-9351-4157-b7e5-dbad49b9edc7.jpg?alt=media&token=25d0a999-3b2f-4e62-98a4-1660e1236861",
    "https://firebasestorage.googleapis.com/v0/b/qapp-ca040.appspot.com/o/companyCertificates%2Fdabcd738-071f-42df-8da8-d78e77e0161f.jpg?alt=media&token=cf960777-e23e-4e5c-b1e3-035adfcaba04",
    "https://firebasestorage.googleapis.com/v0/b/qapp-ca040.appspot.com/o/companyCertificates%2F11020cd1-3741-49ab-8dba-1643525141ac.jpg?alt=media&token=e062109b-f3c8-41c7-95c3-5bf732d57698"
  ],
  coords: {
    latitude: 24.8481905,
    longitude: 67.0277179
  },
  id: "Lgu1AvZFW4q1pFl76Jwq",
  lowerCaseName: "tech native",
  name: "Tech Native",
  registeredBy: "adnanrajput42@gmail.com",
  since: 1537556400000,
  timing: {
    from: {
      amPM: "AM",
      hour: "08",
      minute: "00"
    },
    to: {
      amPM: "PM",
      hour: "11",
      minute: "00"
    }
  }
};
export default class Companies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingCompanies: false,
      loading: false,
      companies: [],
      mapModal: false,
      coords: null,
      searchText: "",
      selectedCompany: null,
      showMetaModal: false,
      meta: null,
      authProfile: props.authProfile,
      todayBoughtTokken: props.todayBoughtTokken,
      currentTokkenTimer: null
    };
  }

  //component did mount
  componentDidMount() {}

  static getDerivedStateFromProps(props, state) {
    return {
      authProfile: props.authProfile,
      ...props
    };
  }

  //Handle to get the view layout size
  handleGetSize = e => {
    const { height, width } = e.nativeEvent.layout;
    console.log({ height, width });
    this.setState({ viewSize: { height, width } });
  };

  //= ==================Header handles===================//

  handleSearchCompanies = async () => {
    const { searchText } = this.state;
    this.setState({ loadingCompanies: true });
    const companiesRef = Firebase.fireStore.collection("company");
    try {
      let companies = [];
      if (searchText) {
        const query = companiesRef.where(
          "lowerCaseName",
          "==",

          searchText.toLowerCase()
        );
        const snap = await query.get();
        snap.forEach(doc => {
          companies = companies.concat(doc.data());
        });
      }
      this.setState({ companies, loadingCompanies: false });
    } catch (Err) {
      console.log(Err);
    }
  };

  renderProfileErr = () => {
    return (
      <View>
        <Text style={styles.profileErrBrand}>Profile not setup :(</Text>
        <Text style={styles.profileErrText}>Please setup your profile</Text>
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

  //= ==================End of Header handles===================//

  //= ==================Main handles===================//

  handleCompanySelected = async value => {
    this.setState({ loadingCompanies: true });
    const { todayBoughtTokken } = this.state;
    let isTodayTokkensBought = todayBoughtTokken
      ? todayBoughtTokken
      : await this.props.handleValidateTodayTokkens();
    if (isTodayTokkensBought) {
      Alert.alert(
        "Unable to buy a tokken!!",
        "Today's tokken is already bought, please try later on tomorrow",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      this.setState({ loadingCompanies: false });
      return;
    }
    console.log("not bought man!");
    this.setState(
      {
        selectedCompany: value,
        loadingCompanies: false
      },
      () =>
        this.setState({ meta: this.renderCompanyMeta(), showMetaModal: true })
    );
  };

  //handle to take the snap of the user
  handleTakeSnap = async () => {
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
          return result.uri;
        }
        return null;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  //handle to recognize user face
  handleRecognizeUser = async () => {
    try {
      const options = {
        mode: FaceDetector.Constants.Mode.fast,
        detectLandmarks: FaceDetector.Constants.Landmarks.all
      };
      const uri = await this.handleTakeSnap();
      if (uri) {
        const { faces, image } = await FaceDetector.detectFacesAsync(
          uri,
          options
        );
        if (faces.length) {
          return {
            res: { faces, image },
            err: null,
            status: 200
          };
        }
        return {
          res: null,
          err: null,
          status: 404
        };
      }
      return {
        res: null,
        err: null,
        status: 500
      };
    } catch (err) {
      console.log(err);
      return {
        res: null,
        err,
        status: 505
      };
    }
  };

  //Validate user face to buy a tokken
  handleValidateUserFace = async () => {
    this.setState({ showMetaModal: false, meta: null, loading: true });
    try {
      const { res, status, err } = await this.handleRecognizeUser();
      console.log("handleValidateUserFace res==>", res);
      if (res && status === 200) {
        //buy a tokken
        await this.handleBuyATokken(res);
        this.setState({ loading: false });
        return;
      }
      if (status === 404) {
        //unable to recognize face
        this.setState({ loading: false });
        Alert.alert(
          "Face Not Detected!!",
          "Unable to recognize the face, please try again later",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        return;
      }
      if (status === 505) {
        // err
        this.setState({ loading: false });
        Alert.alert(
          "Error!!",
          err,
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  //buy a tokken for the user
  handleBuyATokken = async res => {
    try {
      const { authProfile, selectedCompany } = this.state;
      //DB Reference
      const userTokkensMetaRef = Firebase.fireStore.collection(
        "userTokkensMeta"
      );
      const userTokkenTime = await this.handleGetUserTokkenTime();
      if (!userTokkenTime.status) {
        console.log("sorry cannot buy");
        return;
      }
      //user tokken timing
      const metaObj = {
        user: authProfile,
        uid: authProfile.uid,
        date: new Date().toDateString(),
        started: null,
        company: selectedCompany,
        userFace: res,
        status: "not set",
        ...userTokkenTime.userTokkenTime
      };
      const docId = (await userTokkensMetaRef.add(metaObj)).id;
      if (docId)
        Alert.alert(
          "Tokken Information",
          "Tokken Bought Successfull :)",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
    } catch (err) {
      console.log(err);
      // Alert.alert(
      //   "Error!!",
      //   err,
      //   [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      //   { cancelable: false }
      // );
    }
  };

  //get the tokken time of current selected company to buy a tokken
  handleFetchCompanyTokkenSetup = async () => {
    const { selectedCompany } = this.state;
    try {
      const tokkensMetaRef = Firebase.fireStore.collection("tokkensMeta");
      const query = tokkensMetaRef
        .where("date", "==", new Date().toDateString())
        .where("companyId", "==", selectedCompany.id);
      const snap = await query.get();
      let data = null;
      snap.forEach(doc => {
        data = doc.data();
      });
      return data;
    } catch (err) {}
  };

  //handle to check if any tokken is already bought
  //or the company timing is closed than buy tokken for next day
  handleValidateLastBoughtTokkenTime = (
    selectedCompanyOpeningTimeObj,
    selectedCompanyClosingTimeObj,
    selectedCompanyTokkenSetup
  ) => {
    let resObj = null;
    let lastBoughtTokkenData = null;
    let userTokkenTime = null;
    try {
      // get the last tokken bought time
      const eachTokkenTime_Min = selectedCompanyTokkenSetup.time;
      const now = new Date();
      const closingTime = new Date().setHours(
        selectedCompanyClosingTimeObj.hours,
        selectedCompanyClosingTimeObj.minutes
      );
      const tokkenTime = now.setMinutes(now.getMinutes() + eachTokkenTime_Min);
      userTokkenTime = {
        time: tokkenTime,
        formatedTime: {
          hours: new Date(tokkenTime).getHours(),
          minutes: new Date(tokkenTime).getMinutes()
        }
      };
      resObj = {
        status: tokkenTime < closingTime,
        userTokkenTime
      };
      return resObj;
      // lastBoughtTokkenData = await this.handleFilterLastBoughtTokken();
      // if (lastBoughtTokkenData) {

      // }
    } catch (err) {
      console.log(err);
    }
  };

  //handle to filter the last bought tokken
  handleFilterLastBoughtTokken = async () => {
    const { selectedCompany } = this.state;
    let lastBoughtTokkenData = null;
    const userTokkensMeta = Firebase.fireStore.collection("userTokkensMeta");
    try {
      const query = userTokkensMeta
        .where("date", "==", new Date().toDateString())
        .where("company.id", "==", selectedCompany.id)
        .orderBy("time", "desc")
        .limit(1);
      const snap = await query.get();
      snap.forEach(doc => {
        lastBoughtTokkenData = doc.data();
      });
      return lastBoughtTokkenData;
    } catch (err) {
      console.log(err);
    }
  };

  //get the tokken timing of the user
  handleGetUserTokkenTime = async () => {
    const { selectedCompany } = this.state;
    let now = new Date();
    let nowFloat = now.getHours() + now.getMinutes() / 60;
    let selectedCompanyTokkenSetup = null;
    let selectedCompanyOpeningTimeObj = null;
    let selectedCompanyClosingTimeObj = null;
    let selectedCompanyOpeningTimeFloat = null;
    let selectedCompanyClosingTimeFloat = null;
    let selectedCompanyTokkensLimt = null;
    let selectedCompanyTokkensBought = null;
    //=======================================================================//
    //===============Get the company opening and closing time==============//
    //=====================================================================//
    //convert the opening hour formate from 12 to 24
    let selectedCompanyOpeningHours =
      selectedCompany.timing.from.amPM == "AM"
        ? +selectedCompany.timing.from.hour
        : +selectedCompany.timing.from.hour + 12;
    //convert the closing hour formate from 12 to 24
    let selectedCompanyClosingHours =
      selectedCompany.timing.to.amPM == "AM"
        ? +selectedCompany.timing.to.hour
        : +selectedCompany.timing.to.hour + 12;

    // get the opening time in obj formate
    selectedCompanyOpeningTimeObj = {
      hours: selectedCompanyOpeningHours,
      minutes: +selectedCompany.timing.from.minute
    };

    // get the closing time in obj formate
    selectedCompanyClosingTimeObj = {
      hours: selectedCompanyClosingHours,
      minutes: +selectedCompany.timing.to.minute
    };

    // get the opening time in float
    selectedCompanyOpeningTimeFloat =
      selectedCompanyOpeningTimeObj.hours +
      selectedCompanyOpeningTimeObj.minutes / 60;

    // get the closing time in float
    selectedCompanyClosingTimeFloat =
      selectedCompanyClosingTimeObj.hours +
      selectedCompanyClosingTimeObj.minutes / 60;
    //=======================================================================//
    //======================================================================//
    //=====================================================================//

    try {
      // if now time is greater than company closing time and less than opening time
      // it means the company is closed show the alert
      if (
        nowFloat > selectedCompanyClosingTimeFloat &&
        nowFloat < selectedCompanyOpeningTimeFloat
      ) {
        Alert.alert(
          "Tokken Error!!",
          "Sorry we are unable to buy the tokken, " +
            "the company is currently closed",
          [{ text: "OK", onPress: () => console.log("OK") }]
        );
        return;
      }

      //validate if the company today tokken is setup and
      // get the company each tokken duration in seconds
      selectedCompanyTokkenSetup = await this.handleFetchCompanyTokkenSetup();
      if (!selectedCompanyTokkenSetup) {
        Alert.alert(
          "Tokken Error!!",
          "Sorry we are unable to buy the tokken, " +
            "the company has not yet setup todays tokken please try again later",
          [{ text: "OK", onPress: () => console.log("OK") }]
        );
        return;
      }

      selectedCompanyTokkenTime = selectedCompanyTokkenSetup.time * 60;
      selectedCompanyTokkensLimt = selectedCompanyTokkenSetup.limit;
      selectedCompanyTokkensBought = selectedCompanyTokkenSetup.bought;

      //if the tokken limt is over than dont buy a tokken and show the alert msg to user
      if (selectedCompanyTokkensBought == selectedCompanyTokkensLimt) {
        Alert.alert(
          "Tokken Erro!!",
          "Sorry we are unable to buy the tokken :(, " +
            "the companys todays tokken limit is over, please try later",
          [{ text: "OK", onPress: () => console.log("OK") }]
        );
        return;
      }

      // validate if adding new tokken the company closing
      // timing is not exceeded than return the user tokken time
      const tokkenRes = this.handleValidateLastBoughtTokkenTime(
        selectedCompanyOpeningTimeObj,
        selectedCompanyClosingTimeObj,
        selectedCompanyTokkenSetup
      );
      if (!tokkenRes.status) {
        Alert.alert(
          "Tokken Erro!!",
          "Sorry we are unable to buy the tokken :(, " +
            "the companys todays tokken limit is over, please try later",
          [{ text: "OK", onPress: () => console.log("OK") }]
        );
        return;
      }
      return tokkenRes;
    } catch (err) {
      console.log(err);
    }
  };

  //= ==================End of Main handles===================//

  render() {
    const { authProfile, loading } = this.state;
    if (loading)
      return (
        <View
          style={{
            zIndex: 1,
            height: Dimensions.get("window").height - 125,
            width: Dimensions.get("screen").width,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ActivityIndicator size="large" color="#000000" animating={loading} />
        </View>
      );
    if (!authProfile) return this.renderProfileErr();
    return this.renderView();
  }

  //render view
  renderView = () => {
    const { showMetaModal, meta } = this.state;
    return (
      <View onLayout={this.handleGetSize}>
        <MetaModal
          showModal={showMetaModal}
          meta={meta}
          handleOnCloseModal={() => this.setState({ showMetaModal: false })}
        />
        {this.renderHeader()}
        {this.renderMain()}
      </View>
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.headerBrand}>Search Companies</Text>
        <View style={styles.searchItemContainer}>
          {this.renderSearchCompany()}
        </View>
      </View>
    );
  };

  renderMain = () => {
    return (
      <View style={[styles.main]}>
        {this.renderCompaniesList()}
        {this.renderMapModal()}
      </View>
    );
  };

  //= ==================Header methods===================//

  //Method to render the search company textbox
  renderSearchCompany = () => {
    const { viewSize } = this.state;
    return (
      <View style={[{ width: viewSize ? viewSize.width - 40 : 185 }]}>
        <Item rounded style={{ paddingLeft: 8, paddingRight: 8 }}>
          <Input
            placeholder="Search companies..."
            onChangeText={text => this.setState({ searchText: text })}
          />
          <TouchableOpacity
            onPress={this.handleSearchCompanies}
            // onPress={this.handleBuyATokken}
          >
            <Icon name="search" type="FontAwesome" />
          </TouchableOpacity>
        </Item>
      </View>
    );
  };

  //= ==================End of Header methods===================//

  //= ==================Main methods===================//

  renderCompaniesList = () => {
    const { loadingCompanies, companies } = this.state;
    if (loadingCompanies)
      return (
        <View style={styles.loadingCompanyContainer}>
          <ActivityIndicator
            size="large"
            color="#000000"
            animating={loadingCompanies}
          />
        </View>
      );
    return (
      <List>
        {companies.map((value, index) => (
          <TouchableOpacity key={value.name + index}>
            <ListItem
              style={{ marginLeft: 0 }}
              onLongPress={() => {
                this.setState({ mapModal: true, coords: value.coords });
              }}
              onPress={() => {
                this.handleCompanySelected(value);
              }}
            >
              <Left>
                <Text style={{ paddingLeft: 10 }}>Simon Mignolet</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </TouchableOpacity>
        ))}
      </List>
    );
  };

  //Method render the map modal
  renderMapModal = () => {
    const { mapModal, coords } = this.state;
    if (coords) {
      return (
        <Modal
          animationType="slide"
          transparent={false}
          visible={mapModal && coords ? true : false}
          onRequestClose={() => {
            this.setState({ mapModal: false });
          }}
        >
          {this.renderMap()}
        </Modal>
      );
    }
  };

  //Method to render the map in the map modal
  renderMap = () => {
    const { coords } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: coords ? coords.latitude : 33.738045,
            longitude: coords ? coords.longitude : 73.084488,
            latitudeDelta: 0.004,
            longitudeDelta: 0.003
          }}
        >
          {coords && <Marker coordinate={coords} />}
        </MapView>
        <Button rounded danger style={styles.closeMapBtn}>
          <TouchableOpacity
            onPress={() => {
              this.setState({ mapModal: false });
            }}
          >
            <Icon type="FontAwesome" name="close" />
          </TouchableOpacity>
        </Button>
      </View>
    );
  };

  //Method to render the company meta on modal
  renderCompanyMeta = () => {
    const { selectedCompany } = this.state;
    return (
      <View>
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.metaCompanyBrand}>{selectedCompany.name}</Text>
        </View>
        <View style={styles.metaCompanyItem}>
          <View style={{ margin: 5 }}>
            <Text style={styles.metaCompanyItemMeta}>
              CEO:{selectedCompany.registeredBy}
            </Text>
          </View>
          <View style={{ margin: 5 }}>
            <Icon name="user" type="FontAwesome" />
          </View>
        </View>
        <View style={styles.metaCompanyItem}>
          <View style={{ margin: 5 }}>
            <Text style={[styles.metaCompanyItemMeta]}>
              ADDRESS:{this.renderAddress(selectedCompany.address)}
            </Text>
          </View>
          <View style={{ margin: 5 }}>
            <Icon name="location-on" type="MaterialIcons" />
          </View>
        </View>
        <View style={styles.metaCompanyItem}>
          <View style={{ margin: 5 }}>
            <Text style={[styles.metaCompanyItemMeta]}>
              Timing:{" "}
              {selectedCompany.timing.from.hour +
                ":" +
                selectedCompany.timing.from.minute +
                " " +
                selectedCompany.timing.from.amPM +
                " - " +
                selectedCompany.timing.to.hour +
                ":" +
                selectedCompany.timing.to.minute +
                " " +
                selectedCompany.timing.from.amPM}
            </Text>
          </View>
          <View style={{ margin: 5 }}>
            <Icon name="location-on" type="MaterialIcons" />
          </View>
        </View>
        <View style={styles.metaCompanyItem}>
          <View style={{ margin: 5, marginTop: 10 }}>
            <Text
              style={[
                styles.metaCompanyItemMeta,
                { textAlign: "center", fontSize: 16, fontWeight: "bold" }
              ]}
            >
              Do you want to buy a tokken ?
            </Text>
          </View>
        </View>
        <View style={styles.metaCompanyItem}>
          <TouchableOpacity style={{ borderRadius: 5 }}>
            <Button
              light
              style={styles.confirmModalBtn}
              onPress={() =>
                this.setState({ showMetaModal: false, meta: null })
              }
            >
              <Text style={{ color: "#007F6D", fontWeight: "bold" }}> NO </Text>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity style={{ borderRadius: 5 }}>
            <Button
              light
              style={styles.confirmModalBtn}
              onPress={this.handleValidateUserFace}
            >
              <Text style={{ color: "#007F6D", fontWeight: "bold" }}>
                {" "}
                YES{" "}
              </Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //Get the address in perfect formate
  renderAddress = address => {
    let address_d = ` `;
    for (let i = 0; i < address.length; i++) {
      address_d += `${address[i]}`;
    }
    return address_d;
  };

  //= ==================End of Main methods===================//
}
