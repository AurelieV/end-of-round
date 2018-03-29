const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp(functions.config().firebase)

const tournamentFields = [
  'zones',
  'messages',
  'outstandings',
  'tables',
  'passwords',
  'access',
  'judges',
  'needHelp',
  'clock',
]
exports.deleteTournament = functions.database
  .ref('/tournaments/{id}')
  .onDelete((event) => {
    const id = event.params.id
    return Promise.all(
      tournamentFields.map((field) => {
        return admin
          .database()
          .ref(`/${field}/${id}`)
          .remove()
      })
    )
  })
