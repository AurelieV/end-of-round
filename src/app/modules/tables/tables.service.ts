import { AssignJudgeComponent } from './assign-judge.component';
import { MatDialog } from '@angular/material';
import { Injectable } from '@angular/core';

import { TournamentService, Table } from '../tournament/tournament.service';
import { AddResultDialogComponent } from './add-result.dialog.component';
import { handleReturn } from '../shared/handle-return';

@Injectable()
export class TablesService {
    constructor(private tournamentService: TournamentService, private md: MatDialog) {}

    addResult(table?: Table) {
        const dialogRef = this.md.open(AddResultDialogComponent, { width: "90%" });
        handleReturn(dialogRef);
        if (table) {
            dialogRef.componentInstance.setTableId(table.number);
            if (table.result) {
                dialogRef.componentInstance.result = table.result;
            }
        }
        dialogRef.afterClosed().subscribe(data => {
            if (!data) return;
            const { result, number } = data;
            let doneTime = new Date();
            if (table && table.doneTime) {
                doneTime = table.doneTime;
            }
            this.tournamentService.updateTable(number, { 
                result,
                status: 'done',
                doneTime: doneTime
            })
        });
    }

    assign(table?: Table) {
        const dialogRef = this.md.open(AssignJudgeComponent);
        handleReturn(dialogRef);
        if (table) {
            dialogRef.componentInstance.displayTableInput = false;
            dialogRef.componentInstance.tableId = table.number;
        }
        dialogRef.afterClosed().subscribe(data => {
            if (!data) return;
            const { judge, number } = data;
            this.tournamentService.updateTable(number, { assignated: judge, status: 'covered' });
        })
    }
}