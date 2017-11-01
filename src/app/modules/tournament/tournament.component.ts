import { ConnectionService } from './../../connection.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router, NavigationEnd, PRIMARY_OUTLET } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

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
        const isOnDashboard = (url) => {
            const segments = this.router.parseUrl(url).root.children[PRIMARY_OUTLET].segments.map(s => s.path);
            return segments.indexOf('dashboard') > -1;
        }
        this.subscriptions.push(
            this.router.events.subscribe(event => {
                if (event instanceof NavigationEnd) {
                    this.isOnDashboard = isOnDashboard(event.url);
                }
        }));
        this.isOnDashboard = isOnDashboard(this.router.url);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}