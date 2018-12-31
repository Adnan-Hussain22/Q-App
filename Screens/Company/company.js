import React from "react";
import CountdownCircle from "react-native-countdown-circle";
import StepIndicator from "../../Components/react-native-step-indicator";
import {
  View,
  AsyncStorage,
  Button as NativeButton,
  TouchableOpacity,
  Text as NativeText
} from "react-native";
import { Firebase } from "../../Config";
import { Container, Content, Button, Text, Icon, Thumbnail } from "native-base";
import { MetaModal, NumericInput } from "../../Components";
import styles, { customStyles } from "./style";
import Loader from "../Loader/loader";
const setup_d = {
  company: "Lgu1AvZFW4q1pFl76Jwq",
  date: "12/31/18",
  limit: 50,
  time: 5
};
export default class Compony extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showMetaModal: false,
      meta: null,
      tokkenCount: 0,
      tokkenTime: 0,
      tokkenSetuped: true,
      tokkenSetup: setup_d,
      admins: []
    };
  }

  componentDidMount() {
    // this.handleValidateTokkenSetup();
  }

  //Method to validate either the tokkens are setup or not
  handleValidateTokkenSetup = () => {
    if (this.props.navigation.state.params) {
      const { data, status } = this.props.navigation.state.params;
      if (status) {
        console.log(data);
        this.setState({
          loading: false,
          tokkenSetuped: true,
          tokkenSetup: data
        });
        return;
      }
      this.setState({ loading: false, tokkenSetuped: false });
    }
  };

  // Handle awake when the current tokken timmer is elapsed
  handleTimeElapsed(secondsElapsed, totalSeconds) {
    console.log(secondsElapsed, totalSeconds);
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
  handleSetupTokken = () => {
    const { tokkenCount, tokkenTime } = this.state;
    if (tokkenCount && tokkenTime) {
      this.setState({
        showMetaModal: false,
        meta: this.renderTokkenSetupConfirmation()
      });
      setTimeout(() => {
        this.setState({ showMetaModal: true });
      }, 1300);
    }
  };

  //= ==================Header handles===================//

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
          {!tokkenSetuped && <View>{this.renderTokkenSetupMsg()}</View>}
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
        {this.renderAddTokkens()}
        {this.renderAdmins()}
      </View>
    );
  };

  //= ==================Header methods===================//
  // method to render steps navigator
  renderStepsIndicator = () => {
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
        icon: (
          <Icon
            style={{ color: "white" }}
            type="MaterialCommunityIcons"
            name="coins"
          />
        ),
        handle: null
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
    const { headerElementsSize } = this.state;
    return (
      <View style={[styles.headerElements]}>
        <View style={styles.tokkenTimmer}>
          <CountdownCircle
            seconds={0}
            radius={headerElementsSize ? headerElementsSize.width / 3 - 50 : 90}
            borderWidth={8}
            color="#ff003f"
            bgColor="#fff"
            textStyle={{ fontSize: 20 }}
            onTimeElapsed={() => console.log("Elapsed!")}
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
  //= ==================End of Header methods===================//

  //= ==================Main methods===================//
  // method to render card cantainer
  renderCardsConatainer = () => {
    return (
      <View style={styles.cardContainerOverlay}>
        {this.renderCard(this.renderTotalTokkensCard())}
        {this.renderCard(this.renderBoughtTokkensCard())}
        {this.renderCard(this.renderRemainingTokkensCard())}
        {this.renderCard(this.renderNextTokkenCard())}
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
            18
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
            18
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
            18
          </NativeText>
        </View>
        <View style={{ marginTop: 20 }}>
          <NativeText style={[styles.cardBrand]}>REMAINING TOKKENS</NativeText>
        </View>
      </View>
    );
  };

  // method to render the card showing the next tokken
  renderNextTokkenCard = () => {
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
            18
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
  renderAddTokkens = () => {
    return (
      <View style={[styles.footerItem, { marginTop: 30 }]}>
        <View style={styles.footerItemMeta}>
          <NativeText style={styles.footerItemBrand}>Edit Tokkens</NativeText>
          <TouchableOpacity onPress={this.handleFetchAdmins}>
            <Icon
              type="MaterialCommunityIcons"
              name="circle-edit-outline"
              style={styles.footerItemIcon}
            />
          </TouchableOpacity>
        </View>
        <NativeText style={styles.footerItemText}>Total:10</NativeText>
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
  renderTokkenSetup = () => {
    const { tokkenCount, tokkenTime } = this.state;
    return (
      <View>
        <View style={{ marginBottom: 15 }}>
          <Text style={styles.metaBrand}>Please Setup Today's Tokkens</Text>
        </View>
        <View style={styles.metaItem}>
          <View
            style={{
              margin: 5,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Text style={[styles.metaItemMeta, { marginRight: 10 }]}>
              TOKKENS
            </Text>
            <NumericInput
              type="up-down"
              initValue={tokkenCount}
              onChange={value => this.setState({ tokkenCount: value })}
              value={this.state.tokkenCount}
              totalWidth={200}
              totalHeight={50}
              minValue={0}
              iconSize={35}
              rounded
            />
          </View>
        </View>
        <View style={styles.metaItem}>
          <View
            style={{
              margin: 5,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Text style={[styles.metaItemMeta, { marginRight: 10 }]}>
              TIME(MIN)
            </Text>
            <NumericInput
              type="up-down"
              initValue={tokkenTime}
              onChange={value => this.setState({ tokkenTime: value })}
              value={this.state.tokkenTime}
              totalWidth={200}
              totalHeight={50}
              iconSize={35}
              minValue={0}
              rounded
            />
          </View>
        </View>
        <View
          style={[styles.metaItem, { justifyContent: "center", marginTop: 10 }]}
        >
          <TouchableOpacity>
            <Button bordered dark onPress={this.handleSetupTokken}>
              <Text>Setup</Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  renderTokkenSetupConfirmation = () => {
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
                this.setState({ meta: this.renderTokkenSetup() });
              }}
            >
              <Text style={{ color: "yellow" }}> NO </Text>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity style={{ borderRadius: 5 }}>
            <Button
              light
              style={styles.confirmModalBtn}
              onPress={() =>
                this.setState({ tokkenSetuped: true, showMetaModal: false })
              }
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
