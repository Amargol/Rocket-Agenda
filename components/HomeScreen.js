import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  ScrollView,
  PanResponder,
  Animated
} from "react-native";
import Calendarcomp from "./Calendarcomp";
import Agenda from "./Agenda";

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      yOfText: 0,
      yOfCalendar: 1,
      pan: new Animated.Value(),
      dates: [],
      content: {}
    };
    this.remindersAreUp = true;
  }
  moveReminderContainerUp() {
    Animated.spring(this.state.pan, {
      toValue: this.state.yOfText,
      speed: 14
    }).start();
    this.remindersAreUp = true;
  }
  moveReminderContainerDown() {
    Animated.spring(this.state.pan, {
      toValue: this.state.yOfCalendar,
      speed: 15,
      bounciness: 12
    }).start();
    this.remindersAreUp = false;
  }
  isMovementThresholdCrossed() {
    var distanceToText = Math.abs(this.state.yOfText - this.state.pan._value);
    var distanceToCalendar = Math.abs(
      this.state.yOfCalendar - this.state.pan._value
    );
    var scaler = 1;
    scaler = this.remindersAreUp ? 1.75 : 1 / 1.75;

    return distanceToText * scaler >= distanceToCalendar / scaler;
  }
  formattedDate() {
    var date = new Date();
    var daysOfTheWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
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
    var dayOfWeek = daysOfTheWeek[date.getDay()];
    var today = months[date.getMonth()] + " " + date.getDate();
    return {
      dayOfWeek: dayOfWeek,
      today: today
    };
  }
  onTopContainerLayout(e) {
    var calendarY = e.nativeEvent.layout.height + e.nativeEvent.layout.y;
    this.setState({
      yOfCalendar: calendarY
    });
    this.state.pan.setValue(calendarY);
  }
  onTextContainerLayout(e) {
    var textY = e.nativeEvent.layout.height + e.nativeEvent.layout.y;
    this.setState({
      yOfText: textY
    });
  }
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (e, gestureState) => {
        this.state.pan.setOffset(this.state.pan._value);
        this.state.pan.setValue(0);
      },
      onPanResponderMove: Animated.event([
        null,
        { dx: null, dy: this.state.pan }
      ]),
      onPanResponderRelease: (e, { vx, vy }) => {
        this.state.pan.flattenOffset();
        return this.isMovementThresholdCrossed()
          ? this.moveReminderContainerDown()
          : this.moveReminderContainerUp();
      }
    });
  }
  render() {
    let { dayOfWeek, today } = this.formattedDate();
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#333248" }}>
        <View
          style={styles.topContainer}
          onLayout={e => this.onTopContainerLayout(e)}
        >
          <View
            style={styles.textContainer}
            onLayout={e => this.onTextContainerLayout(e)}
          >
            <Text style={styles.text}>{dayOfWeek}</Text>
            <Text style={styles.subText}>{today}</Text>
          </View>
          <Calendarcomp />
        </View>
        <Animated.View
          style={[styles.movableReminderContainer, { top: this.state.pan }]}
        >
          <View
            style={styles.grabBarContainer}
            {...this._panResponder.panHandlers}
          >
            <View style={styles.grabBar} />
          </View>
          <Agenda />
        </Animated.View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  topContainer: {
    backgroundColor: "#333248",
    paddingBottom: 10
  },
  textContainer: {
    paddingTop: 8,
    paddingHorizontal: 10,
    paddingBottom: 15
  },
  text: {
    fontFamily: "System",
    color: "white",
    fontWeight: "900",
    fontSize: 35
  },
  subText: {
    fontFamily: "System",
    color: "white",
    fontWeight: "900",
    fontSize: 15,
    paddingHorizontal: 3
  },
  movableReminderContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17
  },
  grabBarContainer: {
    height: 50,
    backgroundColor: "rgba(51, 50, 72, .05)",
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    width: Dimensions.get("window").width,
    alignItems: "center"
  },
  grabBar: {
    height: 5,
    margin: 7,
    borderRadius: 1.5,
    width: Dimensions.get("window").width / 5,
    backgroundColor: "#C7C5BF"
  }
});
