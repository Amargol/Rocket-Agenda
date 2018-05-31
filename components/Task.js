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
    this.value = 0;
    this.xOffset.addListener(({ value }) => {
      this.value = value;
    });
  }
  render() {
    return (
      <Animated.ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
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
        <TouchableOpacity style={styles.touchableStyle} activeOpacity={.4}>
          <Text style={[styles.taskStyle, { width: this.state.svWidth - 30 }]}>
            {this.props.title}
          </Text>
        </TouchableOpacity>
        <View style={{ width: Dimensions.get("window").width * 2 }} />
      </Animated.ScrollView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  ScrollView: {
    marginRight: 5,
  },
  touchableStyle: {
    marginHorizontal: 15,
    paddingLeft: 5,
    paddingBottom: 2,
    borderLeftColor: "#EA4335",
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
