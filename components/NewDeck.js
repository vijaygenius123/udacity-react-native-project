import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Platform, StyleSheet, TextInput } from 'react-native'
import { saveDeckTitle } from '../utils/helpers'
import { white, blue } from '../utils/colors'
import { NavigationActions } from 'react-navigation'

function SubmitBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
      onPress={onPress}>
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  )
}

export default class NewDeck extends Component {
  state = {
    title: null
  }

  submit = () => {
    saveDeckTitle(this.state.title)
      .then(this.toHome)
  }

  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'DeckList',
      params: {refresh: true}
    }))
  }

  render() {
    return (
      <View style={styles.container}>
          <Text style={styles.header}>What is the title of your new deck?</Text>
          <TextInput
            style={{height: 40, marginTop: 20, borderColor: 'gray'}}
            onChangeText={(text) => this.setState({title: text})}
            value={this.state.title}
          />
          <SubmitBtn onPress={this.submit} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
    justifyContent: 'center'
  },
  iosSubmitBtn: {
    backgroundColor: blue,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 20
  },
  androidSubmitBtn: {
    backgroundColor: blue,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 2,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  },
  header: {
    fontSize: 35,
    textAlign: 'center',
  },
})
