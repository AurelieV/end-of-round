import { Router, ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit, HostBinding, Output, EventEmitter, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { TournamentService, Zone, Table, TablesInformation } from '../tournament/tournament.service';

@Component({
    selector: 'zone-info',
    templateUrl: './zone-info.component.html',
    styleUrls: [ './zone-info.component.scss' ]
})
export class ZoneInfoComponent implements OnInit, OnChanges {
    @Input() zone: Zone;
    @Output() onView = new EventEmitter()
    
    tablesInformation$: Observable<TablesInformation>;
    isLoading: boolean = true;
    subtitle: string;

    @HostBinding("class.need-help") get needHelp() {
        return this.zone.needHelp;
    }

    constructor(private tournamentService: TournamentService) {}

    ngOnInit() {
        this.tablesInformation$ = this.tournamentService.getActiveTablesInformationByZone(this.zone.key);
        this.tablesInformation$.take(1).subscribe(_ => this.isLoading = false);
    }

    ngOnChanges() {
        if (!this.zone) return;
        if (this.zone.key === 'all') {
            this.subtitle = "All tables"
        } else if (this.zone.key === 'feature') {
            this.subtitle = "Feature tables"
        } else {
            this.subtitle = this.zone.tables.map(section => `${section.start}-${section.end}`).join(' // ')
        }
    }
}