import { StyleSheet, styled,Dimensions } from 'react-native'
const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position:'absolute',
    backgroundColor:'white',
    zIndex:6,
    height:Dimensions.get('screen').height,
    width:Dimensions.get('screen').width
  }
})

export default styles
