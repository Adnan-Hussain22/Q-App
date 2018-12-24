import React from "react";
import {
  TimePickerAndroid,
  Modal,
  Alert,
  ActivityIndicator,
  DatePickerAndroid,
  TouchableOpacity,
  Button as NativeButton,
  findNodeHandle
} from "react-native";
import styles from "./style";
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  DatePicker,
  Text,
  Button,
  Icon,
  View,
  Thumbnail,
  List,
  ListItem,
  Left,
  Right,
  SwipeRow
} from "native-base";
import { ImagePicker, MapView, Permissions, Camera } from "expo";
import { Firebase } from "../../Config";
const { Marker } = MapView;
const apiEndPoint = `https://api.foursquare.com/v2/venues`;
export default class CompanyData extends React.Component {
  state = {
    textCompany: "",
    date: new Date().getTime(),
    certificates: [],
    isTimePickerVisible: false,
    timing: null,
    date: null,
    mapModal: false,
    coords: null,
    isReady: true,
    companyList: [],
    company: null,
    showCompanyList: false,
    formValidated: false,
    hasCameraPermission: null,
    cameraType: Camera.Constants.Type.front
  };
  componentDidMount() {
    // if (this.props.navigation.state && this.props.navigation.state.params)
    //   this.setState({
    //     companyList: this.props.navigation.state.params.companyList,
    //     company: this.props.navigation.state.params.companyList
    //   });
    // console.log(this.props.navigation.state.params);
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({ coords: position.coords });
    });
  }

  handleSetDate = date => {
    this.setState({ date });
  };

  handleOpenImagePicker = async type => {
    const { certificates } = this.state;
    if (type == "lib") {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4.5, 4.5]
      });
      if (!result.cancelled) {
        this.setState({ certificates: certificates.concat(result.uri) });
      }
    } else {
      const results = await Promise.all([
        Permissions.askAsync(Permissions.CAMERA),
        Permissions.askAsync(Permissions.CAMERA_ROLL)
      ]);
      if (!results.some(({ status }) => status !== "granted")) {
        let result = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4.5, 4.5]
        });
        if (!result.cancelled) {
          this.setState({ certificates: certificates.concat(result.uri) });
        }
      }
    }
  };

  handleDatePicker = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date(),
        maxDate : new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        this.setState({ date: new Date(year, month, day).getTime() });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  handleTimePicker = async type => {
    const { timing } = this.state;
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: 12,
        minute: 0,
        is24Hour: false // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // if (hour > 12)
        // this.handleFilterTiming({ hour: hour - 12, minute, amPM: "PM" },type);
        this.setState({
          timing: {
            ...timing,
            [type]: this.handleFilterTiming(hour, minute)
          }
        });
        // else
        // this.handleFilterTiming({ hour, minute, amPM: "AM" },type);
      }
    } catch ({ code, message }) {
      console.warn("Cannot open time picker", message);
    }
  };

  handleFilterTiming = (hour, minute) => {
    let Hour = hour;
    let Minute = minute;
    let AmPm = "AM";
    //check if hour > 12, convert into AM/PM
    if (hour > 12) {
      AmPm = "PM";
      Hour = Hour - 12;
    }
    //check if it is 0 than convert into 12
    if (Hour == 0) Hour = 12;
    //convert hour into 00 formate
    if (Hour < 10) Hour = `0${Hour}`;
    else Hour = `${Hour}`;
    //convert minute into 00 formate
    if (Minute < 10) Minute = `0${Minute}`;
    else Minute = `${Minute}`;
    return { hour: Hour, minute: Minute, amPM: AmPm };
  };

  handleSearchCompany = () => {
    this.setState({ isReady: false });
    const { companyName, companyList } = this.state;
    const fetchingQuery =
      "client_id=YKEVHX1NOP0GJ3B43HMSVGI4B2C4MC2DQCOR2JLOMYDLFT3P&client_secret=W2NEO2HSNV5BAOSEWCUO4HGGVFPF5G3RIBCVJBHKAEUK0OKM&v=20180323&limit=20&ll=24.844725332577944,67.0297252269836";
    const query = companyName ? `&query=${companyName}` : "";
    fetch(`${apiEndPoint}/search?${fetchingQuery}${query}`)
      .then(res => res.json())
      .then(json => {
        console.log("fetched");
        this.setState({
          companyList: json.response.venues,
          isReady: true,
          showCompanyList: true
        });
      })
      .catch(err => {
        console.log("Failed to fetch!", err);
        this.setState({ isReady: true });
      });
  };

  handleSelectCompany = (value, index) => {
    this.setState({ company: value, showCompanyList: false });
  };

  ImageToBlog(uri) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", uri);
      xhr.responseType = "blob"; // convert type
      xhr.send();
    });
  }

  handleSaveImagesToStorage = async () => {
    const { certificates } = this.state;
    let images = [];
    const storageRef = Firebase.App.storage().ref();
    try {
      for (let i = 0; i < certificates.length; i++) {
        const imageBlob = await this.ImageToBlog(certificates[i]);
        const imageRef = storageRef.child(
          "companyCertificates/" + imageBlob.data.name
        );
        const snapshot = await imageRef.put(imageBlob);
        const url = await snapshot.ref.getDownloadURL();
        images = images.concat(url);
      }
      return images;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  handleSaveData = async () => {
    console.log("submitting man!");
    const { date, company, timing, textCompany } = this.state;
    const companiesRef = Firebase.fireStore.collection("company");
    const obj = {
      company: textCompany,
      since: date,
      timing,
      certificates: await this.handleSaveImagesToStorage()
    };
    companiesRef.add(obj).then(res => {
      console.log("Successfully added to firebase");
    });
  };

  handleSwitchMode = () => {
    const { type } = this.state;
    if (type == Camera.Constants.Type.front)
      this.setState({ type: Camera.Constants.Type.back });
    else this.setState({ type: Camera.Constants.Type.front });
  };

  handleRemoveImage = index => {
    const { certificates } = this.state;
    certificates.splice(index, 1);
    this.setState({ certificates });
  };

  render() {
    const { isReady, showCompanyList, companyList } = this.state;
    if (!isReady) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator
            size="large"
            color="#000000"
            animating={!isReady}
          />
        </View>
      );
    }
    if (showCompanyList && companyList.length) return this.renderCompanyList();
    return this.renderView();
  }

  renderCompanyList = () => {
    const { company, companyList } = this.state;
    return (
      <Container style={styles.companiesContainer}>
        <Content>
          <List>
            {companyList.length &&
              companyList.map((value, index) => (
                <ListItem
                  key={value.name + index}
                  onPress={() => {
                    this.handleSelectCompany(value, index);
                  }}
                >
                  <Left>
                    <Text>{value.name}</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </ListItem>
              ))}
          </List>
        </Content>
      </Container>
    );
  };

  renderView = () => {
    const { date } = this.state;
    return (
      <Container style={[styles.container]}>
        <Content>
          {/* {this.renderAwesomeAlert()} */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Company Registration</Text>
          </View>
          <Item>
            <Input
              placeholder="Enter company name"
              style={[{ paddingLeft: 5 }, styles.text]}
              onChange={e => {
                console.log(e.nativeEvent);
              }}
              onChangeText={text => {
                this.setState({
                  textCompany: text
                });
              }}
            />
            <Icon type="MaterialCommunityIcons" name="briefcase-outline" />
          </Item>
          {this.state.companyValidator &&
            !this.state.companyValidator.validated && (
              <View>
                <Text style={[styles.companyValidator]}>
                  {this.state.companyValidator &&
                    this.state.companyValidator.text}
                </Text>
              </View>
            )}
          <View
            style={[
              { marginTop: 10 },
              styles.borderBottomLightGrey,
              styles.flexCorners
            ]}
          >
            <Text style={[styles.text, { marginLeft: 5 }]}>
              Since: {date ? new Date(date).toLocaleDateString() : null}
            </Text>
            <TouchableOpacity onPress={this.handleDatePicker}>
              <Icon
                type="MaterialIcons"
                name="date-range"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            {/* <DatePicker
              defaultDate={new Date()}
              locale={"en"}
              timeZoneOffsetInMinutes={undefined}
              modalTransparent={false}
              animationType={"fade"}
              androidMode={"default"}
              textStyle={{ color: "green" }}
              placeHolderTextStyle={{ color: "#d3d3d3" }}
              onDateChange={this.handleSetDate}
            /> */}
          </View>
          <View
            style={[styles.timepickerContainer, styles.borderBottomLightGrey]}
          >
            <View>{this.renderTiming()}</View>
            <View style={styles.timepickerIcons}>
              <TouchableOpacity
                onPress={() => {
                  this.handleTimePicker("from");
                }}
              >
                <Icon
                  type="FontAwesome"
                  name="arrow-circle-o-left"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.handleTimePicker("to");
                }}
              >
                <Icon
                  type="FontAwesome"
                  name="arrow-circle-o-right"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10
            }}
          >
            <Text style={styles.text}> Add Certificates </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.handleOpenImagePicker("cam");
                }}
              >
                <Icon
                  type="FontAwesome"
                  name="camera"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.handleOpenImagePicker("lib");
                }}
              >
                <Icon
                  type="FontAwesome"
                  name="image"
                  style={{ marginRight: 10 }}
                />
              </TouchableOpacity>
            </View>
          </View>
          {this.renderImages()}
          {this.renderModel()}
          <Item>
            <Input
              placeholder="Search your company"
              onChangeText={text => {
                this.setState({ companyName: text });
              }}
            />
            <TouchableOpacity onPress={this.handleSearchCompany}>
              <Icon type="FontAwesome" name="search" />
            </TouchableOpacity>
          </Item>
          {this.state.companyList && this.state.companyList.length > 0 && (
            <View style={{ marginTop: 10, marginBottom: 10, marginLeft: 3 }}>
              <Button
                bordered
                dark
                onPress={() => {
                  this.setState({ showCompanyList: true });
                }}
              >
                <Text style={styles.text}>Show companies</Text>
              </Button>
            </View>
          )}
          {this.state.company && this.renderCompany()}
          <View style={[styles.flexCenter, { marginTop: 10 }]}>
            <Button bordered dark onPress={this.handleSaveData}>
              <Text style={styles.text}>Register</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  };

  renderCompany = () => {
    const { company } = this.state;
    return (
      <SwipeRow
        leftOpenValue={75}
        rightOpenValue={-75}
        left={
          <Button
            success
            onPress={() => {
              this.setState({
                coords: {
                  latitude: company.location.lat,
                  longitude: company.location.lng
                },
                mapModal: true
              });
            }}
          >
            <Icon active type="FontAwesome" name="map-marker" />
          </Button>
        }
        body={
          <View style={{ padding: 5 }}>
            <Text style={styles.text}>{this.state.company.name}</Text>
          </View>
        }
        right={
          <Button
            danger
            onPress={() => {
              this.setState({ coords: null, company: null });
            }}
          >
            <Icon active name="trash" />
          </Button>
        }
      />
    );
  };

  renderImages = () => {
    const { certificates } = this.state;
    const uri =
      "https://facebook.github.io/react-native/docs/assets/favicon.png";
    return (
      <View style={styles.imagesContainer}>
        {certificates.length > 0 ? (
          certificates.map((value, index) => (
            <View style={{ position: "relative" }} key={value + index}>
              <Thumbnail
                square
                large
                source={{
                  uri: value
                }}
                style={styles.imageThumb}
              />
              <View style={styles.imageCloseBtnCont}>
                <TouchableOpacity
                  onPress={() => {
                    this.handleRemoveImage(index);
                  }}
                >
                  <Icon
                    name="circle-with-minus"
                    type="Entypo"
                    style={styles.imageCloseBtn}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No Certificates Added</Text>
        )}
      </View>
    );
  };

  renderTiming = () => {
    const { timing } = this.state;
    if (timing) {
      const From = timing.from
        ? `${timing.from.hour}:${timing.from.minute} ${timing.from.amPM}`
        : null;
      const To = timing.to
        ? `${timing.to.hour}:${timing.to.minute} ${timing.to.amPM}`
        : null;
      let Timing = `${timing.from ? From : "From"} - ${timing.to ? To : "To"}`;
      return <Text style={styles.text}> Timings:{" " + Timing}</Text>;
    }
    return <Text style={styles.text}> Timings:</Text>;
  };

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
          <Icon
            type="FontAwesome"
            name="close"
            onPress={() => {
              this.setState({ coords: null, mapModal: false });
            }}
          />
        </Button>
      </View>
    );
  };

  renderModel = () => {
    const { mapModal, coords } = this.state;
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
  };

  renderCameraContainer = () => {
    return (
      <View style={styles.cameraContainer}>
        {/* {this.renderHeader()} */}
        {this.renderCamera()}
        {/* {this.renderCameraFooter()} */}
      </View>
    );
  };

  renderCamera = () => {
    return (
      <View style={styles.camera}>
        <Camera
          style={{ flex: 1 }}
          type={this.state.type}
          ref={ref => {
            this.camera = ref;
          }}
        />
      </View>
    );
  };

  renderCameraFooter = () => {
    return (
      <View>
        <Icons
          name="md-sync"
          size={72}
          color="#808080"
          onPress={this.handleSwitchMode}
        />
        <Icons
          name="md-radio-button-on"
          size={72}
          color="#808080"
          onPress={this.handleSnap}
        />
      </View>
    );
  };
}
