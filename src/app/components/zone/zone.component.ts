import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Zone, Table, TableStatus } from '../../model';
import { AddResultDialogComponent } from '../dialogs/add-result/add-result.dialog.component';

interface Filter {
    onlyPlaying: boolean;
    onlyExtraTime: boolean;
}

@Component({
    selector: "zone",
    styleUrls: [ 'zone.component.scss' ],
    templateUrl: 'zone.component.html' 
})
export class ZoneComponent implements OnInit {
    zone$: Observable<Zone>;
    tables$: Observable<Table[]>;
    outstandings$: Observable<string>;
    filter$: BehaviorSubject<Filter> = new BehaviorSubject({
        onlyPlaying: false,
        onlyExtraTime: false
    });
    zoneId: number;

    constructor(private route: ActivatedRoute, private db: AngularFireDatabase, private md: MdDialog) {}

    ngOnInit() {
        this.zone$ = this.route.params
            .map(params => params.id)
            .switchMap(id => {
                this.zoneId = id;
                return this.db.object('/vegas/zones/' + id)
            })
        ;
        const tables$: Observable<Table[]> = this.zone$.switchMap(zone => {
            return this.db.list('/vegas/tables', {
                query: {
                    orderByKey: true,
                    startAt: zone.start + "",
                    endAt: zone.end + ""
                }
            });
        });
        this.outstandings$ = this.db.object('/vegas/outstandings');
        this.tables$ = Observable.combineLatest(this.outstandings$, tables$, this.filter$)
            .map(([outstandings, tables, filter]) => {
                if (!(outstandings as any).$value) {
                    return tables.filter(t => {
                        if (filter.onlyExtraTime && !t.time) return false;
                        if (filter.onlyPlaying && t.status !== 'playing' && t.status !== 'covered') return false;

                        return true;
                    });
                }
                const ids: string[] = (outstandings as any).$value.split(' ');
                return tables.filter(t => ids.indexOf((t as any).$key) > -1 && !t.hasResult);
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
                update = { status: "playing", doneTime: null };
                break;
        }
        this.db.object('/vegas/tables/' + (table as any).$key).update(update);
    }

    callHelp(needHelp: boolean) {
        this.db.object('/vegas/zones/' + this.zoneId).update( { needHelp });
    }

    toggleOnlyPlaying(val: boolean) {
        this.filter$.take(1).subscribe(f => this.filter$.next(Object.assign({}, f, { onlyPlaying: val })));
    }

    toggleOnlyExtraTime(val: boolean) {
        this.filter$.take(1).subscribe(f => this.filter$.next(Object.assign({}, f, { onlyExtraTime: val })));
    }

    addResult(e: Event, table: any) {
        e.stopPropagation();
        const dialogRef = this.md.open(AddResultDialogComponent, { width: "90%" });
        if (table.result) {
            dialogRef.componentInstance.result = table.result;
        }
        dialogRef.afterClosed().subscribe(result => {
            if (!result) return;
            this.db.object('/vegas/tables/' + table.$key).update({ 
                result,
                status: 'done',
                doneTime: table.doneTime  || new Date()
            })
        })
    }
}