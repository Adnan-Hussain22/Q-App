import React from 'react'
import {
  Text,
  View,
  Button as NativeButton,
  AsyncStorage,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native'
import { Button } from 'native-base'
import { Firebase } from '../../Config'
import styles from './style'
import Loader from '../Loader/loader'
import { MetaModal } from '../../Components'
export default class App extends React.Component {
  state = {
    authUser: '',
    companies: [],
    loading: false,
    showModal: false,
    modalMeta: null
  }

  async componentDidMount () {
    // console.log(this.props.navigation.state.params);
    const authUser = JSON.parse(await AsyncStorage.getItem('authUser'))
    this.setState({ authUser })
  }

  handleOnCloseModal = () => {
    this.setState({ showModal: false })
  }

  //= =======================ALL HANDLES RELATED TO COMPANY=====================//

  // check if the user is registered with some company
  handleCompanyValidation = async () => {
    console.log(this.state.authUser)
    const companiesRef = Firebase.fireStore.collection('company')
    try {
      // console.log(authUser)
      const query = companiesRef.where(
        'admins',
        'array-contains',
        this.state.authUser.email
      )
      const snap = await query.get()
      if (snap.size) {
        console.log('have snap')
        return {
          snap,
          status: 200,
          err: null
        }
      }
      return {
        snap: null,
        status: 404,
        err: null
      }
    } catch (err) {
      return { snap: null, status: 500, err }
    }
  }

  handleCompanyClick = async () => {
    //  this.props.navigation.navigate('CompanyData');
    this.setState({ loading: true })
    let companies = []
    try {
      const { snap, status, err } = await this.handleCompanyValidation()
      if (snap) {
        snap.forEach(res => {
          const data = res.data()
          companies = companies.concat(data)
        })
        console.log(companies)
        this.setState({ loading: false })
        this.setState({ companies }, () => {
          this.props.navigation.navigate('Companies', { companies })
        })
      } else {
        this.setState({
          loading: false,
          showModal: true,
          meta: this.renderCompanyNonValidated()
        })
      }
    } catch (err) {}
  }

  handleRegisterCompany = () => {
    this.setState({ showModal: false }, () => {
      this.props.navigation.navigate('CompanyData')
    })
  }

  handleUserClick = () => {
    this.props.navigation.navigate('User')
  }

  //= =======================END OF COMPANY HANDLES===========================//

  // Check if there is no activity than render the view else render loader
  render () {
    const { loading } = this.state
    if (loading) {
      return <Loader loading={loading} />
    }
    return this.renderView()
  }
  renderView = () => {
    const { meta, showModal } = this.state
    return (
      <View style={styles.container}>
        <MetaModal
          showModal={showModal}
          meta={meta}
          handleOnCloseModal={this.handleOnCloseModal}
        />
        <NativeButton title='Company' onPress={this.handleCompanyClick} />
        <NativeButton title='User' onPress={this.handleUserClick} />
      </View>
    )
  }

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
              <Text style={{ color: 'yellow' }}> Cancel </Text>
            </Button>
          </TouchableOpacity>
          <TouchableOpacity style={{ borderRadius: 5 }}>
            <Button
              light
              style={styles.confirmModalBtn}
              onPress={this.handleRegisterCompany}
            >
              <Text style={{ color: 'red' }}> OK </Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  //= =======================END OF COMPANY RENDERS===========================//
}

const cusstyles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    zIndex: 6,
    height: Dimensions.get('screen').height,
    width: Dimensions.get('screen').width
  }
})
