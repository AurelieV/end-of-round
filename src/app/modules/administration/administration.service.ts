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
        ).map(([ tournament, zones ]) => ({ tournament, zones }))
    }

    private createTables(key: string, start: number, end: number) {
        const tables: { [id: string]: any } = {};
            for (let i = start; i <= end; i++ ) {
                tables[i] = {
                    time: 0,
                    status: "",
                    doneTime: null,
                    hasResult: false,
                    result: null
                };
            }
            this.db.object(`tables/${key}`).set(tables);
    }

    createTournament(data: TournamentData, zones: ZoneData[]) {
        return this.db.list<TournamentData>('tournaments').push(data).then(tournament => {
            this.createTables(tournament.key, data.start, data.end);
            zones.forEach(zone => {
                this.db.list(`zones/${tournament.key}`).push(zone);
            });
            return tournament.key;
        });
    }

    deleteTournament(key: string) {
        this.db.list('tables').remove(key);
        this.db.list('tournaments').remove(key);
        this.db.list('zones').remove(key);
    }

    editTournament(key: string, data: TournamentData, zones: ZoneData[]) {
        this.db.object(`tournaments/${key}`)
            .valueChanges<TournamentData>()
            .take(1)
            .subscribe(tournament => {
                this.db.object(`tournaments/${key}`).update(data);
                if (tournament.start !== data.start || tournament.end !== data.end ) {
                    this.createTables(key, data.start, data.end);
                }
                this.db.list(`zones`).remove(key);
                zones.forEach(zone => {
                    this.db.list(`zones/${key}`).push(zone);
                });
        })
    }
}