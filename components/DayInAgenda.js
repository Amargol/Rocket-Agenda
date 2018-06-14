//import liraries
import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import Task from "./Task";

@inject("store")
@observer
class DayInAgenda extends Component {
  constructor(props) {
    super(props);
    this.formattedDate = this.getFormattedDate(this.props.date);
    this.specialDateText = this.isSpecialDate(this.props.date);
    this.color = this.getColor(this.props.date);
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
  removeTask(task) {
    this.props.store.removeTask(task, this.props.date);
  }
  isSpecialDate(date) {
    let todayDate = new Date();
    let today =
      todayDate.getUTCFullYear() +
      "-" +
      ("0" + (todayDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + todayDate.getDate()).slice(-2);

    todayDate.setDate(todayDate.getDate() + 1);

    let tomorrow =
      todayDate.getUTCFullYear() +
      "-" +
      ("0" + (todayDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + todayDate.getDate()).slice(-2);

    todayDate.setDate(todayDate.getDate() - 2);

    let yesterday =
      todayDate.getUTCFullYear() +
      "-" +
      ("0" + (todayDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + todayDate.getDate()).slice(-2);

    if (date === today) {
      return "Today";
    } else if (date === tomorrow) {
      return "Tomorrow";
    } else if (date === yesterday) {
      return "Yesterday";
    } else {
      return null;
    }
  }
  // Decide what color the task should be
  getColor(date) {
    // converts from "YYYY-MM-DD" to JS Date object
    function convertToDate(stringDate) {
      let dateArr = stringDate.split("-");

      let year = parseInt(dateArr[0]);
      let month = parseInt(dateArr[1]) - 1;
      let day = parseInt(dateArr[2]);

      let date = new Date(year, month, day);
      return date;
    }

    let today = new Date();
    let targetDate = convertToDate(date);

    let timeDiff = targetDate.getTime() - today.getTime();
    let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Calculate the number of days between two days
    // Makes the color red if the task is overdue
    // Makes the color green if the task is due today
    // Makes the color blue if the task is due in the future and adjusts the opacity of the color depending on how far in the future the task is due
    if (diffDays < 0) {
      return "#EA4335";
    } else if (diffDays === 0) {
      return "rgba(251, 184, 5, 1)";
    } else if (diffDays === 1) {
      return "rgba(52, 168, 83, .7)";
    } else if (diffDays > 0 && diffDays < 5) {
      let opacity = 0.9 * ((10 - diffDays) / 10) + 0.1;
      return "rgba(66, 133, 244, " + opacity + ")";
    } else if (diffDays >= 5 && diffDays < 10) {
      let opacity = 0.35 * ((10 - diffDays) / 10) + 0.2;
      return "rgba(66, 133, 244, " + opacity + ")";
    } else {
      return "rgba(66, 133, 244, .1)";
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>
          {this.specialDateText || this.formattedDate}
        </Text>
        <View style={styles.taskContainer}>
          <FlatList
            data={toJS(this.props.store.content[this.props.date])}
            renderItem={({ item }) => (
              <Task
                info={item}
                openModal={this.props.openModal}
                date={this.props.date}
                formattedDate={this.formattedDate}
                removeTask={this.removeTask.bind(this)}
                color={this.color}
              />
            )}
            keyExtractor={item => {
              return item.id;
            }}
          />
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    marginVertical: 7
  },
  taskContainer: {
    marginLeft: 1
  },
  textStyle: {
    fontSize: 24,
    fontFamily: "System",
    fontWeight: "700",
    paddingBottom: 2,
    marginHorizontal: 15
  },
  taskStyle: {
    fontFamily: "System",
    marginLeft: 5,
    marginBottom: 1,
    paddingVertical: 5,
    fontSize: 18
  }
});

//make this component available to the app
export default DayInAgenda;
