import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/take';

import { TournamentService, TournamentZone } from './tournament.service';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
    information: Observable<string>;
    isLoading: boolean = true;
    zones$: Observable<TournamentZone[]>
    
    constructor(private tournamentService: TournamentService) {}

    ngOnInit() {
        this.information = this.tournamentService.getTournamentInformation();
        this.information.take(1).subscribe(_ => this.isLoading = false);
        this.zones$ = this.tournamentService.getZones();
    }
}