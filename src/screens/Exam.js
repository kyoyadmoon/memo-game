import _ from "lodash";
import PropTypes from "prop-types";
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
  static propTypes = {
    questions: PropTypes.array.isRequired
  };

  state = {
    selected: [],
    items: [],
    isFinished: false,
    score: 0
  };

  componentDidMount() {
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
    // 玩家選完答案 -> 遊戲結束
    if (
      prevState !== this.state &&
      this.state.selected.length === this.props.questions.length &&
      this.state.isFinished === false
    ) {
      this.gameFinished();
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
    // 如果是新紀錄 -> 記錄最高分到 AsyncStorage
    const highestScore = await getItem(config.HIGHEST_SCORE_STORAGE);
    if (score > highestScore) {
      setItem(config.HIGHEST_SCORE_STORAGE, score);
      Alert.alert("破了新紀錄");
    }
  };

  getOpacity = item => {
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
          style={{ padding: 12, opacity: this.getOpacity(item) }}
        />
      </TouchableOpacity>
    ));
  };

  onTimerFinished = () => {
    this.gameFinished();
  };

  handleEndButton = () => {
    Actions.home({ lastScore: this.state.score });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.desc}>
          選出正確的{this.props.questions.length}個顏色圖形組合
        </Text>
        <View style={styles.content}>
          {this.renderQuestions()}
        </View>
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
