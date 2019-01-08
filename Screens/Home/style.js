import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  main: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "center"
  },
  emojiContianer: {
    marginBottom: 8,
  },
  emoji: {
    fontSize: 50
  },
  mainBrand: {
    fontSize: 35,
    fontWeight: "bold",
    marginTop: 20
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
  footer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  actionBtn: {
    marginTop: 10,
    marginBottom: 10
  },
  confirmModal: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: 120
  },
  confirmModalBtnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  confirmModalBtn: {
    padding: 10,
    backgroundColor: "transparent",
    borderColor: "transparent",
    elevation: 0,
    shadowColor: "transparent"
  }
});
export default styles;
