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

export default class MemoTime extends Component {
  state = {
    questions: [],
    skip: false
  };

  componentDidMount() {
    const questions = createUniqRandomIcons(QUESTION_COUNT);
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
      questions: this.state.questions
    });
  };

  handleSkip = () => {
    this.CountDownTimer.onTimesUp();
  };

  render() {
    return (
      <View style={styles.container}>
        <Text
          style={styles.desc}
        >
          記住每一題的圖形和顏色
        </Text>
        <ScrollView style={styles.questionContainer}>{this.renderQuestions()}</ScrollView>
        <View style={styles.timerContainer}>
          <CountDownTimer
            ref={ref => {
              this.CountDownTimer = ref;
            }}
            seconds={MEMO_TIME}
            onFinished={this.onTimerFinished}
          />
          <TouchableOpacity style={styles.skipButton} onPress={this.handleSkip}>
            <Text style={styles.skipLabel}>跳過</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
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
    right: 15
  },
  skipLabel: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1.5
  },
  desc: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 18
  },
  questionContainer: {
    marginLeft: 15,
    marginRight: 15
  }
});
