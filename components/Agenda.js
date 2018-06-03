//import liraries
import React, { Component } from "react";
import { FlatList } from "react-native";
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
import DayInAgenda from "./DayInAgenda";

// create a component
@inject("store")
@observer
class Agenda extends Component {
  constructor(props) {
    super(props)
    this.prevIndex = ''
  }
  componentDidUpdate() {
    let index = toJS(this.props.store.dates).indexOf(this.props.index);
    if (index !== -1 && this.props.index !== this.prevIndex) {
      this.flatListRef.scrollToIndex({ animated: true, index: index });
      this.prevIndex = this.props.index
    }
  }
  render() {
    return (
      <FlatList
        data={toJS(this.props.store.dates)}
        renderItem={({ item }) => <DayInAgenda date={item} />}
        keyExtractor={item => {
          return item;
        }}
        ref={ref => {
          this.flatListRef = ref;
        }}
      />
    );
  }
}

//make this component available to the app
export default Agenda;
