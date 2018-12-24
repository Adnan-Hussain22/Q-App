import React from "react";
import {Text, View, Button } from "react-native";
import styles from './style'
export default class User extends React.Component {
  componentDidMount() {
    // console.log(this.props.navigation.state.params);
  }

  render() {
    return (
      <View style={styles.container}>
      <Text>User</Text>
      </View>
    );
  }
}
