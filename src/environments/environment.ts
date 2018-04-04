// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyCQfbpg8loIPtP0Db1L6-EDtIRsed6VDbM',
    authDomain: 'end-of-round-dev.firebaseapp.com',
    databaseURL: 'https://end-of-round-dev.firebaseio.com',
    projectId: 'end-of-round-dev',
    storageBucket: '',
    messagingSenderId: '525436489918',
  },
  accessUrl: '/api/addAccess',
  authenticateUrl: '/api/authenticate',
  authenticateSettings: {
    authority: 'https://apps.magicjudges.org/openid/',
    client_id: '495440',
    redirect_uri: 'http://localhost:4200/authent-redirect',
    post_logout_redirect_uri: 'http://localhost:4200',
    response_type: 'code',
    scope: 'openid profile dciprofile',
  },
}
