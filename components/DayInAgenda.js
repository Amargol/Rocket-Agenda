//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

import Task1 from "./Task.1";

// create a component
class DayInAgenda extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textStyle}>December 30, 2018</Text>
        <View style={styles.taskContainer}>
          <Task1 />
          <Task1 />
          <Task1 />
          <Task1 />
          <Task1 />
          <Task1 />
          <Task1 />
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
  taskContainer: {
    marginLeft: 1
  },
  textStyle: {
    fontSize: 24,
    fontFamily: "System",
    fontWeight: "700",
    paddingBottom: 2,
    marginHorizontal: 15,
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
