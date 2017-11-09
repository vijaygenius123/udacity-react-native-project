import React, { Component } from 'react'
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { AppLoading } from 'expo'
import { getDecks, removeDecks } from '../utils/helpers'
import { gray, white } from '../utils/colors'

export default class DeckList extends Component {
  state = {
    ready: false,
    decks: []
  }

  getDecks = () => {
    getDecks()
      .then(decks => this.setState(() => ({
          ready: true,
          decks: decks ? Object.keys(decks).reduce((_decks, deck) => {
            _decks.push(decks[deck])
            return _decks
          }, []) : []
      })))
  }

  componentDidMount() {
    //removeDecks()
    this.getDecks()
  }

  componentWillUpdate(newProps) {
    if (newProps.navigation.state.params && newProps.navigation.state.params.refresh) {
      newProps.navigation.state.params.refresh = false
      this.getDecks()
    }
  }

  render() {
    const { ready, decks } = this.state
    if (!ready) {
      return <AppLoading />
    }

    if (!decks || decks.length == 0) {
      return <View style={styles.container}><Text style={styles.noDataText}>No Decks. Let's add some!</Text></View>
    }
    return (
      <View style={styles.deckContainer}>
        <ScrollView style={{width: '100%'}}>
          {decks.map(deck =>
            <View style={styles.item} key={deck.title}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate(
                'DeckDetail',
                { deckId: deck.title }
              )}>
                <Text style={{fontSize: 20, textAlign: 'center'}}>{deck.title}</Text>
                <Text style={{fontSize: 16, color: gray, textAlign: 'center'}}>
                  {deck.questions.length} cards
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
    justifyContent: 'center',
    alignItems: 'center'
  },
  deckContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: white,
    alignItems: 'center'
  },
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: 'center',
    alignItems: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0,0,0,0.24)',
    shadowOffset: {
      width: 0,
      height: 3
    },
    width: '90%'
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20
  }
})
