import * as firebase from "firebase";
import "firebase/firestore";
// Initialize Firebase
var config = {
  apiKey: "AIzaSyAHpAvcM6Pf2BUFUPS8UaT2DpLOEQoHmeA",
  authDomain: "qapp-ca040.firebaseapp.com",
  databaseURL: "https://qapp-ca040.firebaseio.com",
  projectId: "qapp-ca040",
  storageBucket: "qapp-ca040.appspot.com",
  messagingSenderId: "997787663199"
};
const App = firebase.initializeApp(config);
const fireStore = App.firestore();
fireStore.settings({
  timestampsInSnapshots: true
});
export { fireStore,App };
