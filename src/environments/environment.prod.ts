export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: 'AIzaSyBJ2BPKhk_TvZz5XwepEKVFBHSzME4gTuY',
    authDomain: 'end-of-round2.firebaseapp.com',
    databaseURL: 'https://end-of-round2.firebaseio.com',
    projectId: 'end-of-round2',
    storageBucket: '',
    messagingSenderId: '416316690640',
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
