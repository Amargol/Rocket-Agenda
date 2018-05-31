//import liraries
import React, { Component } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";

import Task from "./Task";

@inject("store")
@observer
class DayInAgenda extends Component {
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
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>
          {this.getFormattedDate(this.props.date)}
        </Text>
        <View style={styles.taskContainer}>
          <FlatList
            data={toJS(this.props.store.content[this.props.date])}
            renderItem={({ item }) => <Task title={item} />}
            keyExtractor={item => { return item }}
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
