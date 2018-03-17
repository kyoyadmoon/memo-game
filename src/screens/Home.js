import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Button,
  CheckBox
} from "react-native";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { getItem, setItem } from "../utils/asyncStorage";
import config from "../configs";

export default class Home extends Component {
  static defaultProps = {
    lastScore: 0
  };

  state = {
    highestScore: 0
  };

  async componentDidMount() {
    const highestScore = await getItem(config.HIGHEST_SCORE_STORAGE);
    if (highestScore !== undefined) {
      this.setState({ highestScore });
    } else {
      setItem(config.HIGHEST_SCORE_STORAGE, 0);
    }
  }

  onStart = () => {
    Actions.memoTime();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>MemoGame</Text>
          </View>
          <View style={styles.modalContent}>
            <View style={styles.highestScore}>
              <Icon name="trophy" size={28} color="#FFD600" />
              <Text style={styles.label}>
                最高分: {this.state.highestScore}
              </Text>
            </View>
            <View style={styles.highestScore}>
              <Icon name="flag-checkered" size={28} color="#40C4FF" />
              <Text style={styles.label}>上一局: {this.props.lastScore}</Text>
            </View>
            <View style={styles.shadowContainer}>
              <TouchableOpacity style={styles.startBtn} onPress={this.onStart}>
                <Text style={styles.startBtnText}> Start </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modal: {
    backgroundColor: "#FEFEFE",
    height: "50%",
    width: "80%",
    shadowColor: "#555",
    shadowRadius: 4,
    shadowOpacity: 0.7,
    shadowOffset: {
      width: 2,
      height: 3
    }
  },
  modalHeader: {
    height: "20%",
    justifyContent: "center",
    backgroundColor: "#EF5350",
    shadowRadius: 4,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 1
    }
  },
  modalTitle: {
    textAlign: "center",
    color: "#FFF",
    fontSize: 26,
    fontWeight: "900"
  },
  modalContent: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center"
  },
  highestScore: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  startBtn: {
    height: 45,
    paddingLeft: 25,
    paddingRight: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1DE9B6"
  },
  startBtnText: {
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: "700",
    color: "#FFF"
  },
  shadowContainer: {
    shadowRadius: 2,
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 2,
      height: 2
    }
  },
  label: {
    fontSize: 19,
    fontWeight: "500",
    paddingLeft: 5,
    paddingRight: 5
  }
});