import React from "react";
import { Text, View, Button, TouchableOpacity, Dimensions } from "react-native";
import { Firebase } from "../../Config";
import styles from "./style";
import { MetaModal } from "../../Components";
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Right,
  Icon
} from "native-base";
import Loader from "../Loader/loader";
export default class App extends React.Component {
  state = {
    companies: [],
    isReady: true,
    showMetaModal: false,
    metaCompany: null
  };

  componentDidMount() {
    const { companies } = this.props.navigation.state.params;
    this.setState({ isReady: true, companies });
  }

  handleSelectCompany = async (value, index) => {
    try {
      const { res, err, status } = await this.handleValidateTodayTokken(value);
      if (res) {
        let tokkenSetupId = null;
        res.forEach(doc => {
          tokkenSetupId = doc.id;
        });
        this.props.navigation.navigate("Company", {
          status: true,
          companyData: value,
          companyId: value.id,
          tokkenSetupId
        });
        return;
      }
      this.props.navigation.navigate("Company", {
        status: false,
        companyData: value,
        companyId: value.id
      });
    } catch (err) {
      console.log(err);
    }
  };

  //handle to validate either today's tokkens of the
  //company is setup or not
  handleValidateTodayTokken = async company => {
    this.setState({ isReady: false });
    const tokkensMetaRef = Firebase.fireStore.collection("tokkensMeta");
    try {
      const query = tokkensMetaRef
        .where("companyId", "==", company.id)
        .where("date", "==", new Date().toDateString());
      const snap = await query.get();
      this.setState({ isReady: true });
      if (snap.size) {
        return {
          res: snap,
          err: null,
          status: 200
        };
      }
      return {
        res: null,
        err: null,
        status: 404
      };
    } catch (err) {
      this.setState({ isReady: true });
      return {
        res: null,
        err,
        status: 500
      };
    }
  };

  // check if something is fetching than show loader else render the view
  render() {
    const { isReady } = this.state;
    if (!isReady) return <Loader loading={!isReady} />;
    return this.renderView();
  }

  // method to render the view
  renderView = () => {
    console.log("renderView==>", companies);
    const { companies, showMetaModal, metaCompany } = this.state;
    return (
      <Container>
        <Content>
          <MetaModal
            showModal={showMetaModal}
            handleOnCloseModal={() => this.setState({ showMetaModal: false })}
            meta={metaCompany}
          />
          <Text
            style={{
              backgroundColor: "black",
              color: "white",
              textAlign: "center",
              padding: 10,
              paddingTop: 30
            }}
          >
            Select a company
          </Text>
          <List>
            {companies.map((value, index) => (
              <TouchableOpacity key={index + value}>
                <ListItem
                  onPress={() => this.handleSelectCompany(value, index)}
                  onLongPress={() =>
                    this.setState({
                      metaCompany: this.state.companies[index],
                      showMetaModal: true
                    })
                  }
                >
                  <Left>
                    <Text>{value.name}</Text>
                  </Left>
                  <Right>
                    <Icon name="arrow-forward" />
                  </Right>
                </ListItem>
              </TouchableOpacity>
            ))}
          </List>
        </Content>
      </Container>
    );
  };

  // method to render the companyMeta
  renderCompanyMeta = () => {
    const { metaCompany } = this.state;
    return (
      <View>
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.metaCompanyBrand}>{metaCompany.name}</Text>
        </View>
        <View style={styles.metaCompanyItem}>
          <View style={{ margin: 5 }}>
            <Text style={styles.metaCompanyItemMeta}>
              CEO:{metaCompany.registeredBy}
            </Text>
          </View>
          <View style={{ margin: 5 }}>
            <Icon name="user" type="FontAwesome" />
          </View>
        </View>
        <View style={styles.metaCompanyItem}>
          <View style={{ margin: 5 }}>
            <Text style={[styles.metaCompanyItemMeta]}>
              Address:{this.renderAddress(metaCompany.address)}
            </Text>
          </View>
          <View style={{ margin: 5 }}>
            <Icon name="location-on" type="MaterialIcons" />
          </View>
        </View>
        <View style={styles.metaCompanyItem}>
          <View style={{ margin: 5 }}>
            <Text style={styles.metaCompanyItemMeta}>
              Timings:From {metaCompany.timing.from.hour}:
              {metaCompany.timing.from.minute}
              {metaCompany.timing.from.amPM} - To {metaCompany.timing.to.hour}:
              {metaCompany.timing.to.minute}
              {metaCompany.timing.from.amPM}
              {/* Timings:From {metaCompany.timing.from.hour}:{metaCompany.timing.from.minute}
            {metaCompany.timing.from.amPM} -
            To {metaCompany.timing.to.hour}:{metaCompany.timing.to.minute}
            {metaCompany.timing.from.amPM} */}
            </Text>
          </View>
          <View style={{ margin: 5 }}>
            <Icon name="clock-o" type="FontAwesome" />
          </View>
        </View>
      </View>
    );
  };

  renderAddress = address => {
    let address_d = ` `;
    for (let i = 0; i < address.length; i++) {
      address_d += `${address[i]}`;
    }
    return address_d;
  };
}
