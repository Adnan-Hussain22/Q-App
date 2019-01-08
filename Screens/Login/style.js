import { StyleSheet, Dimensions } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  main: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center"
  },
  mainBrand: {
    fontSize: 35,
    fontWeight: "bold"
  },
  mainText1: {
    fontSize: 18,
    fontWeight: "800"
  },
  mainText2: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "100",
    fontStyle: "italic",
    color: "#858585"
  },
  actionContainer: {
    flex: 1.5,
    backgroundColor: "#101010",
    width: Dimensions.get("window").width + 50,
    left: -25,
    borderTopRightRadius: Dimensions.get("window").width + 15,
    borderTopLeftRadius: Dimensions.get("window").width + 15,
    justifyContent: "center",
    alignItems: "center"
  },
  actionBtnContainer:{
      padding:10,
      height:50,    
      width:50,
      elevation: 10,
      shadowColor: "white",
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 10,
      shadowOpacity: 5,
      borderRadius:40,
      backgroundColor:'white',
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
  },
  actionBtn:{
      fontSize:30,
      fontWeight:'bold'
  }
});

export default styles;
