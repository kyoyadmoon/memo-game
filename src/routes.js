import React, { Component } from "react";
import { Text, View } from "react-native";
import { Router, Scene, Stack } from "react-native-router-flux";
import Home from "./screens/Home";
import MemoTime from "./screens/MemoTime";
import Exam from "./screens/Exam";

export default class App extends Component {
  render() {
    return (
      <Router>
        <Stack key="root" hideNavBar>
          <Scene key="home" component={Home} />
          <Scene key="memoTime" component={MemoTime} />
          <Scene key="exam" component={Exam} />
        </Stack>
      </Router>
    );
  }
}
