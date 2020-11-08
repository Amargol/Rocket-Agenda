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

// create a component
class Notification extends Component {
  constructor(props) {
    super(props);
    let backgroundColors = ["#28a745", "#23CE6B", "#17B890"]
    this.state = {
      backgroundColor: backgroundColors[props.item.backgroundNumber % backgroundColors.length]
    };
  }
  render() {
    return (
      <View style={[styles.notificationContainer, {backgroundColor: this.state.backgroundColor}]}>
        <View>
          <Text>Check</Text>
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.system, styles.title]}>Congradulations</Text>
          <Text style={[styles.system]}>{this.props.item.task}</Text>
        </View>
        <View>
          <Text>Undo</Text>
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
    // Colors are picked in a rotating in the state
    // backgroundColor: "#28a745", // bootstrap green
    // backgroundColor: "#23CE6B", // bright green
    // backgroundColor: "#17B890", // light green
    top: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
    display: "flex",
    flexDirection: "row",
    padding: 10,
    alignItems: "center"
  },
  notificationContent: {
    flex: 1,
    paddingHorizontal: 10
  }
});

//make this component available to the app
export default Notification;
