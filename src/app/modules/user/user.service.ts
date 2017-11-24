import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase'
import { Observable } from 'rxjs/Observable'

@Injectable()
export class UserService {
    private facebookProvider;

    get user(): Observable<firebase.User> {
        return this.afAuth.authState;
    }
    
    constructor(private afAuth: AngularFireAuth) {
        this.facebookProvider = new firebase.auth.FacebookAuthProvider();
        this.user.take(1).subscribe(u => {
            if (!u) this.afAuth.auth.signInAnonymously();
        })
    }

    connectWithFacebook() {
        this.afAuth.auth.signInWithPopup(this.facebookProvider);
    }

    isStrongConnected(): boolean {
        if (this.afAuth.auth.currentUser) return false;
        return this.afAuth.auth.currentUser.isAnonymous;
    }

    set login(login: string) {
        this.afAuth.auth.currentUser.updateProfile({
            displayName: login,
            photoURL: null
        })
    }

    get login(): string {
        if (!this.afAuth.auth.currentUser) return null;
        return this.afAuth.auth.currentUser.displayName;
    }
}