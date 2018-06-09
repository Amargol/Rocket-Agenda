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
class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      svWidth: 0
    };
    this.xOffset = new Animated.Value(0);
    this.styling = {
      opacity: this.xOffset.interpolate({
        inputRange: [0, 20],
        outputRange: [1, 0]
      })
    };
    this.textStyle = {
      transform: [
        {
          translateX: this.xOffset.interpolate({
            inputRange: [0, 45],
            outputRange: [0, -Dimensions.get("window").width/2 + 100]
          })
        },
        {
          scale: this.xOffset.interpolate({
            inputRange: [0, 50],
            outputRange: [1, 0]
          })
        }
      ]
    };
    this.removed = false;

    // Once the task is scrolled past a certain value, remove the task
    this.xOffset.addListener(({ value }) => {
      if (value > 100 && !this.removed) {
        this.props.removeTask(this.props.info);
        this.removed = true;
      }
    });
  }
  render() {
    return (
      <Animated.ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        bounces={false}
        ref={c => (this.myRef = c)}
        style={[styles.ScrollView, this.styling]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: this.xOffset } } }],
          { useNativeDriver: true }
        )}
        onLayout={e => {
          this.setState({ svWidth: e.nativeEvent.layout.width });
        }}
      >
        <TouchableOpacity
          style={[styles.touchableStyle, { borderLeftColor: this.props.color }]}
          activeOpacity={0.4}
          onPress={() => {
            this.props.openModal(
              this.props.date,
              this.props.formattedDate,
              this.props.info.task,
              this.props.color,
              this.props.info.notes,
              this.props.info.id
            );
          }}
        >
          <Animated.Text style={[styles.taskStyle, this.textStyle, { width: this.state.svWidth - 30 }]}>
            {this.props.info.task}
          </Animated.Text>
        </TouchableOpacity>
        <View style={{ width: Dimensions.get("window").width * 2 }} />
      </Animated.ScrollView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  ScrollView: {
    marginRight: 5
  },
  touchableStyle: {
    marginHorizontal: 15,
    paddingLeft: 5,
    paddingBottom: 2,
    borderLeftWidth: 5
  },
  taskStyle: {
    fontFamily: "System",
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontSize: 18
  }
});

//make this component available to the app
export default Task;
