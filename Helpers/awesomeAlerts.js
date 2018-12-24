import React from "react";
import AwesomeAlert from "react-native-awesome-alerts";
class AwesomeAlert extends React.Component {
  state = {
    showAlert: false,
    message: "",
    title: "",
    showCancelButton: false,
    showConfirmButton: false,
    cancelText: "",
    confirmText: "",
    confirmButtonColor: null,
    onCancelPressed: null,
    onConfirmPressed: null
  };

  handleOnCancelPressed = () => {
    const { onCancelPressed } = this.state;
    if (onCancelPressed && typeof onCancelPressed == "function")
      onCancelPressed();
    this.setState({ showAlert: false });
  };

  handleOnConfirmPressed = () => {
    const { onConfirmPressed } = this.state;
    if (onConfirmPressed && typeof onConfirmPressed == "function")
      onConfirmPressed();
    this.setState({ showAlert: false });
  };

  Confirm = (
    title = "Title",
    message = "Message",
    confirmText = "Confirm",
    cancelText = "Cancel",
    handleOnCancelPressed = null,
    handleOnConfirmPressed = null
  ) => {
    this.setState({
      title,
      message,
      confirmText,
      cancelText,
      onCancelPressed: handleOnCancelPressed,
      onConfirmPressed: handleOnConfirmPressed,
      showCancelButton: true,
      showConfirmButton: true
    });
  };

  render() {
    const {
      showAlert,
      title,
      message,
      confirmButtonColor,
      confirmText,
      cancelText,
      showCancelButton,
      showConfirmButton
    } = this.state;
    return (
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={title}
        message={message}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={showCancelButton}
        showConfirmButton={showConfirmButton}
        cancelText={cancelText}
        confirmText={confirmText}
        confirmButtonColor={confirmButtonColor}
        onCancelPressed={this.handleOnCancelPressed}
        onConfirmPressed={this.handleOnConfirmPressed}
      />
    );
  }
}