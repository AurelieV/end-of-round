import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class UserService {
    private facebookProvider;

    get user(): Observable<firebase.User> {
        return this.afAuth.authState
    }
    
    constructor(private afAuth: AngularFireAuth) {
        this.facebookProvider = new firebase.auth.FacebookAuthProvider();
        this.user.subscribe(u => console.log("user", u))
    }

    connectWithFacebook() {
        this.afAuth.auth.signInWithPopup(this.facebookProvider);
    }

}