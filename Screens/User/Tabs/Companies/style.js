import { StyleSheet, Dimensions } from "react-native";
const styles = StyleSheet.create({
  header: {
    marginTop: 15
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },
  searchItemContainer: {
    marginTop: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 15
  },
  main: {},
  loadingCompanyContainer: {
    marginTop: 40,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  closeMapBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    bottom: 10,
    right: 10
  },
  metaCompanyBrand: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold"
  },
  metaCompanyItem: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  metaCompanyItemMeta: {
    width: Dimensions.get("screen").width - 75
  },
  confirmModalBtn: {
    padding: 10,
    backgroundColor: "transparent",
    borderColor: "transparent",
    elevation: 0,
    shadowColor: "transparent"
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
    color: "#2E2E2E"
  },
  profileErrActionCont: {
    marginTop: 15,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row"
  }
});

export default styles;
