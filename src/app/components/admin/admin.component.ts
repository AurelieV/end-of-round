import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
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

    private subscriptions: Subscription[] = [];

    constructor(private db: AngularFireDatabase, private router: Router) {}

    ngOnInit() {
        const tournament$: FirebaseObjectObservable<Tournament> = this.db.object('/vegas');
        this.zones$ = this.db.list('/vegas/zones');
        
        this.subscriptions.push(tournament$.subscribe(tournament => this.tournament = tournament));
    }

    goToZone(id: number) {
        this.router.navigate(['zone', id]);
    }

    createTables() {
        const tables: { [id: string]: Table } = {};
        for (let i = this.tournament.start; i <= this.tournament.end; i++ ) {
            tables[i] = {
                time: "",
                status: ""
            };
        }
        this.db.object('/vegas/tables').set(tables);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}