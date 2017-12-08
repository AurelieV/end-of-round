import { Component } from '@angular/core';

@Component({
    selector: 'assign-judge',
    templateUrl: './assign-judge.component.html',
    styleUrls: [ './assign-judge.component.scss' ]
})
export class AssignJudgeComponent {
    displayTableInput:boolean = true;
    tableId: string;
    judge: string;
}