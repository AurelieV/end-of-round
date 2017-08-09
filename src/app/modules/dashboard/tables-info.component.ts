import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Table } from '../tournament/tournament.service';
import { TournamentService } from './../tournament/tournament.service';

@Component({
    selector: 'tables-info',
    templateUrl: './tables-info.component.html',
    styleUrls: [ 'tables-info.component.scss' ]
})
export class TablesInfoComponent {
    @Input() tables: Table[];

    constructor(private tournamentService: TournamentService) {}

    setHasResult(tableId: string, value: boolean) {
        this.tournamentService.updateTable(tableId, { hasResult: value });
    }
}