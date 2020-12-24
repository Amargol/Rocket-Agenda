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

import { FontAwesome } from '@expo/vector-icons'; 
// create a component
class NotificationSettings extends Component {
  constructor(props) {
    super(props);
    this.scale = new Animated.Value(0)
    
    this.state = {
      switch: false,
      notificationDay: 0,
    };
  }

  toggleSwitch = () => {
    let st = this.state.switch

    this.setState({
      switch: !this.state.switch
    })

    if (st) {
      Animated.timing(this.scale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false
      }).start()
    } else {
      Animated.timing(this.scale, {
        toValue: 100,
        duration: 200,
        useNativeDriver: false
      }).start()

    }
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
                // onChangeText={text => this.setState({ text })}
                // onSubmitEditing={this.submit}
              />
              <View style={styles.calculatedTime}>
                <Text style={styles.calculatedTimeText}>8:05 AM</Text>
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
    color: "#686868"
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
