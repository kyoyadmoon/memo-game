import _ from "lodash";
import React, { Component } from "react";
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity
} from "react-native";
import IconBox from "../components/IconBox";
import {
  createUniqRandomIcons,
  randomIconColor,
  randomIconName
} from "../utils/icons";
import config from "../configs";
import { Actions } from "react-native-router-flux";
import CountDownTimer from "../components/CountDownTimer";

const { QUESTION_COUNT, MEMO_TIME } = config;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 10,
    justifyContent: "space-around"
  },
  question: {
    marginTop: 15,
    padding: 8,
    justifyContent: "space-around",
    backgroundColor: "#FFF",
    alignItems: "center",
    flexDirection: "row"
  },
  timerContainer: {
    height: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  skipButton: {
    padding: 10,
    backgroundColor: "#29B6F6",
    position: "absolute",
    right: 0
  },
  skipLabel: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5
  }
});

export default class MemoTime extends Component {
  state = {
    questions: []
  };

  static defaultProps = {
    score: 0
  };

  componentWillMount() {
    const questions = createUniqRandomIcons(QUESTION_COUNT);
    // _.times(QUESTION_COUNT, () => ({
    //   name: randomIconName(),
    //   color: randomIconColor()
    // }));
    this.setState({
      questions
    });
  }

  renderQuestions = () => {
    return this.state.questions.map((question, index) => (
      <View
        key={index}
        style={[
          styles.question,
          _.random(1) ? { flexDirection: "row-reverse" } : {}
        ]}
      >
        <IconBox
          title="Color"
          iconName={randomIconName()}
          iconColor={question.color}
        />
        <IconBox
          title="Shape"
          iconName={question.name}
          iconColor={randomIconColor()}
        />
      </View>
    ));
  };

  onTimerFinished = () => {
    Actions.exam({
      questions: this.state.questions,
      current: this.props.score
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>{this.renderQuestions()}</ScrollView>
        <View style={styles.timerContainer}>
          <CountDownTimer time={MEMO_TIME} onFinished={this.onTimerFinished} />
          <TouchableOpacity
            style={styles.skipButton}
            onPress={this.onTimerFinished}
          >
            <Text style={styles.skipLabel}>跳過</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
