import React from "react";
import {
  View,
  Text as NativeText,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import {
  Form,
  Item,
  Label,
  Input,
  Button,
  Text,
  Thumbnail,
  Icon
} from "native-base";
import styles from "./style";
import { ImagePicker, Permissions } from "expo";
import { Firebase } from "../../../../Config";
import { MetaModal } from "../../../../Components";
export default class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nickName: "",
      email: "",
      phoneNo: "",
      image: null,
      currentAuth: null,
      showMetaModal: false,
      meta: null,
      loading: false,
      authProfile: props.authProfile,
      viewSize: null
    };
  }

  async componentDidMount() {
    try {
      const storageRes = await AsyncStorage.getItem("authUser");
      const currentAuth = JSON.parse(storageRes);
      this.setState({ currentAuth });
    } catch (err) {
      console.log(err);
    }
  }

  static getDerivedStateFromProps(props, state) {
    return { authProfile: props.authProfile };
  }

  //method to conver uri into blob
  ImageToBlog(uri) {
    console.log("convert into blob==>", uri);
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

  //handle to open the image library or camera to get the user image
  handleOpenImagePicker = async type => {
    if (type == "lib") {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [5, 5]
      });
      if (!result.cancelled) {
        this.setState({ image: result.uri });
      }
    } else {
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
          this.setState({ image: result.uri });
        }
      }
    }
  };

  //save the user image to firebase storage bucket
  handleSaveImagesToStorage = async () => {
    const { image } = this.state;
    const storageRef = Firebase.App.storage().ref();
    try {
      const imageBlob = await this.ImageToBlog(image);
      const imageRef = storageRef.child("userImages/" + imageBlob.data.name);
      const snapshot = await imageRef.put(imageBlob);
      const url = await snapshot.ref.getDownloadURL();
      return url;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  //handle to save to the data in fireStore DB
  handleSaveProfile = async () => {
    const { nickName, image, phoneNo, email, currentAuth } = this.state;
    const usersRef = Firebase.fireStore.collection("users");
    try {
      if (nickName && image && phoneNo && email) {
        this.setState({ loading: true });
        const obj = {
          nickName,
          image: await this.handleSaveImagesToStorage(),
          email,
          phoneNo
        };
        await usersRef.doc(currentAuth.uid).set(obj);
        this.setState({ loading: false });
        this.props.handleFetchProfile(obj);
        setTimeout(
          () =>
            Alert.alert(
              "Data Saved",
              "Data uploaded successfully",
              [{ text: "OK", onPress: () => console.log("OK Pressed") }],
              { cancelable: false }
            ),
          2000
        );
      }
    } catch (err) {
      Alert.alert(
        "Failed to Save Data",
        err,
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      console.log(err);
    }
  };

  render() {
    const { loading, authProfile } = this.state;
    if (loading)
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#000000" animating={loading} />
        </View>
      );
    if (authProfile)
      return (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200
          }}
        >
          <Text
            style={{ textAlign: "center", fontSize: 25, fontWeight: "bold" }}
          >
            Profile Alerady Setup
          </Text>
        </View>
      );
    return this.renderView();
  }

  //render view
  renderView = () => {
    const { showMetaModal, meta } = this.state;
    return (
      <View>
        <MetaModal showModal={showMetaModal} meta={meta} />
        {this.renderHeader()}
        {this.renderMain()}
      </View>
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.header}>
        <NativeText style={styles.headerBrand}>Setup Profile</NativeText>
      </View>
    );
  };

  renderMain = () => {
    return (
      <Form style={styles.main}>
        <Item floatingLabel last>
          <Label>Nick Name</Label>
          <Input onChangeText={text => this.setState({ nickName: text })} />
        </Item>
        <Item floatingLabel last>
          <Label>Email</Label>
          <Input onChangeText={text => this.setState({ email: text })} />
        </Item>
        <Item floatingLabel last>
          <Label>Phone No</Label>
          <Input onChangeText={text => this.setState({ phoneNo: text })} />
        </Item>
        {this.renderImage()}
        <View style={styles.formBtnContainer}>
          <TouchableHighlight>
            <Button block bordered dark onPress={this.handleSaveProfile}>
              <Text>Setup Profile</Text>
            </Button>
          </TouchableHighlight>
        </View>
      </Form>
    );
  };

  renderImageUploadMeta = () => {
    return (
      <View style={styles.imageUploadMeta}>
        <Text style={styles.imageUploadMetaBrand}>
          Select the option to upload the image
        </Text>
        <View style={styles.imageUploadMetaBtns}>
          <TouchableOpacity>
            <Icon
              name="camera"
              type="FontAwesome"
              onPress={() => {
                this.handleOpenImagePicker("camera");
                this.setState({ showMetaModal: false });
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              name="image"
              type="FontAwesome"
              onPress={() => {
                this.handleOpenImagePicker("lib");
                this.setState({ showMetaModal: false });
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //= ==================Header methods===================//

  //= ==================End of Header methods===================//

  //= ==================Main methods===================//

  //Render image container or user image
  renderImage = () => {
    const { image } = this.state;
    return (
      <View style={styles.imageContainer}>
        <Text style={{ textAlign: "center", fontSize: 15, fontWeight: "bold" }}>
          {"Add Image".toUpperCase()}
        </Text>
        {!image && this.renderAddImageContainer()}
        {image && this.renderImageThumb()}
      </View>
    );
  };

  //render container to add image
  renderAddImageContainer = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          this.setState({
            showMetaModal: true,
            meta: this.renderImageUploadMeta()
          })
        }
      >
        <View style={styles.addImageContainer}>
          <Icon
            name="plus-circle-outline"
            type="MaterialCommunityIcons"
            style={{ fontSize: 35, color: "#414141" }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  //Render added image as a thumbnail
  renderImageThumb = () => {
    const { image } = this.state;
    return (
      <View style={{ position: "relative", width: 60 }}>
        <Thumbnail square source={{ uri: image }} style={{ borderRadius: 5 }} />
        <View style={styles.imageCloseBtnCont}>
          <TouchableOpacity>
            <Icon
              type="MaterialCommunityIcons"
              name="close-circle"
              style={styles.imageCloseBtn}
              onPress={() => this.setState({ image: null })}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  //= ==================End of Main methods===================//
}
