import React from "react";
import { Font } from "expo";
import Navigator from "./Navigation/appNavigator";
export default class App extends React.Component {
  state = {
    fontLoaded: false
  };
  async componentWillMount() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf")
    });
    this.setState({ fontLoaded: true });
  }
  render() {
    return this.state.fontLoaded && <Navigator />;
  }
}
