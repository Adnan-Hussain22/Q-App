import { StyleSheet, Dimensions } from 'react-native'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  metaCompanyBrand: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },
  metaCompanyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  metaCompanyItemMeta: {
    width: Dimensions.get('screen').width - 75
  }
})
export default styles
