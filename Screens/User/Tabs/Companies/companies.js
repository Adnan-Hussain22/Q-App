import styles from "./style";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert
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
const { Marker } = MapView;
export default class Companies extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingCompanies: false,
      companies: [],
      mapModal: false,
      coords: null,
      searchText: "",
      selectedCompany: null,
      showMetaModal: false,
      meta: null,
      authProfile: props.authProfile,
      boughtTokkens: props.boughtTokkens
    };
  }

  static getDerivedStateFromProps(props, state) {
    return {
      authProfile: props.authProfile,
      boughtTokkens: props.boughtTokkens
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
    const { boughtTokkens } = this.state;
    let isTodayTokkensBought = boughtTokkens
      ? boughtTokkens
      : await this.props.handleValidateTokkens();
    if (isTodayTokkensBought) {
      Alert.alert(
        "Unable to buy a tokken!!",
        "Today's tokken is already bought, please try later on tomorrow",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
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
    this.setState({ showMetaModal: false, meta: null });
    const { res, status, err } = await this.handleRecognizeUser();
    console.log("handleValidateUserFace res==>", res);
    if (res && status === 200) {
      //buy a tokken
      this.handleBuyATokken(res);
      return;
    }
    if (status === 404) {
      //unable to recognize face
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
      Alert.alert(
        "Error!!",
        err,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      return;
    }
  };

  //buy a tokken for the user
  handleBuyATokken = async res => {
    const { authProfile, selectedCompany } = this.state;
    const userTokkensMetaRef = Firebase.fireStore.collection("userTokkensMeta");
    try {
      const metaObj = {
        user: authProfile,
        uid: authProfile.uid,
        date: new Date().toDateString(),
        company: selectedCompany,
        userFace: res,
        status: "not set"
      };
      const docId = (await userTokkensMetaRef.add(metaObj)).id;
      if (docId)
        Alert.alert(
          "Tokken Bought :)",
          "Tokken Bought Successfull",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
    } catch (err) {
      Alert.alert(
        "Error!!",
        err,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
    }
  };

  //= ==================End of Main handles===================//

  render() {
    const { authProfile } = this.state;
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
          <TouchableOpacity onPress={this.handleSearchCompanies}>
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
