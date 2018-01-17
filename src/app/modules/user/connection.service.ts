import {AngularFireDatabase} from 'angularfire2/database'
import {Injectable} from '@angular/core'
import {FirebaseApp} from 'angularfire2'

@Injectable()
export class ConnectionService {
  isConnected: boolean

  constructor(db: AngularFireDatabase) {
    db.database
      .ref()
      .child('/.info/connected')
      .on('value', (snap) => {
        if (!snap) return
        if (snap.val() === true) {
          this.isConnected = true
        } else {
          this.isConnected = false
        }
      })
  }
}
