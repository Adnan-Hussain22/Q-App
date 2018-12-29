import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      },
      confirmModal: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 120
      },
      confirmModalBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      confirmModalBtn: {
        padding: 10,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        elevation: 0,
        shadowColor: 'transparent'
      }
});
export default styles;