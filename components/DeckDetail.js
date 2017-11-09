import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { AppLoading } from 'expo'
import { getDeck } from '../utils/helpers'
import { blue, white, gray } from '../utils/colors'
import { NavigationActions } from 'react-navigation'

function AddCardBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.iosCardBtn : styles.androidCardBtn}
      onPress={onPress}>
      <Text style={styles.addCardBtnText}>Add Card</Text>
    </TouchableOpacity>
  )
}

function StartQuizBtn({ onPress }) {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.iosQuizBtn : styles.androidQuizBtn}
      onPress={onPress}>
      <Text style={styles.startQuizBtnText}>Start Quiz</Text>
    </TouchableOpacity>
  )
}

export default class DeckDetail extends Component {
  state = {
    deck: null,
    ready: false
  }

  static navigationOptions = ({ navigation }) => {
    const { deckId } = navigation.state.params

    return {
      title: deckId
    }
  }

  addCard = () => {
    this.props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'NewCard',
      params: {deckId: this.props.navigation.state.params.deckId}
    }))
  }

  startQuiz = () => {
    this.props.navigation.dispatch(NavigationActions.navigate({
      routeName: 'Quiz',
      params: {deckId: this.props.navigation.state.params.deckId}
    }))
  }

  componentDidMount() {
    const { deckId } = this.props.navigation.state.params
    getDeck(deckId)
      .then((deck) => this.setState({ deck, ready: true }))
  }

  render() {
    const { ready, deck } = this.state
    if (!ready) {
      return <AppLoading />
    }

    return (
      <View style={styles.container}>
          <Text style={styles.header}>{deck.title}</Text>
          <Text style={{fontSize: 16, color: gray, textAlign: 'center', marginBottom: 40}}>
            {deck.questions.length} cards
          </Text>
          <AddCardBtn onPress={this.addCard} />
          <StartQuizBtn onPress={this.startQuiz} />
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
  iosCardBtn: {
    backgroundColor: white,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 20,
    borderWidth: 2,
    borderColor: blue
  },
  androidCardBtn: {
    backgroundColor: white,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 2,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: blue
  },
  addCardBtnText: {
    color: blue,
    fontSize: 22,
    textAlign: 'center'
  },
  iosQuizBtn: {
    backgroundColor: blue,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 20
  },
  androidQuizBtn: {
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
  startQuizBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  },
  header: {
    fontSize: 35,
    textAlign: 'center',
  },
})
