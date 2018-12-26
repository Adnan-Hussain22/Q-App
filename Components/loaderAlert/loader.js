import React from 'react'
import { View,Text, Modal, ActivityIndicator } from 'react-native';
import styles from './style';
const Loader = props => {
  const { loading } = props;
  return (
    <Modal
      transparent
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        console.log('close modal')
      }}
    >
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator animating={loading} />
          <View><Text>Loading...</Text></View>
        </View>
      </View>
    </Modal>
  )
}
export default Loader
