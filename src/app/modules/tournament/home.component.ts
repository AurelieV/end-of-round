import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';

import { TournamentService } from './tournament.service';


@Component({
    selector: 'home',
    template: '<div class="information">{{information | async}}</div>',
    styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
    information: Observable<string>;
    
    constructor(private tournamentService: TournamentService) {}

    ngOnInit() {
        this.information = this.tournamentService.getTournamentInformation();
    }
}