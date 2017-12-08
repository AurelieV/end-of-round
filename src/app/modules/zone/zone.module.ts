import { TablesModule } from './../tables/tables.module';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MatButtonModule, MatMenuModule, MatSlideToggleModule, MatDialogModule, MatInputModule, MatCheckboxModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { ZoneMessageModule } from './../zone-message/zone-message.module';
import { TimeModule } from './../time/time.module';

/* Components */
import { ZoneComponent } from './zone.component';

const routes: Routes = [
    { path: '', component: ZoneComponent }
]

@NgModule({
    imports: [
        SharedModule,
        FormsModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatInputModule,
        MatCheckboxModule,
        ZoneMessageModule,
        RouterModule,
        TimeModule,
        TablesModule
    ],
    declarations: [
        ZoneComponent
    ],
    exports: [
        ZoneComponent
    ]
})
export class ZoneModule {}

@NgModule({
    imports: [
        ZoneModule,
        RouterModule.forChild(routes)
    ]
})
export class ZoneWithRouteModule {}