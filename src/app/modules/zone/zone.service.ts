import {Subscription} from 'rxjs/Subscription'
import {AngularFireDatabase} from 'angularfire2/database'
import {Injectable, OnDestroy} from '@angular/core'

import {TournamentService, Table} from './../tournament/tournament.service'
import {DatabaseAccessor} from './../../utils/database-accessor'
import {Observable} from 'rxjs/Observable'
import {Zone, ZoneData} from '../../model'

@Injectable()
export class ZoneService extends DatabaseAccessor implements OnDestroy {
  private sub: Subscription
  constructor(
    private tournamentService: TournamentService,
    db: AngularFireDatabase
  ) {
    super(db)
    this.sub = this.tournamentService.key$.subscribe(
      (key) => (this.key = this.key)
    )
  }

  getZone(): Observable<Zone> {
    return this.doWithKey<Zone>((key) => {
      if (key === 'all') {
        return Observable.of({
          key: 'all',
          name: 'All',
        })
      } else {
        return this.getObjectFrom<ZoneData>(
          `/zones/${this.tournamentService.key}/${key}`
        )
      }
    })
  }

  getTables(): Observable<Table[]> {
    return this.doWithKey<Table[]>((key) => {
      return this.tournamentService.getDisplayTablesByZone(key)
    }, [])
  }

  getOtherZones(): Observable<Zone[]> {
    return this.doWithKey<Zone[]>((key) => {
      return this.tournamentService
        .getAllZones()
        .map((zones) => zones.filter((z) => z.key !== key))
    }, [])
  }

  getOtherNeedHelp(): Observable<{[key: string]: boolean}> {
    return this.doWithKey<{[key: string]: boolean}>((key) => {
      return this.db
        .list(`/needHelp/${this.tournamentService.key}/${key}`)
        .snapshotChanges()
        .map((actions) => {
          const result = {}
          actions.forEach(({payload}) => (result[payload.key] = payload.val()))

          return result
        })
    }, {})
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
