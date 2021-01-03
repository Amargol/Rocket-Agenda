//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet
} from "react-native";

import NotificationSettings from "./NotificationSettings"

// create a component
class CreateTaskModal extends Component {
  constructor(props) {
    super(props);
    this.notificationSettings = React.createRef()
    this.submit = this.submit.bind(this);
    this.state = {
      text: ""
    };
  }
  getFormattedDate(date) {
    let dateArr = date.split("-");
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let dayNum = parseInt(dateArr[2]);
    let month = months[parseInt(dateArr[1] - 1, 10)];
    let year = dateArr[0];
    return month + " " + dayNum + ", " + year;
  }

  getFormattedDateForChrono (date) {
    let dateArr = date.split("-");
    let months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let dayNum = parseInt(dateArr[2]);
    let month = months[parseInt(dateArr[1] - 1, 10)];
    let year = dateArr[0];
    return dayNum + " " + month + " " + year
  }

  submit () {
    let text = this.state.text;

    if (text === "") {
      alert('Please enter a task')
      return
    }

    let notificationSettings = this.notificationSettings.current.getTimingData(this.getFormattedDateForChrono(this.props.date))

    if (notificationSettings === null) {
      alert('Please enter a valid notification time or turn off the notification switch')
      return
    }

    if (notificationSettings.notifying && (new Date()) > notificationSettings.dateTimeObj) {
      alert('Notification time must be in the future')
      return
    }

    this.props.submitNewTask(text, this.props.date, notificationSettings);
    this.setState({ text: "" });
    this.props.closeModal();  
  }

  render() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.modalVisible}
        onRequestClose={this.props.closeModal}
      >
        <TouchableWithoutFeedback onPress={this.props.closeModal}>
          <View style={styles.clearBackground} />
        </TouchableWithoutFeedback>
        <View style={styles.form}>
          <Text style={styles.date}>
            New task on {this.getFormattedDate(this.props.date)}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Buy groceries"
              autoCapitalize="sentences"
              autoFocus={true}
              underlineColorAndroid="#eee"
              style={styles.inputStyle}
              onChangeText={text => this.setState({ text })}
              onSubmitEditing={this.submit}
              returnKeyType="go"
            />
          </View>
          <View>
            <NotificationSettings taskText={this.state.text} submit={this.submit} initial={null} ref={this.notificationSettings} type="Submit"/>
          </View>
        </View>
      </Modal>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  clearBackground: {
    backgroundColor: "rgb(0, 0, 0)",
    flex: 1
  },
  form: {
    position: "absolute",
    top: 50,
    left: 15,
    right: 15,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 7,
    marginTop: 10,
    marginBottom: 5,
    marginRight: 3,
    minHeight: 38
  },
  inputStyle: {
    flex: 1,
    paddingHorizontal: 12
  },
  date: {
    fontFamily: "System",
    fontWeight: "700",
    fontSize: 20
  },
  submitButton: {
    backgroundColor: "#333248",
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 7,
    overflow: "hidden",
    marginTop: 7
  },
  submitText: {
    fontFamily: "System",
    fontWeight: "700",
    fontSize: 20,
    color: "white",
    textAlign: "center",
  }
});

//make this component available to the app
export default CreateTaskModal;
