import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Subscription } from 'rxjs/Subscription';

import { Tournament, Zone } from '../../model';
import { TimeComponent } from '../time/time.component';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit, OnDestroy {
    tournament$: FirebaseObjectObservable<Tournament>;
    start: number;
    end: number;

    private subscriptions: Subscription[] = [];

    constructor(private db: AngularFireDatabase, private dialog: MdDialog) {}

    ngOnInit() {
        this.tournament$ = this.db.object('/vegas');
        this.subscriptions.push(this.tournament$.subscribe(tournament => {
            this.start = tournament.start;
            this.end = tournament.end;
        }));
    }

    addTime() {
        const dialogRef = this.dialog.open(TimeComponent);
        dialogRef.componentInstance.start = this.start;
        dialogRef.componentInstance.end = this.end;
        dialogRef.afterClosed().subscribe(data => {
            if (!data) return;
            this.db.object('/vegas/tables/' + data.tableNumber).update({ time: data.time});
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}