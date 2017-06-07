import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import { MdDialogRef, MdDialog } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { Tournament, Zone, Table } from '../../model';

@Component({
    selector: 'admin',
    styleUrls: [ 'admin.component.scss' ],
    templateUrl: 'admin.component.html'
})
export class AdminComponent implements OnInit, OnDestroy {
    tournament: Tournament;
    zones$: FirebaseListObservable<Zone[]>;
    tables$: FirebaseListObservable<Table[]>;
    tables: Table[];
    outstandings: string[];
    outstandingTables: Table[];
    @ViewChild('confirmEnd') confirmEnd: TemplateRef<any>;
    @ViewChild('outStandingModal') outstandingModal: TemplateRef<any>;
    confirmation: MdDialogRef<any>;
    outstandingModalRef: MdDialogRef<any>;

    private subscriptions: Subscription[] = [];

    constructor(private db: AngularFireDatabase, private router: Router, private md: MdDialog) {}

    ngOnInit() {
        const tournament$: FirebaseObjectObservable<Tournament> = this.db.object('/vegas');
        this.zones$ = this.db.list('/vegas/zones');
        this.tables$ = this.db.list('/vegas/tables');
        
        this.subscriptions.push(tournament$.subscribe(tournament => this.tournament = tournament));
        this.subscriptions.push(this.tables$.subscribe(tables => {
            this.tables = tables;
            this.updateOustandingTables();
        }));
        this.subscriptions.push(
            this.db.object('/vegas/outstandings').subscribe(data => {
                if (!data.$value) {
                    this.outstandings = [];
                    return;
                }
                this.outstandings = data.$value.split(' ');
                this.updateOustandingTables();
            })
        );
    }

    goToZone(id: number) {
        this.router.navigate(['zone', id]);
    }

    updateOustandingTables() {
        this.outstandingTables = (this.tables || []).filter(table => {
            return (this.outstandings || []).indexOf((table as any).$key) > -1
        });
    }

    createTables() {
        const tables: { [id: string]: Table } = {};
        for (let i = this.tournament.start; i <= this.tournament.end; i++ ) {
            tables[i] = {
                time: 0,
                status: ""
            };
        }
        this.db.object('/vegas/tables').set(tables);
    }

    endRound() {
        this.confirmation = this.md.open(this.confirmEnd);
    }

    openOutStandingModal() {
        this.outstandingModalRef = this.md.open(this.outstandingModal);
    }

    addOutStanding(val: string) {
        const tableIds = (val || '').split(' ');
        this.db.object('/vegas/outstandings').set(
            this.outstandings.concat(tableIds).filter((val, key, tab) => tab.indexOf(val) === key).join(' ')
        );
        this.outstandingModalRef.close();
    }

    cancelRestart() {
        this.confirmation.close();
    }

    restart() {
        this.createTables();
        this.db.object('/vegas/outstandings').set("");
        this.confirmation.close();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}