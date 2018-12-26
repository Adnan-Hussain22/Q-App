import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'space-around',
      backgroundColor: '#00000040'
    },
    activityIndicatorWrapper: {
      backgroundColor: '#FFFFFF',
      height: 120,
      width: 155,
      borderRadius: 15,
      padding:10,
      display: 'flex',
      alignItems: 'center',
      flexDirection:'row',
      justifyContent: 'space-around'
    }
  });
  export default styles;