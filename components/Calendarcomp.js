//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

// create a component
class Calendarcomp extends Component {
  componentDidMount() {
    this.props.addTask(1, 2);
  }
  render() {
    var date = new Date();
    var today =
      date.getUTCFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2);

    var calendarObj = {};
    calendarObj[today] = { selected: true };

    return (
      <View style={styles.container}>
        <Calendar
          markedDates={calendarObj}
          theme={{
            backgroundColor: "#333248",
            calendarBackground: "#333248",
            selectedDayTextColor: "#ffffff",
            dayTextColor: "#ffffff",
            monthTextColor: "#ffffff",
            textDisabledColor: "#b6c1cd"
          }}
          onDayLongPress={day => {
            console.log("selected day", day);
          }}
          onDayPress={day => {
            console.log("selected day", day);
          }}
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
