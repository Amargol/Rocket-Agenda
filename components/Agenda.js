//import liraries
import React, { Component } from "react";
import { ScrollView, StyleSheet } from "react-native";
import DayInAgenda from "./DayInAgenda";

// create a component
class Agenda extends Component {
  componentDidMount() {
  }
  render() {
    return (
      <ScrollView>
        <DayInAgenda />
      </ScrollView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  
});

//make this component available to the app
export default Agenda;
