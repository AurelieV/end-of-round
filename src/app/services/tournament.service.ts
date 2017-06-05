import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Tournament, Zone, Table } from '../model';


const data: Tournament = {
    name: 'GP Las Vegas',
    start: 1,
    end: 600,
    zones: [
        {
            id: 0,
            name: "Zone1",
            start: 1,
            end: 100
        },
        {
            id: 1,
            name: "Zone2",
            start: 101,
            end: 200
        },
        {
            id: 2,
            name: "Zone3",
            start: 201,
            end: 300
        },
        {
            id: 3,
            name: "Zone4",
            start: 301,
            end: 400
        },
        {
            id: 4,
            name: "Zone5",
            start: 401,
            end: 500
        },
        {
            id: 5,
            name: "Zone6",
            start: 501,
            end: 600
        }
    ],
    tables: []
}
for (let i = data.start; i <= data.end; i++ ) {
    data.tables.push({
        id: i,
        time: i % 23 === 0 ? "3min" : null,
        status: null
    });
}

@Injectable()
export class TournamentService {

    getTournament(): Observable<Tournament> {
        return Observable.of(Object.assign(data));
    }

    getZone(id: number): Observable<Zone> {
        return Observable.of(Object.assign(data.zones[id]));
    }

    addTables(tournamentName: string, tables: Table[]): Observable<any> {
        data.tables = data.tables.concat(tables);
        return Observable.of(true);
    }

    getTables(zone: Zone): Observable<Table[]> { 
        return Observable.of(data.tables.filter(table => table.id >= zone.start && table.id <= zone.end));
    }

    setTime(table: Table, time: string): Observable<Table> {
        return Observable.of(Object.assign({}, table, { time }));
    }
}