const admin = require('firebase-admin')
const devKey = require('./keys/dev.key.json')
const prodKey = require('./keys/prod.key.json')

const devApp = admin.initializeApp({
  credential: admin.credential.cert(devKey),
  databaseURL: 'https://end-of-round-dev.firebaseio.com',
})
const prodApp = admin.initializeApp(
  {
    credential: admin.credential.cert(prodKey),
    databaseURL: 'https://end-of-round.firebaseio.com',
  },
  'prod'
)

module.exports = {
  prod: prodApp,
  dev: devApp,
}
