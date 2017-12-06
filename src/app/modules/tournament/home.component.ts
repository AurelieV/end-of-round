import { Router } from '@angular/router';
import { TimeService } from './../time/time.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/take';

import { TournamentService, Zone } from './tournament.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
    information: Observable<string>;
    isLoading: boolean = true;
    zones$: Observable<Zone[]>

    zoneId: string;
    
    constructor(
        private tournamentService: TournamentService,
        private timeService: TimeService,
        private router: Router
    ) {}

    ngOnInit() {
        this.information = this.tournamentService.getTournament().map(t => t.information);
        this.information.take(1).subscribe(_ => this.isLoading = false);
        this.zones$ = this.tournamentService.getZones();
    }

    addTime() {
        this.timeService.openDialog();
    }

    goToZone() {
        this.router.navigate(['/tournament', this.tournamentService.key, 'zone', this.zoneId]);
    }
}