import React, { Component } from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import {  Icon,Button } from 'native-base'
import styles from './style'
class MetaModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: props.showModal,
      meta: null
    }
  }

  componentWillReceiveProps (nextProps, state) {
    this.setState({ showModal: nextProps.showModal, meta: nextProps.meta })
  }

  render () {
    const { showModal, meta } = this.state
    return (
      <Modal
        transparent
        animationType={'none'}
        visible={showModal}
        onRequestClose={() => {
          console.log('close modal')
        }}
      >
        <View style={styles.modalBackground}>
          <View style={[styles.Wrapper, this.props.style]}>
            <View style={styles.closeBtnCont}>
              <TouchableOpacity onPress={this.props.handleOnCloseModal}>
                <Icon
                  name='md-close-circle'
                  type='Ionicons'
                  style={styles.closeBtn}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.confirmModal}>
              <View style={{ padding: 10 }}>
                <Text>Sorry:( You are not registered with any company</Text>
                <Text>Do you want to register a company ?</Text>
              </View>
              <View style={styles.confirmModalBtnContainer}>
                <TouchableOpacity
                  style={{ borderRadius: 5 }}
                >
                  <Button light style={styles.confirmModalBtn} onPress={()=>console.log('Cancel')}>
                    <Text style={{ color: 'yellow' }}> Cancel </Text>
                  </Button>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ borderRadius: 5 }}
                  onPress={()=>console.log('OK')}
                >
                  <Button light style={styles.confirmModalBtn}>
                    <Text style={{ color: 'red' }}> OK </Text>
                  </Button>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}
export default MetaModal
