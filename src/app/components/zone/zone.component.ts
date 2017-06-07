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
        this.tables$ = this.zone$.switchMap(zone => {
            return this.db.list('/vegas/tables', {
                query: {
                    orderByKey: true,
                    startAt: zone.start + "",
                    endAt: zone.end + ""
                }
            });
        });
    }

    onTableClick(table: Table) {
        let newStatus: TableStatus = "";
        if (table.status === "featured") return;
        switch (table.status) {
            case "":
                newStatus = "playing";
                break;
            case "playing":
                newStatus = "covered";
                break;
            case "covered":
                newStatus = "done";
                break;
            case "done":
                newStatus = "";
                break;
        }
        this.db.object('/vegas/tables/' + (table as any).$key).update( { status: newStatus });
    }

    callHelp(needHelp: boolean) {
        this.db.object('/vegas/zones/' + this.zoneId).update( { needHelp });
    }
}