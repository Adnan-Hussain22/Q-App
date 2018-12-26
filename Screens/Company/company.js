import React from 'react'
import {
  View,
  AsyncStorage,
  Button as NativeButton,
  Text as NativeText
} from 'react-native'
import { Firebase } from '../../Config'
import {
  Container,
  Content,
  List,
  ListItem,
  Left,
  Right,
  Button
} from 'native-base'
import styles from './style'

export default class ComponyList extends React.Component {
  state = {
    loading: true
  }

  async componentWillMount () {
    const companiesMetaRef = Firebase.fireStore.collection('companyMeta')
    try {
      const authUser = JSON.parse(await AsyncStorage.getItem('authUser'))
      const query = companiesMetaRef.where(
        'admins',
        'array-contains',
        authUser.id
      )
      const snap = await query.get()
      console.log(snap.size)
      // this.setState({loading:false})
      // const data = docData.exists ? docData.data() : null
    } catch (err) {
      this.setState({ loading: false })
    }
  }

  handleSelectCompany = (value, index) => {}

 
}
