import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/take'
import 'rxjs/add/observable/combineLatest'
import {
  AngularFireDatabase,
  AngularFireObject,
  AngularFireList,
} from 'angularfire2/database'

export class DatabaseAccessor {
  key$: BehaviorSubject<string>

  constructor(protected db: AngularFireDatabase) {
    this.key$ = new BehaviorSubject<string>('')
  }

  set key(key: string) {
    this.key$.next(key)
  }

  get key() {
    return this.key$.getValue()
  }

  getObject<T>(ref: AngularFireObject<T>): Observable<T & {key: string}> {
    return ref
      .snapshotChanges()
      .map(({payload}) => ({key: payload.key, ...payload.val()}))
  }

  getObjectFrom<T>(path: string): Observable<T & {key: string}> {
    return this.getObject<T>(this.db.object(path))
  }

  getList<T>(ref: AngularFireList<T>): Observable<Array<T & {key: string}>> {
    return ref
      .snapshotChanges()
      .map((actions) =>
        actions.map(({payload}) => ({key: payload.key, ...payload.val()}))
      )
  }

  getListFrom<T>(path: string): Observable<Array<T & {key: string}>> {
    return this.getList<T>(this.db.list<T>(path))
  }

  doWithKey<T>(
    action: (string) => Observable<T>,
    defaultValue: any = null
  ): Observable<T> {
    return this.key$.switchMap((key) => {
      if (!key) return Observable.of(defaultValue)
      return action(key)
    })
  }
}
