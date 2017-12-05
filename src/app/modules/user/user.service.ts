import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase'
import { Observable } from 'rxjs/Observable'
import { Http } from '@angular/http';

import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
    private facebookProvider;

    get user(): Observable<firebase.User> {
        return this.afAuth.authState;
    }
    
    constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private http: Http) {
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

    isAuthorized(tournamentId: string): Observable<boolean> {
        if (!tournamentId) return Observable.of(true);
        const userId = this.afAuth.auth.currentUser.uid;
        if (!userId) return Observable.of(false);

        return this.db.object(`access/${tournamentId}/${userId}`)
            .valueChanges()
            .take(1)
            .map(access => access !== null && access !== null)
    }

    access(tournamentId: string, password: string) {
        return this.http.post(environment.accessUrl, { tournamentId, password, userId: this.afAuth.auth.currentUser.uid });
    }
}