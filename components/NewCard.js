import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Platform, StyleSheet, TextInput } from 'react-native'
import { addCardToDeck } from '../utils/helpers'
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

export default class NewCard extends Component {

  state = {
    question: null,
    answer: null,
  }
  submit = () => {
    addCardToDeck(this.props.navigation.state.params.deckId, this.state)
      .then(this.toDeckDetail)
  }

  toDeckDetail = () => {
    this.props.navigation.dispatch(NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'Home'}),
        NavigationActions.navigate({ routeName: 'DeckDetail', params: { deckId: this.props.navigation.state.params.deckId }})
      ]
    }))
  }

  render() {
    return (
      <View style={styles.container}>
          <Text>Question</Text>
          <TextInput
            style={{height: 40, marginBottom: 20, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.setState((prevState) => ({ ...prevState, question: text}))}
            value={this.state.question}
          />
          <Text>Answer</Text>
          <TextInput
            style={{height: 40, marginBottom: 20, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(text) => this.setState((prevState) => ({ ...prevState, answer: text}))}
            value={this.state.answer}
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
    backgroundColor: white
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
