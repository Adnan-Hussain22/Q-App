import React from 'react'
import styles from './style'
import {View,ActivityIndicator} from 'react-native'
const Loader = (props) => {
  const { loading } = props
  if (loading) {
    return (
      <View style={styles.activityIndicator}>
        <ActivityIndicator size='large' color='#000000' animating={loading} />
      </View>
    )
  }
  return null
}
export default Loader
