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
    height: 120,
    minWidth: 155,
    borderRadius: 15,
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 5,
    marginRight: 5,
    position:'relative'
  },
  closeBtnCont:{
    position:'absolute',
    top:-5,
    right:-5
  },
  closeBtn:{
    color:'red',
    fontSize:25
  }
})
export default styles
