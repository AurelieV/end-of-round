import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatInputModule, MatToolbarModule, MatIconModule, MatRadioModule, MatMenuModule, MatSelectModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

/* Components */
import { CoverageComponent } from './coverage.component';
import { AdminCoverageComponent } from './admin-coverage.component';

export const routes: Routes = [
    { 
        path: '',
        children: [
            { path: '', component: CoverageComponent, pathMatch: 'full', data: { section: 'Home' } },
            { path: 'admin', component: AdminCoverageComponent }
        ]
    }
]

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FormsModule,

        /* Angular material */
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatRadioModule,
        MatMenuModule,
        MatSelectModule
    ],
    declarations: [
        CoverageComponent,
        AdminCoverageComponent
    ]
})
export class CoverageModule {}