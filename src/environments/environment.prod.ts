export const environment = {
  production: true,
  firebaseConfig: {
    apiKey: 'AIzaSyDALInVBJ45EvbBmkW5Sz9mCxXI1bpIrno',
    authDomain: 'purple-fox-china.firebaseapp.com',
    databaseURL: 'https://purple-fox-china.mtgjudge.cn',
    projectId: 'purple-fox-china',
    storageBucket: 'purple-fox-china.appspot.com',
    messagingSenderId: '335123173342',
  },
  accessUrl: '/api/addAccess',
  authenticateUrl: '/api/authenticate',
  authenticateSettings: {
    authority: 'https://apps.mtgjudge.cn/openid/',
    client_id: '428279',
    redirect_uri: 'http://eor.mtgjudge.cn/authent-redirect',
    post_logout_redirect_uri: 'http://eor.mtgjudge.cn',
    response_type: 'code',
    scope: 'openid profile dciprofile',
  },
}
