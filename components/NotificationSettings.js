//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated
} from "react-native";

import * as chrono from 'chrono-node';

import { FontAwesome } from '@expo/vector-icons'; 
// create a component
class NotificationSettings extends Component {
  constructor(props) {
    super(props);
    this.scale = new Animated.Value(0)
    
    this.state = {
      switch: false,
      notificationDay: 0,
      time: ""
    };
  }

  formatTime = (date) => {
    if (date == null) {
      return ""
    }

    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  computedNotificationTime = () => {
    if (this.state.time === "") {
      return "8:05 AM"
    }

    let time = this.state.time

    time = chrono.parseDate(time)

    let result = this.formatTime(time)
    
    if (result == "") {
      result = "?"
    }

    return result
  }

  toggleSwitch = () => {
    // use chrono to get time for task and subtract 5 mins and calculate different time/date
    // Then setstate so that everything is set up/reset and use dotthen to trigger animation
    // Foxus time text

    let st = this.state.switch

    if (st) {
      Animated.timing(this.scale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }).start()

      this.setState({
        switch: !this.state.switch
      })  

      return
    }

    let taskText = this.props.taskText

    let ch = chrono.parseDate(taskText)

    // subtract 5 mins
    if (ch != null) {
      ch = new Date(ch.getTime() - 5 * 60000)
    }

    let time = this.formatTime(ch)

    let notificationDay = 0
    if (time == "11:55 PM" || time == "11:56 PM" || time == "11:57 PM" || time == "11:58 PM" || time == "11:59 PM") {
      notificationDay = -1
    }

    this.setState({
      switch: !this.state.switch,
      time: time,
      notificationDay: notificationDay
    }, () => {
      Animated.timing(this.scale, {
        toValue: 100,
        duration: 200,
        useNativeDriver: false
      }).start()
    })

  }

  updateNotificationDay = (delta) => {
    this.setState({
      notificationDay: this.state.notificationDay + delta
    })
  }

  notificationDayText = () => {
    let day = this.state.notificationDay

    if (day === 0) {
      return "Day Of"
    }

    if (day === -1) {
      return "Day Before"
    }

    if (day === 1) {
      return "Day After"
    }

    if (day < 0) {
      return (-day) + " days before"
    }

    return day + " days after"

  }

  render() {
    return (
      <View>
        <View style={styles.toggleContainer} >
          <Text style={styles.title}>Notification</Text>
          {/* <View style={{flex: 1}} ></View> */}
          <Switch 
            style={styles.shrink}
            onValueChange={this.toggleSwitch}
            value={this.state.switch}
          />
        </View>
        <Animated.View style={{height: this.scale, overflow: "hidden"}}>
          <View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="8:05 AM"
                autoCapitalize="sentences"
                // autoFocus={true}
                underlineColorAndroid="#eee"
                style={styles.inputStyle}
                onChangeText={time => this.setState({ time })}
                value={this.state.time}
                onSubmitEditing={this.props.submit}
              />
              <View style={styles.calculatedTime}>
                <Text style={styles.calculatedTimeText}>{this.computedNotificationTime()}</Text>
              </View>
            </View>
          </View>
          <View>
            <View style={styles.inputContainer}>
              <TouchableOpacity activeOpacity={.5} onPress={() => this.updateNotificationDay(-1)}>
                <View style={styles.dayChangeButtonLeft}>
                  <Text style={styles.dayChangeButtonText}>-</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.notificationDay}>
                <Text style={styles.notificationDayText}>{this.notificationDayText()}</Text>
              </View>
              <TouchableOpacity activeOpacity={.5} onPress={() => this.updateNotificationDay(1)}>
                <View style={styles.dayChangeButtonRight}>
                  <Text style={styles.dayChangeButtonText}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  toggleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1
  },
  title: {
    fontFamily: "System",
    fontWeight: "500",
    fontSize: 15,
    // marginRight: 10
  },
  shrink: {
    transform: [{ scaleX: .7 }, { scaleY: .7 }]
  },
  inputContainer: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 7,
    marginVertical: 5,
    marginRight: 3,
    minHeight: 38,
    alignItems: "center",
    overflow: "hidden"
  },
  inputStyle: {
    flex: 1,
    paddingHorizontal: 12
  },
  calculatedTime: {
    padding: 12,
    paddingLeft: 14,
    backgroundColor: "#D8D8D8"
  },
  calculatedTimeText: {
    color: "#686868",
    minWidth: 55,
    textAlign: "center"
  },
  dayChangeButtonLeft: {
    paddingVertical: 12,
    paddingLeft: 17,
    paddingRight: 17,
    backgroundColor: "#D8D8D8"
  },
  dayChangeButtonRight: {
    paddingVertical: 12,
    paddingLeft: 17,
    paddingRight: 17,
    backgroundColor: "#D8D8D8"
  },
  dayChangeButtonText: {
    color: "#686868"
  },
  notificationDay: {
    flex: 1,
    paddingHorizontal: 12
  },
  notificationDayText: {
    textAlign: "center",
    color: "#505050"
  }
});

//make this component available to the app
export default NotificationSettings;
