import React from "react";
import {
  Text,
  View,
  Button as NativeButton,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Button } from "native-base";
import { Firebase } from "../../Config";
import styles from "./style";
import Loader from "../Loader/loader";
import { MetaModal } from "../../Components";
const company_d = {
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
export default class App extends React.Component {
  state = {
    authUser: "",
    companies: [],
    loading: false,
    showModal: false,
    modalMeta: null
  };

  async componentDidMount() {
    // console.log(this.props.navigation.state.params);
    const authUser = JSON.parse(await AsyncStorage.getItem("authUser"));
    this.setState({ authUser });
  }

  handleOnCloseModal = () => {
    this.setState({ showModal: false });
  };

  //= =======================ALL HANDLES RELATED TO COMPANY=====================//

  // check if the user is registered with some company
  handleCompanyValidation = async () => {
    console.log("handleCompanyValidation");
    console.log("this.state.authUser", this.state.authUser);
    const companiesRef = Firebase.fireStore.collection("company");
    try {
      // console.log(authUser)
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
    //  this.props.navigation.navigate('CompanyData');
    this.setState({ loading: true });
    let companies = [ ];
    // try {
    //   const { snap, status, err } = await this.handleCompanyValidation()
    //   if (snap) {
    //     snap.forEach(res => {
    //       const data = res.data()
    //       companies = companies.concat(data)
    //     })
    //     // console.log('companies==>',companies)
    //     this.setState({ loading: false })
    //     this.setState({ companies }, () => {
    //       this.props.navigation.navigate('Companies', { companies })
    //     })
    //   } else {
    //     this.setState({
    //       loading: false,
    //       showModal: true,
    //       meta: this.renderCompanyNonValidated()
    //     })
    //   }
    // } catch (err) {}
  };

  handleRegisterCompany = () => {
    this.setState({ showModal: false }, () => {
      this.props.navigation.navigate("CompanyData");
    });
  };

  handleUserClick = () => {
    this.props.navigation.navigate("User");
  };

  //= =======================END OF COMPANY HANDLES===========================//

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
        <NativeButton title="Company" onPress={this.handleCompanyClick} />
        <NativeButton title="User" onPress={this.handleUserClick} />
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
