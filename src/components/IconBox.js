import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    padding: 10
  },
  icon: {

  }
});

export default IconBox = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{props.title}</Text>
      <Icon style={styles.icon} name={props.iconName} size={40} color={props.iconColor} />
    </View>
  )
}