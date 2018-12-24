import { Facebook } from "expo";
import { Alert } from "react-native";
const logIn = async () => {
  try {
    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions
    } = await Facebook.logInWithReadPermissionsAsync("729087654139322", {
      permissions: ["public_profile",'email']
    });
    console.log(type);
    if (type === "success") {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`
      );
      //   Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);
      const res = await response.json();
      return {
        status: 200,
        res,
        err: null
      };
    } else {
      // type === 'cancel'
      return {
        status: 500,
        res: null,
        err: { msg: "Unable to login" }
      };
    }
  } catch ({ message }) {
    return {
      status: 404,
      res: null,
      err: message
    };
  }
};

export default logIn;
