import { MatDialog, MatDialogRef } from '@angular/material';
import {  Component, Input, ViewChild, TemplateRef } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Table } from '../tournament/tournament.service';
import { TournamentService } from './../tournament/tournament.service';
import { handleReturn } from '../shared/handle-return';

@Component({
    selector: 'tables-info',
    templateUrl: './tables-info.component.html',
    styleUrls: [ 'tables-info.component.scss' ]
})
export class TablesInfoComponent {
    @Input() tables: Table[];

    @ViewChild('addInfoTemplate') addInfoTemplate: TemplateRef<any>;
    addInfoDialog: MatDialogRef<any>;

    selectedTable: Table;
    information: string;

    constructor(private tournamentService: TournamentService, private md: MatDialog) {}

    setHasResult(tableId: string, value: boolean) {
        this.tournamentService.updateTable(tableId, { hasResult: value });
    }

    addInfo(table: Table, event) {
        if (event.hasToBeStopped) return;
        this.addInfoDialog = this.md.open(this.addInfoTemplate);
        this.selectedTable = table;
        this.information = table.information || "";
        handleReturn(this.addInfoDialog);
    }

    confirmAddInfo() {
        this.addInfoDialog.close();
        this.tournamentService.updateTable(this.selectedTable.number, { information: this.information });
        this.information = "";
    }

    markEvent(event) {
        event.hasToBeStopped = true;
    }
}