import { MatDialogModule, MatIconModule, MatButtonModule, MatInputModule, MatCheckboxModule } from '@angular/material';
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
        MatCheckboxModule
    ],
    declarations: [
        AddResultDialogComponent
    ],
    providers: [
        TablesService
    ],
    exports: [
        AddResultDialogComponent
    ],
    entryComponents: [
        AddResultDialogComponent
    ]
})
export class TablesModule {}