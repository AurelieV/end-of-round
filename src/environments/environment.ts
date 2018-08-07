// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

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
