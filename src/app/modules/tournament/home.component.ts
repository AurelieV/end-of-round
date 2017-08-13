import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/take';

import { TournamentService } from './tournament.service';


@Component({
    selector: 'home',
    template: '<loader [isLoading]="isLoading"></loader><div class="information">{{information | async}}</div>',
    styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
    information: Observable<string>;
    isLoading: boolean = true;
    
    constructor(private tournamentService: TournamentService) {}

    ngOnInit() {
        this.information = this.tournamentService.getTournamentInformation();
        this.information.take(1).subscribe(_ => this.isLoading = false);
    }
}