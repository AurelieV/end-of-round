import { MatDialog, MatDialogRef } from '@angular/material';
import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { handleReturn } from '../shared/handle-return';
import { Observable } from 'rxjs/Observable';

import { TournamentService, CoveredTable, CoveredDataTable } from './tournament.service';
import { AddResultDialogComponent } from '../zone/add-result.dialog.component';

@Component({
    selector: 'admin-coverage',
    templateUrl: './admin-coverage.component.html',
    styleUrls: [ './admin-coverage.component.scss' ]
})
export class AdminCoverageComponent implements OnInit {
    data: CoveredDataTable = {
        coverage: {
            player1: '',
            player2: '',
            player1Score: null,
            player2Score: null
        },
        number: ''
    }
    importTables: string = '';
    tables$: Observable<CoveredTable[]>;

    private dialogRef: MatDialogRef<any>;

    @ViewChild('import') importTemplate: TemplateRef<any>;

    constructor(private md: MatDialog, private tournamentService: TournamentService) {}

    ngOnInit() {
        this.tables$ = this.tournamentService.getCoverageTables();
    }

    addTable(table: CoveredDataTable = null) {
        if (!table) table = this.data;
        this.tournamentService.addCoverageTable(table);
    }

    openImport() {
        const dialogRef = this.md.open(this.importTemplate);
        handleReturn(dialogRef);
        this.dialogRef = dialogRef;
    }

    doImport() {
        let [header, ...body] = this.importTables.split('\n');
        body = body.filter(line => !!line);
        header = header.replace('Team 1', 'Player 1');
        header = header.replace('Team 2', 'Player 2');
        header = header.replace(/Points/, 'player1Score');
        header = header.replace(/Points/, 'player2Score');
        const format = [header, ...body].join("\n");
        const parsed = window["Papa"].parse(format, {
            header: true
        }).data.map(table => {
            return {
                number: table["Table"],
                coverage: {
                    player1: table["Player 1"],
                    player2: table["Player 2"],
                    player1Score: table.player1Score === "undefined" ? 0 : Number(table.player1Score),
                    player2Score: table.player2Score === "undefined" ? 0 : Number(table.player2Score)
                }
            }
        }).forEach(table => {
            this.addTable(table);
        })
        if (this.dialogRef) {
            this.dialogRef.close();
        }
        this.importTables = "";
    }

    addResult(table: CoveredTable) {
        const dialogRef = this.md.open(AddResultDialogComponent, { width: "90%" });
        handleReturn(dialogRef);
        if (table.result) {
            dialogRef.componentInstance.result = table.result;
        }
        dialogRef.afterClosed().subscribe(result => {
            if (!result) return;
            this.tournamentService.updateTable(table.number, { 
                result,
                status: 'done',
                doneTime: table.doneTime  || new Date()
            })
        });
    }
}