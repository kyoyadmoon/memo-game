import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  label: {
    fontSize: 18
  }
})

export default class CountDownTimer extends Component {
  state = {
    time: this.props.time
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState((state) => {
        if (state.time === 1) {
          this.props.onFinished();
          this.clearTimer();
        }
        return {
          time: state.time - 1
        };
      });
    }, 1000);
  }

  clearTimer = () => {
    // 如果存在this.timer，則使用clearTimeout清空
    this.timer && clearTimeout(this.timer);
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}> {this.state.time} </Text>
      </View>
    )
  }
}