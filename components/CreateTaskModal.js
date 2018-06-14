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

// create a component
class CreateTaskModal extends Component {
  constructor(props) {
    super(props);
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
  submit() {
    let text = this.state.text;
    if (text !== "") {
      this.props.submitNewTask(text, this.props.date);
      this.setState({ text: "" });
      this.props.closeModal();  
    } else {
      alert('Please enter a task')
    }
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
              autoCapitalize="sentences"
              autoFocus={true}
              underlineColorAndroid="#eee"
              style={styles.inputStyle}
              onChangeText={text => this.setState({ text })}
              onSubmitEditing={this.submit}
            />
            <TouchableOpacity activeOpacity={0.5} onPress={this.submit}>
              <Text style={styles.submitButton}>Submit</Text>
            </TouchableOpacity>
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
    marginVertical: 5,
    marginRight: 3
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
    fontFamily: "System",
    fontWeight: "700",
    fontSize: 20,
    backgroundColor: "#333248",
    color: "white",
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7
  }
});

//make this component available to the app
export default CreateTaskModal;
