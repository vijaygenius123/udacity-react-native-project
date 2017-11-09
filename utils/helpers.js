import React from 'react'
import { AsyncStorage } from 'react-native'
import { Notifications, Permissions } from 'expo'

let FLASHCARD_KEY = 'mobile-flashcards:flashcards'
const NOTIFICATION_KEY = 'mobile-flashcards:notifications'

export function getDecks() {
  return AsyncStorage.getItem(FLASHCARD_KEY).then(JSON.parse)
}

export function getDeck(id) {
  return AsyncStorage.getItem(FLASHCARD_KEY).then(JSON.parse).then((data) => data[id])
}

export function saveDeckTitle(title) {
  return AsyncStorage.getItem(FLASHCARD_KEY)
    .then(JSON.parse)
    .then((data) => {
      let newData = JSON.stringify(
        {
          ...data,
          [title]: {
            title: title,
            questions: []
          }
        }
      )
      return AsyncStorage.setItem(FLASHCARD_KEY, newData)
    })
}

export function addCardToDeck(title, card) {
  return AsyncStorage.getItem(FLASHCARD_KEY)
    .then(JSON.parse)
    .then((data) => {
      let questions = data[title].questions;
      questions.push(card)
      let newData = JSON.stringify(
        {
          ...data,
          [title]: {
            ...data[title],
            questions: questions
          }
        }
      )
      return AsyncStorage.setItem(FLASHCARD_KEY, newData)
    })
}

export function removeDecks() {
  return AsyncStorage.removeItem(FLASHCARD_KEY)
}

export function clearLocalNotifications() {
  return AsyncStorage.removeItem(NOTIFICATION_KEY)
    .then(Notifications.cancelAllScheduledNotificationsAsync)
}

function createNotification() {
  return {
    title: 'Take a quiz',
    body: "👋  don't forget to complete a quiz today!",
    ios: {
      sound: true
    },
    android: {
      sound: true,
      priority: 'high',
      sticky: false,
      vibrate: true
    }
  }
}

export function setLocalNotification() {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then((data) => {
      if (data === null) {
        Permissions.askAsync(Permissions.NOTIFICATIONS)
          .then(({ status }) => {
            if (status === 'granted') {
              Notifications.cancelAllScheduledNotificationsAsync()

              let tomorrow = new Date()
              tomorrow.setDate(tomorrow.getDate() + 1)
              tomorrow.setHours(20)
              tomorrow.setMinutes(0)

              Notifications.scheduleLocalNotificationAsync(
                createNotification(),
                {
                  time: tomorrow,
                  repeat: 'day'
                }
              )

              AsyncStorage.setItem(NOTIFICATION_KEY, JSON.string(true))
            }
          })
      }
    })
}
