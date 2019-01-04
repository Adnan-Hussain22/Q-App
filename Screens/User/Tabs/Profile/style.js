import { StyleSheet, Dimensions } from "react-native";
const styles = StyleSheet.create({
  loaderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("screen").height - 200,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },
  formBtnContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
  },
  imageContainer: {
    paddingLeft: 15,
    marginTop: 10,
    paddingBottom: 15,
    borderBottomColor: "#E1DFE4",
    borderStyle: "solid",
    borderBottomWidth: 1
  },
  addImageContainer: {
    borderRadius: 5,
    padding: 5,
    backgroundColor: "#EAEAEA",
    height: 65,
    width: 65,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  imageCloseBtnCont: {
    position: "absolute",
    right: -5,
    top: -5
  },
  imageCloseBtn: {
    fontSize: 20,
    color: "red"
  },
  imageUploadMeta: {
    width: 200,
  },
  imageUploadMetaBrand:{
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center'
  },
  imageUploadMetaBtns: {
    marginTop:20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly"
  }
});

export default styles;
