const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({origin: true})
const express = require('express')
const jwt = require('jsonwebtoken')
const Issuer = require('openid-client').Issuer
const bodyParser = require('body-parser')
const config = require('./server.config')

admin.initializeApp({
  credential: admin.credential.cert(config.firebaseKey),
  databaseURL: config.databaseURL,
})

const app = express()
app.use(cors)
app.use(bodyParser.json())

app.post('/addAccess', (req, res) => {
  const userId = req.body.userId
  const password = req.body.password
  const tournamentId = req.body.tournamentId
  if (!userId || !password || !tournamentId)
    return res.status('500').json({error: 'Fields missing'})
  admin
    .database()
    .ref(`/passwords/${tournamentId}`)
    .once('value', (snapshot) => {
      const data = snapshot.val()
      if (data !== password) {
        return res.status(403).json({error: 'Wrong credentials'})
      }
      admin
        .database()
        .ref(`/access/${tournamentId}/${userId}`)
        .set(true)
        .then((_) => res.json({status: 'success'}))
        .catch((err) => res.status(500).json({error: err}))
    })
})

app.post('/authenticate', async function(req, res) {
  const code = req.body.code
  if (!code) {
    return res.status('500').json({error: 'Fields missing'})
  }
  try {
    const issuer = await Issuer.discover(config.judgeAppCredential.issuer)
    Issuer.defaultHttpOptions = {timeout: 250000}
    const client = new issuer.Client({
      client_id: config.judgeAppCredential.client_id,
      client_secret: config.judgeAppCredential.client_secret,
    })
    const tokenSet = await client.authorizationCallback(
      config.authentRedirectUrl,
      {code}
    )
    const info = await client.userinfo(tokenSet.access_token)
    const uid = info.sub
    delete info.sub
    const token = await admin.auth().createCustomToken(uid)
    await admin.auth().setCustomUserClaims(uid, info)

    return res.json({token})
  } catch (e) {
    console.log('error', e)
    res.status('500').json({err: 'Something wrong happen'})
  }
})

app.listen(3000)
