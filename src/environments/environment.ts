// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyC2ZotUqWPnxwZZ9Xup_HnqHdRByYB_IPk",
    authDomain: "end-of-round.firebaseapp.com",
    databaseURL: "https://end-of-round.firebaseio.com",
    projectId: "end-of-round",
    storageBucket: "end-of-round.appspot.com",
    messagingSenderId: "569384953582"
  }
};
