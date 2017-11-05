import { Component, Input, OnInit, HostBinding } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { TournamentService, Zone, Table, TablesInformation } from '../tournament/tournament.service';

@Component({
    selector: 'zone-info',
    templateUrl: './zone-info.component.html',
    styleUrls: [ './zone-info.component.scss' ]
})
export class ZoneInfoComponent implements OnInit {
    @Input() zone: Zone;
    tablesInformation$: Observable<TablesInformation>;
    isLoading: boolean = true;

    @HostBinding("class.need-help") get needHelp() {
        return this.zone && this.zone.needHelp;
    }

    constructor(private tournamentService: TournamentService) {}

    ngOnInit() {
        this.tablesInformation$ = this.tournamentService.getActiveTablesInformationByZone(this.zone);
        this.tablesInformation$.take(1).subscribe(_ => this.isLoading = false);
    }
}