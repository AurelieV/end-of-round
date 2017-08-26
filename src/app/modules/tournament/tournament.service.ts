import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/combineLatest';

export interface Tournament {
    information: string;
    start: number;
    end: number;
    name: string;
};

export interface TournamentZone {
    $key: string;
    start: number;
    end: number;
    leader: string;
    needHelp?: boolean;
    name: string;
    zoneLeaderPlace: string;
};

export interface Table {
    status: TableStatus;
    time: number;
    doneTime?: Date;
    hasResult?: boolean;
    result?: Result;
    $key: string;
    assignated?: string;
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

    getTournament(): Observable<Tournament | null> {
        return this.key.switchMap(key => {
            if (!key) return Observable.of(null);
            return this.db.object(`/tournaments/${key}`);
        });
    }

    getTournamentInformation(): Observable<string> {
        return this.getTournament().map(tournament => {
            if (!tournament) return '';
            return tournament.information;
        });
    }

    setTime(time: number, tableNumber: number) {
        return this.db.object(`tables/${this.key.getValue()}/${tableNumber}`).update({time})
    }

    getZones(): Observable<TournamentZone[]> {
        return this.key.switchMap(key => {
            if (!key) return Observable.of([]);
            return this.db.list(`/zones/${key}`);
        });
    }

    getZone(zoneId: string): Observable<TournamentZone> {
        return this.key.switchMap(key => {
            if (!key) return Observable.of({});
            return this.db.object(`/zones/${key}/${zoneId}`);
        });
    }

    getAllTables(): Observable<Table[]> {
        return this.key.switchMap(key => {
            if (!key) return Observable.of([]);
            return this.db.list(`/tables/${key}`);
        });
    }

    getOutstandingsTables(): Observable<Table[]> {
        return Observable.combineLatest(this.getOutstandings(), this.getAllTables())
            .map(([outstandings, tables]) => {
                if (outstandings.length === 0) return tables;

                return tables.filter(t => outstandings.indexOf(t.$key) > -1);
            })
    }

    getActiveTables(): Observable<Table[]> {
        return this.getOutstandingsTables().map(tables => tables.filter(t => !t.hasResult));
    }

    getOkTables(): Observable<Table[]> {
        return this.getOutstandingsTables().map(tables => tables.filter(t => t.hasResult));
    }

    getAllTablesByZone(zone: TournamentZone): Observable<Table[]> {
        return this.key.switchMap(key => {
            if (!key) return Observable.of({});
            return this.db.list(`/tables/${key}/`, {
                query: {
                    orderByKey: true,
                    startAt: zone.start + "",
                    endAt: zone.end + ""
                }
            });
        });
    }

    getActiveTablesByZone(zone: TournamentZone): Observable<Table[]> {
        return Observable.combineLatest(this.getOutstandings(), this.getAllTablesByZone(zone))
            .map(([outstandings, tables]) => {
                if (outstandings.length === 0) return tables;

                return tables.filter(t => outstandings.indexOf(t.$key) > -1 && !t.hasResult);
            })
    }

    getActiveTablesInformationByZone(zone: TournamentZone): Observable<TablesInformation> {
        const tables$ = zone ? this.getActiveTablesByZone(zone) : this.getActiveTables();
        return tables$.map(tables => {
            const extraTimeTables = (tables || []).filter(t => t.time > 0 && t.status !== "done");
            return {
                remaining: tables.filter(t => t.status !== "done").length,
                playing: tables.filter(t => t.status === "playing").length,
                covered: tables.filter(t => t.status === "covered").length,
                extraTimed: extraTimeTables.length
            };
        })
    }

    getMessages(zoneId: string): Observable<string> {
        return this.key.switchMap(key => {
            if (!key) return Observable.of('');
            return this.db.object(`/messages/${key}/${zoneId}`)
                .map(m => m.$value)
            ;
        });
    }

    sendMessage(zoneId: string, message: string) {
        const messages = this.db.object(`/messages/${this.key.getValue()}/${zoneId}`);
        messages.take(1).subscribe(old => {
            messages.set(`${message}\n${old.$value || ''}`);
        });
    }

    getOutstandings(): Observable<string[]> {
        return this.key.switchMap(key => {
            if (!key) return Observable.of([]);
            return this.db.object(`/outstandings/${key}`)
                .map(val => val.$value ? val.$value.split(' ') : [])
            ;
        });
    }

    isOnOutstandingsStep(): Observable<boolean> {
        return this.getOutstandings().map(out => out.length > 0);
    }

    addOutstandings(tablesString: string) {
        if (!tablesString) return;
        const tableIds: string[] = tablesString.match(/(\d+)/g) || [];
        this.getOutstandings().take(1).subscribe(oldTableIds => {
            const hasToResetGreen = oldTableIds.length === 0;
            const newTableIds = oldTableIds
                .concat(tableIds)
                .filter((val, key, tab) => tab.indexOf(val) === key && val)
            ;
            const newTablesString = newTableIds.join(' ');
            
            this.db.object(`/outstandings/${this.key.getValue()}`).set(newTablesString);
        });
    }

    addFeatured(tablesString: string) {
        if (!tablesString) return;
        const tableIds: string[] = tablesString.match(/(\d+)/g) || [];
        tableIds.forEach(id => this.db.object(`/tables/${this.key.getValue()}/${id}`).update({ status: 'featured'}));
    }

    restart() {
        this.db.object(`/outstandings/${this.key.getValue()}`).set('');
        this.getTournament().take(1).subscribe(tournament => {
            if (!tournament) return;
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
                this.db.object(`/messages/${this.key.getValue()}/${zone.$key}`).set("");
            })
        })

    }

    getTable(tableId: string): Observable<Table | null> {
        return this.db.object(`/tables/${this.key.getValue()}/${tableId}`).take(1);
    }

    updateTable(tableId: string, update: any) {
        this.db.object(`/tables/${this.key.getValue()}/${tableId}`).update(update);
    }

    updateZone(zoneId: string, update: any) {
        this.db.object(`/zones/${this.key.getValue()}/${zoneId}`).update(update);
    }
}