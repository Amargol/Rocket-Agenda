//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { inject, observer } from "mobx-react";
import { toJS, autorun } from "mobx";
import CreateTaskModal from "./CreateTaskModal";

@inject("store")
@observer
class Calendarcomp extends Component {
  componentDidMount() {
    autorun(() => {
      // console.log('dates', this.props.store.dates)
      // console.log('content', this.props.store.content)
    });
  }
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.submitNewTask = this.submitNewTask.bind(this);
    this.getMarkedDates = this.getMarkedDates.bind(this);
    this.state = {
      modalVisible: false,
      date: "2001-01-01"
    };
  }
  closeModal() {
    this.setState({ modalVisible: false });
  }
  submitNewTask(task, date) {
    this.props.store.addTask(task, date);
  }
  getMarkedDates() {
    var markedDates = {}

    var date = new Date();
    var today =
      date.getUTCFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2);

    markedDates[today] = { selected: true };

    return markedDates;
  }
  render() {
    return (
      <View style={styles.container}>
        <Calendar
          markedDates={this.getMarkedDates()}
          theme={{
            backgroundColor: "#333248",
            calendarBackground: "#333248",
            selectedDayTextColor: "#ffffff",
            dayTextColor: "#ffffff",
            monthTextColor: "#ffffff",
            textDisabledColor: "#b6c1cd"
          }}
          onDayLongPress={day => {
            this.setState({ modalVisible: true, date: day.dateString });
          }}
          onDayPress={day => {
            // this.props.store.addDate(day.dateString);
          }}
        />
        <CreateTaskModal
          modalVisible={this.state.modalVisible}
          closeModal={this.closeModal}
          submitNewTask={this.submitNewTask}
          date={this.state.date}
        />
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {}
});

//make this component available to the app
export default Calendarcomp;
