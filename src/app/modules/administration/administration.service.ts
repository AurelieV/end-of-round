import {AngularFireDatabase} from 'angularfire2/database'
import {Injectable} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/take'
import 'rxjs/add/observable/combineLatest'

import {Zone, ZoneData, Tournament, TournamentData} from '../../model'
export {Zone, ZoneData, Tournament, TournamentData}
import {NotificationService} from './../../notification.service'

@Injectable()
export class AdministrationService {
  constructor(
    private db: AngularFireDatabase,
    private notif: NotificationService
  ) {}

  getTournaments(): Observable<Tournament[]> {
    return this.db
      .list<TournamentData>('/tournaments')
      .snapshotChanges()
      .map((actions) =>
        actions.map(({payload}) => ({key: payload.key, ...payload.val()}))
      )
  }

  getTournament(
    key: string
  ): Observable<{tournament: TournamentData; zones: ZoneData[]}> {
    return Observable.combineLatest(
      this.db
        .object(`/tournaments/${key}`)
        .valueChanges<TournamentData>()
        .take(1),
      this.db
        .list(`/zones/${key}`)
        .valueChanges<ZoneData>()
        .take(1)
    ).map(([tournament, zones]) => ({
      tournament,
      zones: zones.filter((z) => z.name !== 'Feature'),
    }))
  }

  private createZonesAndTables(
    key: string,
    start: number,
    end: number,
    zones: ZoneData[]
  ) {
    return Promise.all(
      zones.map((z) =>
        this.db
          .list(`zones/${key}`)
          .push(z)
          .then((data) => {
            return Object.assign({key: data.key}, z)
          })
      )
    ).then((zones) => {
      const tables: {[id: string]: any} = {}
      zones.forEach((z) => {
        ;(z.tables || []).forEach((section) => {
          for (let i = section.start; i <= section.end; i++) {
            tables[i] = {
              number: '' + i,
              time: 0,
              teamTime: {
                A: 0,
                B: 0,
                C: 0,
              },
              status: '',
              teamStatus: {
                A: '',
                B: '',
                C: '',
              },
              doneTime: null,
              hasResult: false,
              result: null,
              isFeatured: false,
              zoneId: z.key
            }
          }
        })
      })
      return Promise.all([
        this.db.object(`tables/${key}`).set(tables),
        this.db.object(`zones/${key}/feature`).set({
          name: 'Feature',
        }),
      ])
    })
  }

  createTournament(data: TournamentData, zones: ZoneData[], password: string) {
    return this.db
      .list<TournamentData>('tournaments')
      .push(data)
      .then((tournament) => {
        return Promise.all([
          this.createZonesAndTables(
            tournament.key,
            data.start,
            data.end,
            zones
          ),
          this.db.object(`passwords/${tournament.key}`).set(password),
        ])
          .then(() => {
            this.notif.notify(`Tournament ${data.name} created`)
            return tournament.key
          })
          .catch(() => {
            this.notif.notify('Tournament creation failed', true)
          })
      })
  }

  deleteTournament(key: string) {
    this.db
      .list('tournaments')
      .remove(key)
      .then(() => {
        this.notif.notify('Tournament deleted')
      })
      .catch(() => {
        this.notif.notify('Tournament deletion failed', true)
      })
  }

  editTournament(key: string, data: TournamentData, zones: ZoneData[]) {
    this.db
      .object(`tournaments/${key}`)
      .valueChanges<TournamentData>()
      .take(1)
      .subscribe((tournament) => {
        Promise.all([
          this.db.object(`tournaments/${key}`).update(data),
          this.db
            .list(`zones`)
            .remove(key)
            .then(() =>
              this.createZonesAndTables(key, data.start, data.end, zones)
            ),
        ])
          .then(() => this.notif.notify(`Tournament ${data.name} edited`))
          .catch(() => {
            this.notif.notify('Tournament editions failed', true)
          })
      })
  }
}
