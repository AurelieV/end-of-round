import { FormsModule } from '@angular/forms';
import { MatIconModule, MatButtonModule, MatMenuModule, MatSlideToggleModule, MatDialogModule, MatInputModule, MatCheckboxModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ZoneMessageModule } from './../zone-message/zone-message.module';

/* Components */
import { ZoneComponent } from './zone.component';
import { AddResultDialogComponent } from './add-result.dialog.component';

const routes: Routes = [
    { path: '', component: ZoneComponent }
]

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatInputModule,
        MatCheckboxModule,
        ZoneMessageModule
    ],
    declarations: [
        ZoneComponent,
        AddResultDialogComponent
    ],
    entryComponents: [
        AddResultDialogComponent
    ]
})
export class ZoneModule {}