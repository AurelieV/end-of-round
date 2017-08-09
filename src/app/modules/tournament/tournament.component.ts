import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog } from '@angular/material';

import { TimeDialogComponent } from './time.dialog.component';
import { TournamentService, Tournament } from './tournament.service';


@Component({
    templateUrl: './tournament.component.html',
    selector: 'tournament'
})
export class TournamentComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    tournament$: Observable<Tournament>;

    constructor(
        private route: ActivatedRoute,
        private tournamentService: TournamentService,
        private dialog: MdDialog
    ) {}

    ngOnInit() {
        this.tournament$ = this.tournamentService.getTournament();
        this.subscriptions.push(
            this.route.paramMap.subscribe(params => {
                const key = params.get('key');
                if (key) {
                    this.tournamentService.setKey(key)
                }
            })
        );
    }

    addTime() {
        const dialogRef = this.dialog.open(TimeDialogComponent);
        dialogRef.afterClosed().subscribe(data => {
            if (!data) return;
            this.tournamentService.setTime(data.time, data.tableNumber);
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}