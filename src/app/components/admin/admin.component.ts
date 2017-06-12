import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/combineLatest';

import { Tournament, Zone, Table } from '../../model';
import { AddTablesDialogComponent } from '../dialogs/add-tables/add-tables.dialog.component';


@Component({
    selector: 'admin',
    styleUrls: [ 'admin.component.scss' ],
    templateUrl: 'admin.component.html'
})
export class AdminComponent implements OnInit {
    zones$: FirebaseListObservable<Zone[]>;
    tables$: Observable<Table[]>;
    tournament$: FirebaseObjectObservable<Tournament>;
    outstandings$: FirebaseObjectObservable<string>;
    waitingTables$: Observable<Table[]>;
    okTables$: Observable<Table[]>;
    
    @ViewChild('confirmEnd') confirmEnd: TemplateRef<any>;
    confirmation: MdDialogRef<any>;

    constructor(private db: AngularFireDatabase, private router: Router, private md: MdDialog) {}

    ngOnInit() {
        this.tournament$ = this.db.object('/vegas');
        this.zones$ = this.db.list('/vegas/zones');
        this.outstandings$ = this.db.object('/vegas/outstandings');
        const tables$ = this.db.list('/vegas/tables');
        this.tables$ = Observable.combineLatest(this.outstandings$, tables$)
            .map(([outstandings, tables]) => {
                if (!(outstandings as any).$value) return tables;
                const ids: string[] = (outstandings as any).$value.split(' ');

                return tables.filter(t => ids.indexOf((t as any).$key) > -1);
            })
        ;
        this.okTables$ = this.tables$.map(tables => tables.filter(t => t.hasResult));
        this.waitingTables$ = this.tables$.map(tables => tables.filter(t => !t.hasResult));
    }

    goToZone(id: number) {
        this.router.navigate(['zone', id]);
    }

    createTables() {
        this.tournament$.take(1).subscribe(tournament => {
            const tables: { [id: string]: Table } = {};
            for (let i = tournament.start; i <= tournament.end; i++ ) {
                tables[i] = {
                    time: 0,
                    status: ""
                };
            }
            this.db.object('/vegas/tables').set(tables);
        })
    }

    endRound() {
        this.confirmation = this.md.open(this.confirmEnd);
    }

    addOutstandings() {
        const dialogRef = this.md.open(AddTablesDialogComponent);
        dialogRef.componentInstance.title = 'Add outstandings tables';
        Observable.combineLatest(dialogRef.afterClosed(), this.outstandings$.take(1)).subscribe(([val, outstandings]) => {
            if (!val) return;
            const previousVal = (outstandings as any).$value;
            const tableIds: string[] = (val || '').split(' ');
            const previousIds: string[] = (previousVal || '').split(' ');
            const newVal = previousIds
                .concat(tableIds)
                .filter((val, key, tab) => tab.indexOf(val) === key && val)
                .join(' ')
            ;
            this.db.object('/vegas/outstandings').set(newVal);
        });
    }

    addFeatured() {
        const dialogRef = this.md.open(AddTablesDialogComponent);
        dialogRef.componentInstance.title = 'Add featured tables'
        dialogRef.afterClosed().subscribe(val => {
            if (!val) return;
            const tableIds: string[] = (val || '').split(' ');
            debugger;
            tableIds.forEach(id => this.db.object('/vegas/tables/' + id).update({ status: 'featured'}));
        });
    }

    cancelRestart() {
        this.confirmation.close();
    }

    restart() {
        this.createTables();
        this.db.object('/vegas/outstandings').set('');
        this.confirmation.close();
    }
}