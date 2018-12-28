import React, { Component } from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { Item, Input, Icon } from 'native-base'
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
    const { showModal,meta } = this.state;
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
          <View style={[styles.Wrapper,this.props.style]}>
            <View style={styles.closeBtnCont}>
              <TouchableOpacity onPress={this.props.handleOnCloseModal}>
                <Icon
                  name='md-close-circle'
                  type='Ionicons'
                  style={styles.closeBtn}
                />
              </TouchableOpacity>
            </View>
            {this.props.meta}
          </View>
        </View>
      </Modal>
    )
  }
}
export default MetaModal
