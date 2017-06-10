import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { Zone, Table, TableStatus } from '../../model';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';


@Component({
    selector: "zone",
    styleUrls: [ 'zone.component.scss' ],
    templateUrl: 'zone.component.html' 
})
export class ZoneComponent implements OnInit {
    zone$: Observable<Zone>;
    tables$: Observable<Table[]>;
    zoneId: number;

    constructor(private route: ActivatedRoute, private db: AngularFireDatabase) {}

    ngOnInit() {
        this.zone$ = this.route.params
            .map(params => params.id)
            .switchMap(id => {
                this.zoneId = id;
                return this.db.object('/vegas/zones/' + id)
            })
        ;
        const tables$ = this.zone$.switchMap(zone => {
            return this.db.list('/vegas/tables', {
                query: {
                    orderByKey: true,
                    startAt: zone.start + "",
                    endAt: zone.end + ""
                }
            });
        });
        const outstandings$ = this.db.object('/vegas/outstandings');
        this.tables$ = Observable.combineLatest(outstandings$, tables$)
            .map(([outstandings, tables]) => {
                if (!(outstandings as any).$value) return tables;
                const ids: string[] = (outstandings as any).$value.split(' ');

                return tables.filter(t => ids.indexOf((t as any).$key) > -1);
            })
        ;
    }

    onTableClick(table: Table) {
        let update = {};
        if (table.status === "featured") return;
        switch (table.status) {
            case "":
                update = { status: "playing" };
                break;
            case "playing":
                update = { status: "covered" };
                break;
            case "covered":
                update = { status: "done", doneTime: new Date() };
                break;
            case "done":
                update = { status: "" };
                break;
        }
        this.db.object('/vegas/tables/' + (table as any).$key).update(update);
    }

    callHelp(needHelp: boolean) {
        this.db.object('/vegas/zones/' + this.zoneId).update( { needHelp });
    }
}