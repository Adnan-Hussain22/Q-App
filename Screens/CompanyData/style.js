import { StyleSheet, styled } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    height: 55,
    backgroundColor: "black",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingBottom: 10
  },
  headerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  },
  text: {
    color: "#202020"
  },
  flexCorners: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  flexStart: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  flexCenter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  addBtn: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10
  },
  borderBottomLightGrey: {
    borderBottomColor: "#E3E1E5",
    borderBottomWidth: 1,
    borderStyle: "solid"
  },
  imagesContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 8,
    marginRight: 8,
    borderColor: "#cccc",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 5,
    minHeight: 92
  },
  timepickerContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  timepickerIcons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15
  },
  activityIndicator: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  companiesContainer: {
    flex: 1,
    marginTop: 30
  },
  closeMapBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 10,
    right: 10
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "transparent",
    position: "absolute",
    zIndex: 1
  },
  companyValidator: {
    color: "red"
  },
  imageCloseBtnCont: {
    position: "absolute",
    right: -5,
    top: -5,
  },
  imageCloseBtn: {
    fontSize:20,
    color: "red"
  }
});
export default styles;
