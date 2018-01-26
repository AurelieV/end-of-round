import {TableStatus} from './tournament.service'
import {Injectable, NgZone} from '@angular/core'
import {
  AngularFireDatabase,
  AngularFireObject,
  AngularFireList,
} from 'angularfire2/database'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/take'
import 'rxjs/add/observable/combineLatest'

import {UserService} from './../user/user.service'
import {TournamentData, Tournament, Zone, ZoneData, Message} from '../../model'
export {Tournament, TournamentData, Zone, ZoneData, Message}
import {DatabaseAccessor} from './../../utils/database-accessor'
import {NotificationService} from './../../notification.service'

export interface TableData {
  zoneId: string
  number: string

  status: TableStatus
  teamStatus?: TeamTableStatus

  time?: number
  teamTime?: TeamTime

  doneTime?: Date
  result?: Result
  hasResult?: boolean
  assignated?: string

  isTop?: boolean
  isFeatured?: boolean
}
export interface Table extends TableData {
  key: string
}
export interface TeamTime {
  A?: number
  B?: number
  C?: number
}
export interface CoverageData {
  player1: string
  player2: string
  player1Score: number
  player2Score: number
}
export interface CoveredTable extends Table {
  coverage: CoverageData
}
export interface Result {
  player1: {
    score: number
    drop: boolean
  }
  player2: {
    score: number
    drop: boolean
  }
  draw: number
}

export type TableStatus = 'playing' | 'covered' | 'done' | ''

export interface TeamTableStatus {
  A: TableStatus
  B: TableStatus
  C: TableStatus
}

export interface TablesInformation {
  playing: number
  covered: number
  extraTimed: number
  remaining: number
}

@Injectable()
export class TournamentService extends DatabaseAccessor {
  constructor(
    db: AngularFireDatabase,
    private userService: UserService,
    private notif: NotificationService
  ) {
    super(db)
  }

  getTournament(): Observable<Tournament> {
    return this.doWithKey<Tournament>((key) =>
      this.getObjectFrom<TournamentData>(`/tournaments/${key}`)
    )
  }

  getZones(): Observable<Zone[]> {
    return this.doWithKey<Zone[]>(
      (key) => this.getListFrom<ZoneData>(`/zones/${key}`),
      []
    )
  }

  getAllZones(): Observable<Zone[]> {
    return this.getZones().map((zones) => {
      if (zones.length > 2) {
        return [{key: 'all', name: 'All'}].concat(zones)
      } else {
        return zones
      }
    })
  }

  getAllTables(): Observable<Table[]> {
    return this.doWithKey<Table[]>(
      (key) => this.getListFrom<Table>(`/tables/${key}`),
      []
    )
  }

  getOutstandings(): Observable<string[]> {
    return this.doWithKey<string[]>((key) => {
      return this.db
        .object(`/outstandings/${key}`)
        .valueChanges<string>()
        .map((val) => {
          return val ? val.split(' ') : []
        })
    }, [])
  }

  isOnOutstandingsStep(): Observable<boolean> {
    return this.getOutstandings().map((out) => out.length > 0)
  }

  getOutstandingsTables(): Observable<Table[]> {
    return Observable.combineLatest(
      this.getOutstandings(),
      this.getAllTables()
    ).map(([outstandings, tables]) => {
      if (outstandings.length === 0) return tables

      return tables.filter((t) => outstandings.includes(t.number))
    })
  }

  getActiveTables(): Observable<Table[]> {
    return this.getOutstandingsTables().map((tables) =>
      tables.filter((t) => !t.hasResult)
    )
  }

  getOkTables(): Observable<Table[]> {
    return this.getOutstandingsTables().map((tables) =>
      tables.filter((t) => t.hasResult)
    )
  }

  getAllTablesByZone(zoneId: string): Observable<Table[]> {
    if (zoneId === 'all') return this.getAllTables()
    return this.doWithKey<Table[]>((key) => {
      let list$
      if (zoneId === 'feature') {
        list$ = this.db.list(`/tables/${key}/`, (ref) =>
          ref.orderByChild('isFeatured').equalTo(true)
        )
      } else {
        list$ = this.db.list(`/tables/${key}/`, (ref) =>
          ref.orderByChild('zoneId').equalTo(zoneId)
        )
      }
      return this.getList<Table>(list$)
    }, [])
  }

  getOutstandingsTablesByZone(zoneId: string): Observable<Table[]> {
    return Observable.combineLatest(
      this.getOutstandings(),
      this.getAllTablesByZone(zoneId)
    ).map(([outstandings, tables]) => {
      if (outstandings.length === 0) return tables

      return tables.filter((t) => outstandings.includes(t.number))
    })
  }

  getActiveTablesByZone(zoneId: string): Observable<Table[]> {
    return this.getOutstandingsTablesByZone(zoneId).map((tables) =>
      tables.filter((t) => !t.hasResult)
    )
  }

  getOkTablesByZone(zoneId: string): Observable<Table[]> {
    return this.getOutstandingsTablesByZone(zoneId).map((tables) =>
      tables.filter((t) => t.hasResult)
    )
  }

  isTeam(): Observable<boolean> {
    return this.getTournament().map((t) => t.isTeam)
  }

  filterExtraTimedTable(tables: Table[], isTeam: boolean) {
    return (tables || []).filter((t) => {
      if (isTeam) {
        return (
          (t.teamTime.A > 0 || t.teamTime.B > 0 || t.teamTime.C > 0) &&
          t.status !== 'done'
        )
      } else {
        return t.time > 0 && t.status !== 'done'
      }
    })
  }

  getActiveTablesInformationByZone(
    zoneId: string
  ): Observable<TablesInformation> {
    const tables$ = this.getActiveTablesByZone(zoneId)
    const isTeam$ = this.isTeam()
    return Observable.combineLatest(tables$, isTeam$).map(
      ([tables, isTeam]) => {
        if (zoneId !== 'feature') {
          tables = tables.filter((t) => !t.isFeatured)
        }
        const extraTimeTables = this.filterExtraTimedTable(tables, isTeam)
        return {
          remaining: tables.filter((t) => t.status && t.status !== 'done')
            .length,
          playing: tables.filter((t) => t.status === 'playing').length,
          covered: tables.filter((t) => t.status === 'covered').length,
          extraTimed: extraTimeTables.length,
        }
      }
    )
  }

  updateZone(zoneId: string, update: any) {
    if (zoneId === 'all') return
    return this.db.object(`/zones/${this.key}/${zoneId}`).update(update)
  }

  setNeedHelp(zoneId: string, value: boolean) {
    return this.db.object(`/needHelp/${this.key}/${zoneId}`).set(value)
  }

  getNeedHelp(zoneId: string) {
    return this.db
      .object(`/needHelp/${this.key}/${zoneId}`)
      .valueChanges<boolean>()
  }

  getMessages(zoneId: string): Observable<Message[]> {
    return this.doWithKey(
      (key) =>
        this.db
          .list<Message>(`/messages/${key}/${zoneId}`, (ref) =>
            ref.orderByChild('timestamp')
          )
          .valueChanges<Message>(),
      []
    )
  }

  sendMessage(zoneId: string, message: string) {
    this.db.list<Message>(`/messages/${this.key}/${zoneId}`).push({
      login: this.userService.login || 'Anonymous',
      message,
      timestamp: -new Date().valueOf(),
      uid: this.userService.uid,
    })
  }

  sendMessageToAll(message: string) {
    this.getZones()
      .take(1)
      .subscribe((zones) => {
        zones.forEach((z) => this.sendMessage(z.key, message))
      })
  }

  addOutstandings(tableIds: string[], replaceExisting: boolean) {
    this.getOutstandings()
      .take(1)
      .subscribe((oldTableIds) => {
        const hasToResetGreen = oldTableIds.length === 0
        const newTableIds = (replaceExisting
          ? tableIds
          : oldTableIds.concat(tableIds)
        ).filter((val, key, tab) => tab.indexOf(val) === key && val)
        const newTablesString = newTableIds.join(' ')

        this.db.object(`/outstandings/${this.key}`).set(newTablesString)
      })
  }

  addFeatured(tableIds: string[], replaceExisting: boolean) {
    Promise.all(
      tableIds.map((id) =>
        this.db.object(`/tables/${this.key}/${id}`).update({isFeatured: true})
      )
    ).then((_) => this.notif.notify('Featured tables added'))
  }

  restart() {
    const key = this.key
    this.db.object(`/outstandings/${key}`).set('')
    this.setClock(null)
    this.getTournament()
      .take(1)
      .subscribe((tournament) => {
        if (!tournament) return
        this.getAllTables()
          .take(1)
          .subscribe((tables) => {
            const newTables = tables.reduce(
              (tables, table) => {
                if (table.number === undefined) return tables
                tables[table.number] = {
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
                  isTop: false,
                  zoneId: table.zoneId,
                  number: table.number,
                }

                return tables
              },
              {} as {[number: string]: TableData}
            )
            this.db.object(`/tables/${key}`).set(newTables)
          })
      })
    this.getZones()
      .take(1)
      .subscribe((zones) => {
        zones.forEach((zone) => {
          this.db.object(`/messages/${key}/${zone.key}`).set('')
        })
      })
  }

  getTable(tableId: string): Observable<Table> {
    return this.getObject(
      this.db.object<Table>(`/tables/${this.key}/${tableId}`)
    ).take(1)
  }

  updateTable(tableId: string, update: any) {
    return this.db.object(`/tables/${this.key}/${tableId}`).update(update)
  }

  setTime(time: number, tableId: string, seat?: string) {
    const key = this.key
    let action
    if (seat) {
      action = this.db
        .object(`/tables/${key}/${tableId}/teamTime/${seat}`)
        .set(time)
    } else {
      action = this.db.object(`/tables/${key}/${tableId}`).update({time})
    }
    action.then((_) => {
      this.notif.notify(`Time added to table ${tableId}`)
    })

    return action
  }

  getCoverageTables(resultLast?: boolean): Observable<CoveredTable[]> {
    return this.doWithKey((key) => {
      return this.getList<CoveredTable>(
        this.db.list(`/tables/${key}/`, (ref) =>
          ref.orderByChild('isTop').equalTo(true)
        )
      ).map((tables) =>
        tables.sort((a, b) => {
          if (
            !resultLast ||
            (a.result && b.result) ||
            (!a.result && !b.result)
          ) {
            return Number(a.number) < Number(b.number) ? -1 : 1
          }
          if (a.result && !b.result) {
            return 1
          }
          if (!a.result && b.result) {
            return -1
          }

          return 0
        })
      )
    }, [])
  }

  addCoverageTable(tableNumber: string, coverage: CoverageData) {
    this.updateTable(tableNumber, {coverage, isTop: true})
  }

  addJudge(judge: string) {
    this.getJudges()
      .take(1)
      .subscribe((judges) => {
        this.db.object(`/judges/${this.key}`).set(
          judges
            .concat(judge)
            .filter((val, i, tab) => tab.indexOf(val) === i)
            .join(' ')
        )
      })
  }

  getJudges(): Observable<string[]> {
    return this.doWithKey<string>(
      (key) => this.db.object(`/judges/${this.key}`).valueChanges<string>(),
      []
    ).map((s) => (s ? s.split(' ') : []))
  }

  getZonesByKey(): Observable<{[key: string]: Zone}> {
    return this.doWithKey<{[key: string]: Zone}>(
      (key) =>
        this.db
          .object(`/zones/${this.key}`)
          .valueChanges<{[key: string]: Zone}>(),
      {}
    )
  }

  setClock(clockEnd: number) {
    return this.db.object(`/clock/${this.key}`).set(clockEnd)
  }

  getClock(): Observable<number> {
    return this.doWithKey<number>(
      (key) => this.db.object(`/clock/${this.key}`).valueChanges<number>(),
      null
    )
  }
}
