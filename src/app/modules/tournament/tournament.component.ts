import { ConnectionService } from './../../connection.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdDialog } from '@angular/material';
import { handleReturn } from '../shared/handle-return';

import { TimeDialogComponent } from './time.dialog.component';
import { TournamentService, Tournament } from './tournament.service';


@Component({
    templateUrl: './tournament.component.html',
    selector: 'tournament'
})
export class TournamentComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    tournament$: Observable<Tournament>;
    key: string;
    isOnDashboard: boolean;

    constructor(
        private route: ActivatedRoute,
        private tournamentService: TournamentService,
        private dialog: MdDialog,
        private router: Router,
        public connectionService: ConnectionService
    ) {}

    ngOnInit() {
        this.tournament$ = this.tournamentService.getTournament();
        this.subscriptions.push(
            this.route.paramMap.subscribe(params => {
                const key = params.get('key');
                if (key) {
                    this.tournamentService.setKey(key);
                    this.key = key;
                }
            })
        );
        this.subscriptions.push(
            this.router.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    const segments = this.router.parseUrl(event.url).root.children[PRIMARY_OUTLET].segments.map(s => s.path);
                    this.isOnDashboard = segments.indexOf('dashboard') > -1;
                }
        }));
    }

    addTime() {
        const dialogRef = this.dialog.open(TimeDialogComponent);
        handleReturn(dialogRef);
    }

    edit() {
        this.router.navigate([ 'administration', 'edit', this.key ]);
    }

    goToDashboard() {
        this.router.navigate([ 'tournament', this.key, 'dashboard' ]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}