import {NotificationService} from './../../notification.service'
import {AngularFireDatabase} from 'angularfire2/database'
import {Injectable} from '@angular/core'
import {AngularFireAuth} from 'angularfire2/auth'
import * as firebase from 'firebase'
import {Observable} from 'rxjs/Observable'
import {Http} from '@angular/http'

import {environment} from '../../../environments/environment'

export interface AccountData {
  pseudo: string
  email: string
  password: string
}

export type User = firebase.User

@Injectable()
export class UserService {
  get user(): Observable<firebase.User> {
    return this.afAuth.authState
  }

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private http: Http,
    private notificationService: NotificationService
  ) {
    this.user.take(1).subscribe((u) => {
      if (!u) this.afAuth.auth.signInAnonymously()
    })
  }

  isStrongConnected(): boolean {
    if (this.afAuth.auth.currentUser) return false
    return this.afAuth.auth.currentUser.isAnonymous
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut().then(() => {
      this.afAuth.auth.signInAnonymously()
    })
  }

  signIn(email: string, password: string): Promise<any> {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.notificationService.notify('You were successfully logged in')
      })
  }

  set login(login: string) {
    this.afAuth.auth.currentUser.updateProfile({
      displayName: login,
      photoURL: null,
    })
  }

  get login(): string {
    if (!this.afAuth.auth.currentUser) return null
    return this.afAuth.auth.currentUser.displayName
  }

  get uid(): string {
    if (!this.afAuth.auth.currentUser) return null
    return this.afAuth.auth.currentUser.uid
  }

  isAuthorized(tournamentId: string): Observable<boolean> {
    if (!tournamentId) return Observable.of(true)
    const userId = this.afAuth.auth.currentUser.uid
    if (!userId) return Observable.of(false)

    return this.db
      .object(`access/${tournamentId}/${userId}`)
      .valueChanges()
      .take(1)
      .map((access) => access !== null && access !== null)
  }

  access(tournamentId: string, password: string) {
    return this.http.post(environment.accessUrl, {
      tournamentId,
      password,
      userId: this.afAuth.auth.currentUser.uid,
    })
  }

  createAccount({email, pseudo, password}: AccountData): Promise<any> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        this.notificationService.notify(
          'You account has been created. You are now connected'
        )
        return user.updateProfile({
          displayName: pseudo,
          photoURL: null,
        })
      })
  }
}
