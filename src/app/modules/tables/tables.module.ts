import { AssignJudgeComponent } from './assign-judge.component';
import { MatDialogModule, MatIconModule, MatButtonModule, MatInputModule, MatCheckboxModule, MatSelectModule } from '@angular/material';
import { AddResultDialogComponent } from './add-result.dialog.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

import { TablesService } from './tables.service';

@NgModule({
    imports: [
        MatDialogModule,
        SharedModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        MatSelectModule
    ],
    declarations: [
        AddResultDialogComponent,
        AssignJudgeComponent
    ],
    providers: [
        TablesService
    ],
    exports: [
        AddResultDialogComponent,
        AssignJudgeComponent
    ],
    entryComponents: [
        AddResultDialogComponent,
        AssignJudgeComponent
    ]
})
export class TablesModule {}