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
    this.specialDateText = this.isSpecialDate(this.props.date);
    this.color = this.getColor(this.props.date);
  }
  getFormattedDate(date) {
    var dateArr = date.split("-");
    var months = [
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
    var dayNum = parseInt(dateArr[2]);
    var month = months[parseInt(dateArr[1] - 1, 10)];
    var year = dateArr[0];
    return month + " " + dayNum + ", " + year;
  }
  removeTask(task) {
    this.props.store.removeTask(task, this.props.date);
  }
  isSpecialDate(date) {
    var todayDate = new Date();
    var today =
      todayDate.getUTCFullYear() +
      "-" +
      ("0" + (todayDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + todayDate.getDate()).slice(-2);

    todayDate.setDate(todayDate.getDate() + 1);

    var tomorrow =
      todayDate.getUTCFullYear() +
      "-" +
      ("0" + (todayDate.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + todayDate.getDate()).slice(-2);

    if (date === today) {
      return "Today";
    } else if (date === tomorrow) {
      return "Tomorrow";
    } else {
      return null;
    }
  }
  getColor(date) {
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

    if (diffDays < 0) {
      return "#EA4335";
    } else if (diffDays === 0) {
      return "rgba(52, 168, 83, .7)";
    } else if (diffDays > 0 && diffDays < 5) {
      let opacity = 0.9 * ((10 - diffDays) / 10) + 0.1;
      return "rgba(66, 133, 244, " + opacity + ")";
    } else if (diffDays >= 5 && diffDays < 15) {
      let opacity = 0.35 * ((15 - diffDays) / 15) + 0.2;
      return "rgba(66, 133, 244, " + opacity + ")";
    } else {
      return "rgba(66, 133, 244, .1)";
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>
          {this.specialDateText || this.getFormattedDate(this.props.date)}
        </Text>
        <View style={styles.taskContainer}>
          <FlatList
            data={toJS(this.props.store.content[this.props.date])}
            renderItem={({ item }) => (
              <Task
                info={item}
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
