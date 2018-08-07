import {Injectable} from '@angular/core'
import {AngularFireDatabase} from 'angularfire2/database'
import 'rxjs/add/operator/scan'

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
