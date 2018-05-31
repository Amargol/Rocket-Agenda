//import liraries
import React, { Component } from "react";
import { FlatList, StyleSheet } from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from 'mobx'
import DayInAgenda from "./DayInAgenda";

// create a component
@inject("store")
@observer
class Agenda extends Component {
  render() {
    return (
      <FlatList
        data={toJS(this.props.store.dates)}
        renderItem={({ item }) => <DayInAgenda date={item} />}
        keyExtractor={(item) => { return item } }
      />
    );
  }
}

// define your styles
const styles = StyleSheet.create({});

//make this component available to the app
export default Agenda;
