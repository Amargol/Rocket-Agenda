//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import CreateTaskModal from "./CreateTaskModal";

@inject("store")
@observer
class Calendarcomp extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.submitNewTask = this.submitNewTask.bind(this);
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
  render() {
    return (
      <View style={styles.container}>
        <Calendar
          markedDates={this.props.store.markedDates}
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
            this.props.scrollToDate(day.dateString)
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
