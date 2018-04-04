export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: 'AIzaSyC2ZotUqWPnxwZZ9Xup_HnqHdRByYB_IPk',
    authDomain: 'end-of-round.firebaseapp.com',
    databaseURL: 'https://end-of-round.firebaseio.com',
    projectId: 'end-of-round',
    storageBucket: 'end-of-round.appspot.com',
    messagingSenderId: '569384953582',
  },
  accessUrl: '/api/addAccess',
  authenticateUrl: '/api/authenticate',
  authenticateSettings: {
    authority: 'https://apps.magicjudges.org/openid/',
    client_id: '495440',
    redirect_uri: 'http://eor.purple-fox.fr/authent-redirect',
    post_logout_redirect_uri: 'http://eor.purple-fox.fr',
    response_type: 'code',
    scope: 'openid profile dciprofile',
  },
}
