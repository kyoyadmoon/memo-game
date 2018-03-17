import _ from "lodash";
import React, { Component, PureComponent } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal
} from "react-native";
import IconBox from "../components/IconBox";
import {
  createUniqRandomIcons,
  randomIconColor,
  randomIconName
} from "../utils/icons";
import config from "../configs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CountDownTimer from "../components/CountDownTimer";
import { Actions } from "react-native-router-flux";
import { getItem, setItem } from "../utils/asyncStorage";

const { ANSWER_TIME, QUESTION_COUNT, SELECTION_COUNT } = config;

export default class Exam extends Component {
  state = {
    selected: [],
    items: [],
    answers: [],
    isFinished: false,
    // isWin: true,
    score: 0
  };

  componentWillMount() {
    // const items = this.props.questions.map(question => ({
    //   ...question,
    //   selected: false
    // }));
    // while (items.length < SELECTION_COUNT) {
    //   const newIcon = {
    //     name: randomIconName(),
    //     color: randomIconColor(),
    //     selected: false
    //   };
    //   const isExist = _.find(items, newIcon);
    //   if (isExist === undefined) {
    //     items.push(newIcon);
    //   }
    // }
    const icons = createUniqRandomIcons(SELECTION_COUNT, this.props.questions);
    const items = icons.map(icon => ({ ...icon, selected: false }));
    // console.dir(items);
    const shuffleItems = _.shuffle(items);
    this.setState({
      items: shuffleItems
    });
  }

  checkAnswer = targetIcon => {
    const { name, color } = targetIcon;
    const result = _.find(this.props.questions, { name, color });
    return result !== undefined;
  };

  componentDidUpdate = (prevState, prevProps) => {
    if (
      prevState !== this.state &&
      this.state.selected.length === this.props.questions.length &&
      this.state.isFinished === false
    ) {
      const concatIcons = _.concat(
        [],
        this.state.selected,
        this.props.questions
      );
      const uniqIcons = _.uniqWith(
        concatIcons,
        (arr1, arr2) => arr1.name === arr2.name && arr1.color === arr2.color
      );
      // if (uniqIcons.length === this.props.questions.length) {
      this.gameFinished();
      // }
    }
  };

  calcScore = () => {
    let count = 0;
    for (let item of this.state.selected) {
      const isCorrect = this.checkAnswer(item);
      if (isCorrect) {
        count += 1;
      }
    }
    return count;
  };

  gameFinished = async () => {
    const score = this.calcScore();
    this.setState({ isFinished: true, score });
    // record score
    const highestScore = await getItem(config.HIGHEST_SCORE_STORAGE);
    if (score > highestScore) {
      setItem(config.HIGHEST_SCORE_STORAGE, score);
      Alert.alert("破了新紀錄");
    }
  };

  calOpacity = item => {
    if (this.state.isFinished) {
      const { name, color } = item;
      const isQuestion =
        _.find(this.props.questions, { name, color }) !== undefined;
      if (isQuestion) {
        return item.selected ? 0.7 : 1;
      }
      return 0.2;
    }
    return item.selected ? 0.7 : 1;
  };

  handleIconPressed = targetIcon => {
    this.setState(state => {
      state.items[_.indexOf(state.items, targetIcon)].selected = true;
      state.selected = [...state.selected, targetIcon];
      return state;
    });
    // const isCorrect = this.checkAnswer(targetIcon);
    // if (!isCorrect) {
    //   this.setState({ isWin: false }, () => {
    //     this.gameFinished();
    //   });
    // }
  };

  renderQuestions = () => {
    return this.state.items.map((item, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => this.handleIconPressed(item)}
        disabled={item.selected}
      >
        <Icon
          name={item.name}
          size={40}
          color={item.color}
          style={{ padding: 12, opacity: this.calOpacity(item) }}
        />
      </TouchableOpacity>
    ));
  };

  checkAnswers = () => {
    if (this.state.selected.length === this.props.questions.length) {
      for (let item of this.state.selected) {
        const isCorrect = this.checkAnswer(item);
        if (!isCorrect) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  };

  onTimerFinished = () => {
    const isCorrect = this.checkAnswers();
    // this.setState({ isWin: isCorrect },
    this.gameFinished();
    // );
  };

  handleEndButton = () => {
    // if (this.state.isWin) {
    //   Actions.memoTime();
    // } else {
    Actions.home({ lastScore: this.state.score });
    // }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.desc}>選出正確的顏色圖形組合</Text>
        <View style={styles.content}>{this.renderQuestions()}</View>
        <View style={styles.footer}>
          {this.state.isFinished ? (
            <View style={styles.resultContainer}>
              <Text style={[styles.label, { color: "#EF5350" }]}>
                答對了{this.state.score}題
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={this.handleEndButton}
              >
                <Text style={[styles.label, { color: "#FFF" }]}>回首頁</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <CountDownTimer
              seconds={ANSWER_TIME}
              onFinished={this.onTimerFinished}
            />
          )}
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: "space-around",
    alignItems: "center"
  },
  content: {
    margin: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: "#FFF"
  },
  footer: {
    height: 120,
    justifyContent: "center"
  },
  resultContainer: {
    flex: 1,
    justifyContent: "space-around"
  },
  button: {
    padding: 10,
    backgroundColor: "#29B6F6"
  },
  label: {
    fontSize: 20,
    fontWeight: "600",
    color: "#29B6F6",
    textAlign: "center"
  },
  desc: {
    marginTop: 10,
    fontSize: 20
  }
});