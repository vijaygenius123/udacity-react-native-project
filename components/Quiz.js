import React, { Component } from 'react'
import { white, blue, red, green, orange } from '../utils/colors'
import { AppLoading } from 'expo'
import { getDeck, clearLocalNotifications, setLocalNotification } from '../utils/helpers'
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native'
import { NavigationActions } from 'react-navigation'


function GeneralBtn({ onPress, buttonStyle, textStyle, buttonText }) {
  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}>
      <Text style={textStyle}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

export default class Quiz extends Component {
  state = {
    correctCount: 0,
    currentQuestion: 0,
    showFinal: false,
    showAnswer: false,
    ready: false,
    deck: null
  }

  static navigationOptions = ({ navigation }) => {
    const { deckId } = navigation.state.params

    return {
      title: deckId + " Quiz"
    }
  }

  answerQuestion = (correct) => {
    const { deck, correctCount, currentQuestion } = this.state
    const newCorrectQuestion = currentQuestion + 1
    if (correct) {
      const newCorrectCount = correctCount + 1
      if (newCorrectQuestion < deck.questions.length) {
        this.setState((prevState) => ({
          ...prevState,
          correctCount: newCorrectCount,
          currentQuestion: newCorrectQuestion,
          showAnswer: false,
        }))
      } else {
        this.setState((prevState) => ({
          ...prevState,
          correctCount: newCorrectCount,
          showFinal: true
        }))
        clearLocalNotifications().then(setLocalNotification);
      }
    } else if (newCorrectQuestion < deck.questions.length) {
      this.setState((prevState) => ({
        ...prevState,
        currentQuestion: newCorrectQuestion,
        showAnswer: false
      }))
    } else {
      this.setState((prevState) => ({
        ...prevState, showFinal: true
      }))
      clearLocalNotifications().then(setLocalNotification);
    }
  }

  backToDeck = () => {
    this.props.navigation.dispatch(NavigationActions.back())
  }

  restartQuiz = () => {
    this.setState((prevState) => ({
      ...prevState,
      correctCount: 0,
      currentQuestion: 0,
      showAnswer: false,
      showFinal: false
    }))
  }

  toggleAnswer = () => {
    const { showAnswer } = this.state

    this.setState((prevState) => ({
      ...prevState,
      showAnswer: !showAnswer
    }))
  }

  componentDidMount() {
    const { deckId } = this.props.navigation.state.params
    getDeck(deckId)
      .then((deck) => this.setState({
        deck,
        correctCount: 0,
        currentQuestion: 0,
        showAnswer: false,
        showFinal: false,
        ready: true
      }))
  }

  render() {
    const { deck, currentQuestion, showFinal, showAnswer, ready, correctCount } = this.state

    if (!ready) {
      return <AppLoading />
    }

    if (deck.questions.length == 0) {
      return (
        <View style={styles.container}>
          <Text style={{fontSize: 16, textAlign: 'center'}}>
            No questions in deck.
          </Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <Text style={{fontSize: 18}}>
          {currentQuestion + 1}/{deck.questions.length}
        </Text>
        <View style={styles.quizContainer}>
            {showFinal
              ? <View>
                  <Text style={styles.header}>
                    Score: {correctCount}/{deck.questions.length}
                  </Text>
                  <GeneralBtn
                    onPress={this.backToDeck}
                    buttonStyle={Platform.OS === 'ios' ? styles.iosBackBtn : styles.androidBackBtn}
                    textStyle={styles.backBtnText}
                    buttonText="Back to Deck"
                  />
                  <GeneralBtn
                    onPress={this.restartQuiz}
                    buttonStyle={Platform.OS === 'ios' ? styles.iosRestartBtn : styles.androidRestartBtn}
                    textStyle={styles.restartBtnText}
                    buttonText="Restart Quiz"
                  />
                </View>
              : <View>
                  <Text style={styles.header}>
                      {showAnswer
                        ? deck.questions[currentQuestion].answer
                        : deck.questions[currentQuestion].question
                      }
                    </Text>
                    <TouchableOpacity onPress={this.toggleAnswer}>
                      <Text style={{fontSize: 20, paddingTop: 10, textAlign: 'center', color: orange}}>
                        {showAnswer ? 'Question' : 'Answer'}
                      </Text>
                    </TouchableOpacity>
                    <GeneralBtn
                      onPress={() => this.answerQuestion(true)}
                      buttonStyle={Platform.OS === 'ios' ? styles.iosCorrectBtn : styles.androidCorrectBtn}
                      textStyle={styles.correctBtnText}
                      buttonText="Correct"
                    />
                    <GeneralBtn
                      onPress={() => this.answerQuestion(false)}
                      buttonStyle={Platform.OS === 'ios' ? styles.iosIncorrectBtn : styles.androidIncorrectBtn}
                      textStyle={styles.incorrectBtnText}
                      buttonText="Incorrect"
                    />
                  </View>
            }
        </View>
      </View>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: white,
  },
  quizContainer: {
    flex: 1,
    backgroundColor: white,
    justifyContent: 'center'
  },
  iosCorrectBtn: {
    backgroundColor: green,
    padding: 15,
    borderRadius: 10,
    height: 40,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 15
  },
  androidCorrectBtn: {
    backgroundColor: green,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 2,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  correctBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  },
  iosIncorrectBtn: {
    backgroundColor: red,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 20
  },
  androidIncorrectBtn: {
    backgroundColor: red,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    borderRadius: 2,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  incorrectBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  },
  iosBackBtn: {
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
  androidBackBtn: {
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
  backBtnText: {
    color: blue,
    fontSize: 22,
    textAlign: 'center'
  },
  iosRestartBtn: {
    backgroundColor: blue,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
    marginTop: 20
  },
  androidRestartBtn: {
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
  restartBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  },
  header: {
    fontSize: 35,
    textAlign: 'center',
  },
})
