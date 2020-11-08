//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated
} from "react-native";

import { FontAwesome } from '@expo/vector-icons'; 
// create a component
class Notification extends Component {
  constructor(props) {
    super(props);
    let backgroundColors = ["#28a745", "#23CE6B", "#17B890"] //// bootstrap green, bright green, light green
    this.state = {
      backgroundColor: backgroundColors[props.item.backgroundNumber % backgroundColors.length]
    };
  }
  render() {
    return (
      <View style={[styles.notificationContainer, {backgroundColor: this.state.backgroundColor}]}>
        <View style={{paddingRight: 8}}>
          <TouchableOpacity activeOpacity={0.5}>
            <FontAwesome name="check" size={40} color="white" style={{paddingVertical: 5}}/>
          </TouchableOpacity>
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.system, styles.title]}>Congratulations</Text>
          <Text style={[styles.system]}>{this.props.item.task}</Text>
        </View>
        <View>
          <TouchableOpacity activeOpacity={0.5}>
            <Text style={styles.undo}>Undo</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  system: {
    fontFamily: "System",
    color: "white"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  notificationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    padding: 10,
    alignItems: "center"
  },
  notificationContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderLeftWidth: 1,
    borderLeftColor: "white",
  },
  undo: {
    paddingVertical: 15,
    color: "white",
    opacity: .8
  }
});

//make this component available to the app
export default Notification;
