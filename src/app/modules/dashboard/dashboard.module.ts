import { MdDialogModule, MdInputModule, MdButtonModule, MdToolbarModule, MdIconModule, MdCheckboxModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ZoneMessageModule } from './../zone-message/zone-message.module';

/* Components */
import { DashboardComponent } from './dashboard.component';
import { AddTablesDialogComponent } from './add-tables.dialog.component';
import { ZoneInfoComponent } from './zone-info.component';
import { TablesInfoComponent } from './tables-info.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', component: DashboardComponent }
]

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        RouterModule.forChild(routes),
        ZoneMessageModule,

        // Angular material
        MdDialogModule,
        MdInputModule,
        MdButtonModule,
        MdIconModule,
        MdCheckboxModule
    ],
    declarations: [
        DashboardComponent,
        AddTablesDialogComponent,
        ZoneInfoComponent,
        TablesInfoComponent
    ],
    entryComponents: [
        AddTablesDialogComponent
    ]
})
export class DashboardModule {}