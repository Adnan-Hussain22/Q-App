import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  AsyncStorage
} from 'react-native'
import { Firebase } from '../../Config'
import { Facebook } from 'expo'
export default class Login extends React.Component {
  constructor (props) {
    super(props)
  }

  async componentWillMount () {
    await this._bootstrapAsync()
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    try {
      const authUser = await AsyncStorage.getItem('authUser')
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      if (authUser) {
        this.props.navigation.replace('Home')
      }
    } catch (err) {
      console.log(err)
    }
  }

  handleLogin = async () => {
    console.log('handleLogin')
    try {
      const res = await FacebookLogIn()
      console.log(res)
      if (res.res) {
        console.log(res);
        const user = JSON.stringify(res.res)
        await AsyncStorage.setItem('authUser', user);
        this.props.navigation.navigate('Home');
      }
    } catch (err) {
      console.log(err)
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Button title='Login' onPress={this.handleLogin} />
      </View>
    )
  }
}

async function FacebookLogIn () {
  try {
    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions
    } = await Facebook.logInWithReadPermissionsAsync('729087654139322', {
      permissions: ['public_profile', 'email']
    })
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const credential = Firebase.firebase.auth.FacebookAuthProvider.credential(
        token
      )
      const res = await Firebase.firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential)
      const { user } = res
      const { displayName, email, photoURL, uid } = user
      return {
        status: 200,
        res: { displayName, email:'adnanrajput42@gmail.com', photoURL, uid },
        err: null
      }
    } else {
      // type === 'cancel'
      return {
        status: 500,
        res: null,
        err: { msg: 'Unable to login' }
      }
    }
  } catch ({ message }) {
    return {
      status: 404,
      res: null,
      err: message
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
