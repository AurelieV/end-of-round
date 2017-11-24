import { ConnectionService } from '../user/connection.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { TournamentService, Tournament } from './tournament.service';


@Component({
    template: '<router-outlet></router-outlet>',
    selector: 'tournament'
})
export class TournamentComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    tournament$: Observable<Tournament>;

    constructor(
        private route: ActivatedRoute,
        private tournamentService: TournamentService
    ) {}

    ngOnInit() {
        this.tournament$ = this.tournamentService.getTournament();
        this.subscriptions.push(
            this.route.paramMap.subscribe(params => {
                const key = params.get('key');
                if (key) {
                    this.tournamentService.key = key;
                }
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}