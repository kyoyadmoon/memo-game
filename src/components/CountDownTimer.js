import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#DDD",
    backgroundColor: "#FFF",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center"
  },
  label: {
    fontSize: 18
  }
});

export default class CountDownTimer extends Component {
  state = {
    seconds: this.props.seconds
  };

  componentDidMount() {
    this.timer = setInterval(() => {
      const seconds = this.state.seconds;
      if (seconds === 1) {
        this.onTimesUp();
      } else {
        this.setState({ seconds: seconds - 1 });
      }
    }, 1000);
  }

  clearTimer = () => {
    // 如果存在this.timer，則使用clearTimeout清空
    this.timer && clearTimeout(this.timer);
    console.log("clear Timer !!!");
  };

  componentWillUnmount() {
    this.clearTimer();
  }

  onTimesUp = () => {
    this.clearTimer();
    this.props.onFinished();
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}> {this.state.seconds} </Text>
      </View>
    );
  }
}
