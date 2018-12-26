import React from "react";
import { StyleSheet, Text, View, Button, Alert, AsyncStorage } from "react-native";
import { FacebookLogin } from '../../Config'
export default class Login extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  async componentWillMount(){
    // await this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const authUser = await AsyncStorage.getItem('authUser');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.replace(authUser ? 'Home' : 'Login');
  };

  handleLogin = async () => {
    try {
      const res = await FacebookLogin()
      if (!res.err) {
        console.log(res);
        // const user = JSON.stringify(res.res)
        // await AsyncStorage.setItem('authUser', user);
        // this.props.navigation.navigate('Home');
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  render() {
    return <View style={styles.container}>
      <Button title="Login" onPress={this.handleLogin} />
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
