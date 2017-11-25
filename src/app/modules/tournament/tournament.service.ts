import { CoveredTable } from './tournament.service';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject, AngularFireList } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/combineLatest';

import { TournamentData, Tournament, Zone, ZoneData, Message } from '../../model';
export { Tournament, TournamentData, Zone, ZoneData, Message };

export interface Table {
    number: string;
    status: TableStatus;
    time: number;
    doneTime?: Date;
    hasResult?: boolean;
    result?: Result;
    assignated?: string;
    information?: string;
    isCovered?: boolean;
}

export interface CoveredTable extends Table {
    coverage: {
        player1: string;
        player2: string;
        player1Score: number;
        player2Score: number;
    }
}

export interface CoveredDataTable {
    coverage: {
        player1: string;
        player2: string;
        player1Score: number,
        player2Score: number
    },
    number: string
}

export interface Result {
    player1: {
        score: number;
        drop: boolean;
    },
    player2: {
        score: number;
        drop: boolean;
    },
    draw: number;
}

export type TableStatus = "playing" | "covered" | "featured" | "done" | "";

export interface TablesInformation {
    playing: number;
    covered: number;
    extraTimed: number;
    remaining: number;
}

@Injectable()
export class TournamentService {
    private key: BehaviorSubject<string>;
    
    constructor(private db: AngularFireDatabase) {
        this.key = new BehaviorSubject<string>('');
    }

    setKey(key: string) {
        this.key.next(key);
    }

    getKey() {
        return this.key.getValue();
    }

    private getObject<T>(ref: AngularFireObject<T>, key: string = "key"): Observable<T & { key: string }> {
        return ref.snapshotChanges()
            .map(({ payload }) => ({ [key]: payload.key, ...payload.val() }));
    }

    private getList<T>(ref: AngularFireList<T>, key: string = "key"): Observable<Array<T & { key: string }>> {
        return ref.snapshotChanges()
            .map(actions => 
                actions.map(({ payload }) => ({ [key]: payload.key, ...payload.val() }))
            );
    }

    getTournament(): Observable<Tournament> {
        return this.key.switchMap(key => {
            if (!key) return Observable.of(null)
            return this.getObject(this.db.object<TournamentData>(`/tournaments/${key}`))
        });
    }

    setTime(time: number, tableNumber: number) {
        return this.db.object(`tables/${this.key.getValue()}/${tableNumber}`).update({ time })
    }

    getZones(): Observable<Zone[]> {
        return this.key.switchMap(key =>
            key ? this.getList(this.db.list(`/zones/${key}`)) : Observable.of([])
        );
    }

    getZone(zoneId: string): Observable<Zone> {
        return this.key.switchMap(key => {
            if (!key) {
                return Observable.of(null)
            } else if (zoneId) {
                return this.getObject(this.db.object(`/zones/${key}/${zoneId}`))
            } else {
                return this.getTournament().map(tournament => {
                    return {
                        key: "",
                        name: "All",
                        start: tournament.start,
                        end: tournament.end,
                        leader: "",
                        needHelp: false
                    }
                })
            }
        }
        );
    }

    getAllTables(): Observable<Table[]> {
        return this.key.switchMap(key =>
            key ? this.getList(this.db.list(`/tables/${key}`), "number") : Observable.of([])
        );
    }

    getOutstandingsTables(): Observable<Table[]> {
        return Observable.combineLatest(this.getOutstandings(), this.getAllTables())
            .map(([outstandings, tables]) => {
                if (outstandings.length === 0) return tables;

                return tables.filter(t => outstandings.includes(t.number));
            })
    }

    getActiveTables(): Observable<Table[]> {
        return this.getOutstandingsTables().map(tables => tables.filter(t => !t.hasResult));
    }

    getOkTables(): Observable<Table[]> {
        return this.getOutstandingsTables().map(tables => tables.filter(t => t.hasResult));
    }

    getAllTablesByZone(zone: Zone): Observable<Table[]> {
        if (!zone) return this.getAllTables();
        return this.key.switchMap(key =>
            key ?
            this.getList(this.db.list(
                `/tables/${key}/`,
                ref => ref.orderByKey().startAt(zone.start + "").endAt(zone.end + "")
            ), "number") : Observable.of([])
        );
    }

    getActiveTablesByZone(zone: Zone): Observable<Table[]> {
        return Observable.combineLatest(this.getOutstandings(), this.getAllTablesByZone(zone))
            .map(([outstandings, tables]) => {
                if (outstandings.length === 0) return tables;

                return tables.filter(t => outstandings.indexOf(t.number) > -1 && !t.hasResult);
            })
    }

    getActiveTablesInformationByZone(zone: Zone | null): Observable<TablesInformation> {
        const tables$ = zone ? this.getActiveTablesByZone(zone) : this.getActiveTables();
        return tables$.map(tables => {
            const extraTimeTables = (tables || []).filter(t => t.time > 0 && t.status !== "done");
            return {
                remaining: tables.filter(t => t.status && t.status !== "done" && t.status !== 'featured').length,
                playing: tables.filter(t => t.status === "playing").length,
                covered: tables.filter(t => t.status === "covered").length,
                extraTimed: extraTimeTables.length
            };
        })
    }

    getMessages(zoneId: string): Observable<Message[]> {
        return this.key.switchMap(key => {
            if (!key) {
                return Observable.of([]);
            } else {
                if (!zoneId) {
                    return this.db.list<Message>(`/messages/${key}/for_all`, ref => ref.orderByChild('timestamp'))
                        .valueChanges()
                        .map(t => t.reverse())
                } else {
                    const zoneMessages = this.db.list<Message>(
                        `/messages/${key}/${zoneId}`,
                        ref => ref.orderByChild('timestamp')
                    ).valueChanges().map(t => t.reverse());
                    const allMessages = this.db.list<Message>(
                        `/messages/${key}/for_all`,
                        ref => ref.orderByChild('timestamp')
                    ).valueChanges().map(t => t.reverse());

                    return Observable.combineLatest(zoneMessages, allMessages)
                        .map(([zoneMessages, allMessages]) => {
                            return zoneMessages.concat(allMessages).sort((m: Message) => - m.timestamp)
                        })
                    ;
                }
                
            }
        });
    }

    sendMessage(zoneId: string, message: string) {
        this.db.list<Message>(`/messages/${this.key.getValue()}/${zoneId || 'for_all'}`).push({
            login: 'Anonymous',
            message,
            timestamp: (new Date()).valueOf()
        })
    }

    getOutstandings(): Observable<string[]> {
        return this.key.switchMap(key =>
            key ?
            this.db.object(`/outstandings/${key}`).valueChanges<string>()
                .map(val => val ? val.split(' ') : []) : Observable.of([])
        );
    }

    isOnOutstandingsStep(): Observable<boolean> {
        return this.getOutstandings().map(out => out.length > 0);
    }

    addOutstandings(tableIds: string[], replaceExisting: boolean) {
        this.getOutstandings().take(1).subscribe(oldTableIds => {
            const hasToResetGreen = oldTableIds.length === 0;
            const newTableIds = (replaceExisting ? tableIds : oldTableIds.concat(tableIds))
                .filter((val, key, tab) => tab.indexOf(val) === key && val)
            ;
            const newTablesString = newTableIds.join(' ');
            
            this.db.object(`/outstandings/${this.key.getValue()}`).set(newTablesString);
        });
    }

    addFeatured(tableIds: string[], replaceExisting: boolean) {
        tableIds.forEach(id => this.db.object(`/tables/${this.key.getValue()}/${id}`).update({ status: 'featured'}));
    }

    restart() {
        this.db.object(`/outstandings/${this.key.getValue()}`).set('');
        this.getTournament().take(1).subscribe(tournament => {
            if (!tournament) return;
            this.getAllTables().take(1).subscribe(tables => {
                const val = {};
                tables.forEach(t => val[t.number] = t);
                this.db.object(`tables-archives/${this.key.getValue()}`).set(val);
            })
            this.db.object(`/outstandings/${this.key.getValue()}`).valueChanges().take(1).subscribe(out => {
                this.db.object(`outstandings-archives/${this.key.getValue()}`).set(out);
            })
            const tables: { [id: string]: any } = {};
            for (let i = tournament.start; i <= tournament.end; i++ ) {
                tables[i] = {
                    time: 0,
                    status: "",
                    doneTime: null,
                    hasResult: false,
                    result: null
                };
            }
            this.db.object(`tables/${this.key.getValue()}`).update(tables);
        });
        this.getZones().take(1).subscribe(zones => {
            zones.forEach(zone => {
                this.db.object(`/messages/${this.key.getValue()}/${zone.key}`).set("");
            })
            this.db.object(`/messages/${this.key.getValue()}/for_all`).set("");
        })
    }

    getTable(tableId: string): Observable<Table> {
        return this.getObject(this.db.object<Table>(`/tables/${this.key.getValue()}/${tableId}`), "number").take(1);
    }

    updateTable(tableId: string, update: any) {
        this.db.object(`/tables/${this.key.getValue()}/${tableId}`).update(update);
    }

    updateZone(zoneId: string, update: any) {
        this.db.object(`/zones/${this.key.getValue()}/${zoneId}`).update(update);
    }


    getCoverageTables(): Observable<CoveredTable[]> {
        return this.key.switchMap(key => {
            const tables$ = this.getList<Table>(
                this.db.list(
                    `/tables/${key}/`,
                    ref => ref.orderByChild('isCovered').equalTo(true)
                ), 
                "number"
            ).map(tables => tables.sort((a, b) => Number(a.number) < Number(b.number) ? -1 : 1))

            return key ? tables$ : Observable.of([])
        });
    }

    addCoverageTable(data: CoveredDataTable) {
        this.updateTable(data.number, { coverage: data.coverage, isCovered: true })
    }

    hasArchives(): Observable<boolean> {
        return this.key.switchMap(key =>
            key ?
                this.db.object(`/tables-archives/${key}`).valueChanges().map(val => !!val)
                : Observable.of(false)    
        )
    }

    restoreArchives() {

    }
}