import React from "react";
import { StyleSheet, Text, View,Button,Alert } from "react-native";
import {FacebookLogin} from '../../Config'
export default class Login extends React.Component {

  handleLogin = ()=>{
    FacebookLogin().then(res=>{
      console.log(res);
      if(!res.err){
        // this.props.navigation.navigate('Home',{
        //   response:res
        // });
      }
    })
  }

  render() {
    return <View style={styles.container}>
      <Button title="Login" onPress={this.handleLogin}/>
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
