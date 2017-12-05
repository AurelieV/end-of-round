import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/combineLatest';

import { Zone, ZoneData, Tournament, TournamentData } from '../../model';
export { Zone, ZoneData, Tournament, TournamentData }

@Injectable()
export class AdministrationService {
    constructor(private db: AngularFireDatabase) {}

    getTournaments(): Observable<Tournament[]> {
        return this.db.list<TournamentData>('/tournaments')
            .snapshotChanges()
            .map(actions => actions.map(({ payload }) => ({ key: payload.key, ...payload.val() })))
    }

    getTournament(key: string): Observable<{ tournament: TournamentData, zones: ZoneData[] }> {
        return Observable.combineLatest(
            this.db.object('/tournaments/' + key).valueChanges<TournamentData>(),
            this.db.list('/zones/' + key).valueChanges<ZoneData>()
        ).map(([ tournament, zones ]) => ({ tournament, zones: zones.filter(z => z.name !== 'Feature') }))
    }

    private createZonesAndTables(key: string, start: number, end: number, zones: ZoneData[]) {
        this.db.list(`zones`).remove(key)
            .then(_ => {
                return Promise.all(zones.map(z => 
                    this.db.list(`zones/${key}`)
                        .push(z)
                        .then(data => {
                            return Object.assign({ key: data.key }, z)
                        })
                ))
            })
            .then(zones => {
                const tables: { [id: string]: any } = {};
                for (let i = start; i <= end; i++ ) {
                    tables[i] = {
                        time: 0,
                        status: "",
                        doneTime: null,
                        hasResult: false,
                        result: null,
                        isFeatured: false
                    };
                }
                zones.forEach(z => {
                    (z.tables || []).forEach(section => {
                        for (let i = section.start; i <= section.end; i++) {
                            tables[i].zoneId = z.key;
                        }
                    })
                })
                this.db.object(`tables/${key}`).set(tables)
                this.db.object(`zones/${key}/feature`).set({
                    name: 'Feature',
                    needHelp: false
                })
            });
    }

    createTournament(data: TournamentData, zones: ZoneData[]) {
        return this.db.list<TournamentData>('tournaments').push(data).then(tournament => {
            this.createZonesAndTables(tournament.key, data.start, data.end, zones);
            return tournament.key;
        });
    }

    deleteTournament(key: string) {
        this.db.list('tournaments').remove(key);
    }

    editTournament(key: string, data: TournamentData, zones: ZoneData[]) {
        this.db.object(`tournaments/${key}`)
            .valueChanges<TournamentData>()
            .take(1)
            .subscribe(tournament => {
                this.db.object(`tournaments/${key}`).update(data);
        })
        this.createZonesAndTables(key, data.start, data.end, zones);
    }
}