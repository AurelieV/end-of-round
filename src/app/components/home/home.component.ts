import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { Tournament, Zone } from '../../model';
import { TimeDialogComponent } from '../dialogs/time/time.dialog.component';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
    tournament$: Observable<Tournament>;

    constructor(private db: AngularFireDatabase, private dialog: MdDialog) {}

    ngOnInit() {
        this.tournament$ = this.db.object('/vegas');
    }

    addTime() {
        const dialogRef = this.dialog.open(TimeDialogComponent);
        dialogRef.afterClosed().subscribe(data => {
            if (!data) return;
            this.db.object('/vegas/tables/' + data.tableNumber).update({ time: data.time});
        });
    }
}