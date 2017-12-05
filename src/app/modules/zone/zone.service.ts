import { Subscription } from 'rxjs/Subscription';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable, OnDestroy, NgZone } from '@angular/core';

import { TournamentService, Table } from './../tournament/tournament.service';
import { DatabaseAccessor } from './../../utils/database-accessor';
import { Observable } from 'rxjs/Observable';
import { Zone, ZoneData } from '../../model';

@Injectable()
export class ZoneService extends DatabaseAccessor implements OnDestroy {
    private sub: Subscription;
    constructor(private tournamentService: TournamentService, db: AngularFireDatabase, zone: NgZone) {
        super(db, zone);
        this.sub = this.tournamentService.key$.subscribe(key => this.key = this.key);
    }

    getZone(): Observable<Zone> {
        return this.doWithKey<Zone>(
            key => {
                if (key === 'all') {
                    return Observable.of({
                        key: 'all',
                        name: 'All'
                    })
                } else {
                    return this.getObjectFrom<ZoneData>(`/zones/${this.tournamentService.key}/${key}`)
                }
            }
        )
    }

    getTables(): Observable<Table[]> {
        return this.doWithKey<Table[]>(
            key => {
                return this.tournamentService.getActiveTablesByZone(key)
            },
            []
        )
    }

    getOtherZones(): Observable<Zone[]> {
        return this.doWithKey<Zone[]>(
            key => {
                return this.tournamentService.getAllZones().map(zones => zones.filter(z => z.key !== key));
            },
            []
        )
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}