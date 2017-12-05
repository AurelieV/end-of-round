const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const express = require('express');

admin.initializeApp(functions.config().firebase);

const tournamentFields = ['zones', 'messages', 'outstandings', 'tables', 'passwords', 'access' ];
exports.deleteTournament = functions.database.ref('/tournaments/{id}')
  .onDelete(event => {
    const id = event.params.id;
    return Promise.all(tournamentFields.map(field => {
      return admin.database().ref(`/${field}/${id}`).remove()
    }))
  })

const app = express();
app.use(cors);
app.post('/addAccess', (req, res) => {
  const userId = req.body.userId;
  const password = req.body.password;
  const tournamentId = req.body.tournamentId;
  if (!userId || !password || !tournamentId) return res.status("500").json({ error: "Fields missing" })
  admin.database().ref(`/passwords/${tournamentId}`).once('value', snapshot => {
    const data = snapshot.val();
    if (data !== password) {
      return res.status(403).json({ error: "Wrong credentials" })
    }
    admin.database().ref(`/access/${tournamentId}/${userId}`).set(true)
      .then(_ => res.json({ status: "success" }))
      .catch(err => res.status(500).json({ error: err }))
  })
})

exports.app = functions.https.onRequest(app);

