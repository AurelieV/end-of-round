import {AngularFireDatabase} from 'angularfire2/database'
import {Injectable} from '@angular/core'
import {FirebaseApp} from 'angularfire2'
import {UserService} from './user.service'

import 'rxjs/add/operator/scan'

@Injectable()
export class ConnectionService {
  isConnected: boolean

  constructor(db: AngularFireDatabase, userService: UserService) {
    db.database
      .ref()
      .child('/.info/connected')
      .on('value', (snap) => {
        if (!snap) return
        if (snap.val() === true) {
          this.isConnected = true
          const uid = userService.uid
          if (uid) {
            const precense = db.database.ref(`/precense/${uid}`)
            precense.onDisconnect().remove()
            userService.userInfo.take(1).subscribe((info) => {
              precense.set({
                name: `${info.given_name} ${info.family_name}`,
              })
            })
          }
        } else {
          this.isConnected = false
        }
      })
    userService.userInfo
      .scan(
        ({current: previous}, current) => ({
          previous,
          current,
        }),
        {previous: null, current: null}
      )
      .subscribe(({current, previous}) => {
        if (current) {
          db.database.ref(`/precense/${current.sub}`).set({
            name: `${current.given_name} ${current.family_name}`,
          })
        }
        if (previous) {
          db.database.ref(`/precense/${previous.sub}`).remove()
        }
      })
  }
}
