import {NotificationService} from './../../notification.service'
import {AngularFireDatabase} from 'angularfire2/database'
import {Injectable} from '@angular/core'
import {AngularFireAuth} from 'angularfire2/auth'
import * as firebase from 'firebase'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/share'
import {Http} from '@angular/http'

import * as Oidc from 'oidc-client'
import jwt_decode from 'jwt-decode'

import {environment} from '../../../environments/environment'

export interface AccountData {
  pseudo: string
  email: string
  password: string
}

export type User = firebase.User
export interface UserInfo {
  sub: number
  name: string
  given_name: string
  family_name: string
  nickname: string
  preferred_username: string
  email: string
  level: number
  dci_number: number
  region: string
  picture: string
}

@Injectable()
export class UserService {
  get user(): Observable<firebase.User> {
    return this.afAuth.authState
  }

  get userInfo(): Observable<UserInfo> {
    return this.user
      .switchMap((user) => (user ? user.getIdToken() : Observable.of(null)))
      .map((token) => (token ? jwt_decode(token) : null))
  }

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private http: Http,
    private notificationService: NotificationService
  ) {}

  isStrongConnected(): boolean {
    if (this.afAuth.auth.currentUser) return false
    return !this.afAuth.auth.currentUser.isAnonymous
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut()
  }

  signIn(email: string, password: string): Promise<any> {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.notificationService.notify('You were successfully logged in')
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

    return this.userInfo.take(1).switchMap((userInfo) => {
      if (userInfo.level >= 3) {
        return Observable.of(true)
      }
      return this.db
        .object(`access/${tournamentId}/${userId}`)
        .valueChanges()
        .take(1)
        .map((access) => Boolean(access))
    })
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

  loginWithJudgeApps() {
    const client = new Oidc.UserManager(environment.authenticateSettings)
    client.signinRedirect()
  }

  processJudgeAppsToken(code: string): Observable<any> {
    const result = this.http
      .post(environment.authenticateUrl, {
        code,
      })
      .share()
    result.map((res) => res.json().token).subscribe((token) =>
      this.afAuth.auth.signInWithCustomToken(token).then(() => {
        this.notificationService.notify('You were successfully logged in')
      })
    )

    return result
  }
}
