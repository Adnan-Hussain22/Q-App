import { StyleSheet, Dimensions } from "react-native";
const styles = StyleSheet.create({
  loaderContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("screen").height - 200
  },
  profileErrBrand: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15
  },
  profileErrText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 15,
    color:'#2E2E2E'
  },
  profileErrActionCont:{
    marginTop: 15,
    display:'flex',
    justifyContent:'center',
    flexDirection:'row',
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20
  },
  currentTokkenTimmer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  main: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    paddingBottom: 20
  },
  card: {
    zIndex: 5,
    padding: 2,
    maxWidth: Dimensions.get("window").width / 2 - 20,
    minWidth: 150,
    // backgroundColor: "green",
    backgroundColor: "white",
    elevation: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
    shadowOpacity: 5,
    maxHeight: Dimensions.get("window").width / 2 - 10,
    minHeight: 140,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 8,
    marginLeft: 5,
    marginRight: 5
  },
  cardUpperColorContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row"
  },
  cardUppercolor: {
    top: -2,
    height: 3,
    width: 40
  },
  circleStatisticsContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  circleStatistics: {
    height: 65,
    width: 65,
    borderRadius: 65,
    backgroundColor: "#F0F0F0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  cardStatisticsMetaText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#464646"
  },
  cardStatisticsBrand: {
    color: "#696969",
    textAlign: "center",
    fontSize: 15,
    marginTop: 15
  }
});

export default styles;
