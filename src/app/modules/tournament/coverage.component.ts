import { Component, OnInit } from '@angular/core';

import { TournamentService, CoveredTable } from './tournament.service';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'coverage',
    templateUrl: './coverage.component.html',
    styleUrls: [ './coverage.component.scss' ]
})
export class CoverageComponent implements OnInit {
    isLoading: boolean = true;
    tables$: Observable<CoveredTable[]>;

    constructor(private tournamentService: TournamentService) {}

    ngOnInit() {
        this.tables$ = this.tournamentService.getCoverageTables();
        this.tables$.take(1).subscribe(tables => this.isLoading = false);
    }
}