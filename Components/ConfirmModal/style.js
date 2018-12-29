import { StyleSheet } from 'react-native'
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  Wrapper: {
    backgroundColor: '#FFFFFF',
    minHeight: 120,
    minWidth: 155,
    borderRadius: 15,
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    position: 'relative'
  },
  closeBtnCont: {
    position: 'absolute',
    top: -5,
    right: -5
  },
  closeBtn: {
    color: 'red',
    fontSize: 25
  },
  confirmModal: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 120
  },
  confirmModalBtnContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  confirmModalBtn: {
    padding: 10,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    elevation: 0,
    shadowColor: 'transparent'
  }
})
export default styles
