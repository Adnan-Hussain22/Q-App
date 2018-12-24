import React from "react";
import {Text, View, Button } from "react-native";
import styles from './style';
export default class App extends React.Component {
  componentDidMount() {
    // console.log(this.props.navigation.state.params);
  }

  handleCompany = () => {
   this.props.navigation.navigate('CompanyData'); 
  };

  handleUser = () => {
    this.props.navigation.navigate('User');
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Company" onPress={this.handleCompany} />
        <Button title="User" onPress={this.handleUser} />
      </View>
    );
  }
}
