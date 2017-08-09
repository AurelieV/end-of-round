import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TournamentService, TournamentZone, Table, TablesInformation } from '../tournament/tournament.service';

@Component({
    selector: 'zone-info',
    templateUrl: './zone-info.component.html',
    styleUrls: [ './zone-info.component.scss' ]
})
export class ZoneInfoComponent implements OnInit {
    @Input() zone: TournamentZone;
    tablesInformation$: Observable<TablesInformation>;

    @HostBinding("class.need-help") get needHelp() {
        return this.zone.needHelp;
    }

    constructor(private tournamentService: TournamentService) {}

    ngOnInit() {
        this.tablesInformation$ = this.tournamentService.getActiveTablesInformationByZone(this.zone);
    }
}