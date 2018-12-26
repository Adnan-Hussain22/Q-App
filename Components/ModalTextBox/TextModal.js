import React, { Component } from 'react'
import { View, Text, Modal, TouchableOpacity } from 'react-native'
import { Container, Content, Item, Input, Icon } from 'native-base'
import styles from './style'
class Loader extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showModal: props.showModal,
      textAdmin: ''
    }
  }

  componentWillReceiveProps (nextProps, state) {
    if (nextProps.showModal != this.state.showModal) {
      this.setState({ showModal: nextProps.showModal })
    }
  }

  handleCloseAdminModal = ()=>{
    this.props.handleCloseAdminModal();
  }

  handleAddAdmin = () => {
    this.props.handleAddAdmin(this.state.textAdmin)
    this.setState({ textAdmin: '' })
  }

  render () {
    const { showModal, textAdmin } = this.state
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
          <View style={styles.Wrapper}>
            <Item>
              <Input
                placeholder='Enter admin id'
                value={textAdmin}
                onChangeText={text => this.setState({ textAdmin: text })}
              />
              <TouchableOpacity onPress={this.handleAddAdmin}>
                <Icon name='plus-circle' type='FontAwesome' />
              </TouchableOpacity>
            </Item>
            <View style={styles.closeBtnCont}>
              <TouchableOpacity
                onPress={this.handleCloseAdminModal}
              >
                <Icon
                  name='md-close-circle'
                  type='Ionicons'
                  style={styles.closeBtn}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}
export default Loader
