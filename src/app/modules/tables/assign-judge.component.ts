import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TournamentService } from '../tournament/tournament.service';
import { MatDialogRef } from '@angular/material';

@Component({
    selector: 'assign-judge',
    templateUrl: './assign-judge.component.html',
    styleUrls: [ './assign-judge.component.scss' ]
})
export class AssignJudgeComponent implements OnInit {
    displayTableInput:boolean = true;
    tableId: string;
    judge: string;

    judges$: Observable<string[]>;

    constructor(private tournamentService: TournamentService, private md: MatDialogRef<any>) {}

    ngOnInit() {
        this.judges$ = this.tournamentService.getJudges();
    }

    onJudgeClick(judge: string) {
        this.judge = judge;
        this.submit();
    }

    submit() {
        this.md.close({ judge: this.judge, number: this.tableId })
    }
}