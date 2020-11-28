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

    this.opacity = new Animated.Value(0)
    this.scale = new Animated.Value(0)

    let messages = ["Congratulations", "Good Job", "Well Done", "Good Work"]
    this.message = messages[Math.floor(Math.random()*messages.length)]

    this.active = true

    let backgroundColors = ["#28a745", "#23CE6B", "#17B890"] //// bootstrap green, bright green, light green
    this.state = {
      backgroundColor: backgroundColors[props.item.backgroundNumber % backgroundColors.length]
    };
  }

  componentDidMount () {
    this.fadeIn()

    setTimeout(this.fadeOut, 8000 - 250); // if you change this, you must change duration notification lasts for in store
  }

  fadeOut = () => {
    let duration = 250

    Animated.parallel([
      Animated.timing(this.opacity, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true
      }),
      Animated.timing(this.scale, {
        toValue: 0,
        duration: duration,
        useNativeDriver: true
      })
    ]).start()
  }

  fadeIn = () => {
    let duration = 250

    Animated.parallel([
      Animated.timing(this.opacity, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true
      }),
      Animated.timing(this.scale, {
        toValue: 1,
        duration: duration,
        useNativeDriver: true
      })
    ]).start()
  }

  undoHandler = () => {
    if (this.active) {
      this.fadeOut()
      this.props.undoTaskDelete()
      this.active = false
      console.log("oh")
    }
  }

  render() {
    return (
      <Animated.View style={[styles.notificationContainer, {backgroundColor: this.state.backgroundColor, opacity: this.opacity, transform: [{scale: this.scale}]}]}>
        <View style={{paddingRight: 8}}>
          <TouchableOpacity activeOpacity={0.5} onPress={this.fadeOut}>
            <FontAwesome name="check" size={40} color="white" style={{paddingVertical: 5}}/>
          </TouchableOpacity>
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.system, styles.title]} numberOfLines={1} ellipsizeMode='tail'>{this.message}</Text>
          <Text style={[styles.system]} numberOfLines={1} ellipsizeMode='tail'>{this.props.item.task}</Text>
        </View>
        <View>
          <TouchableOpacity activeOpacity={0.5} onPress={this.undoHandler}>
            <Text style={styles.undo}>Undo</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
    paddingLeft: 10,
    paddingVertical: 5,
    borderLeftWidth: 1,
    borderLeftColor: "white",
  },
  undo: {
    paddingVertical: 15,
    color: "white",
    opacity: .8,
    paddingRight: 8,
    paddingLeft: 15
  }
});

//make this component available to the app
export default Notification;
