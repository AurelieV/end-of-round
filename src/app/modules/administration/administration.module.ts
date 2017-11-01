import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatToolbarModule, MatIconModule, MatListModule, MatInputModule, MatDialogModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

/* Components */
import { AdministrationComponent } from './administration.component';
import { CreateTournamentComponent } from './create-tournament.component';

/* Service */
import { AdministrationService } from './administration.service';

export const routes: Routes = [
    { 
        path: '',
        component: AdministrationComponent,
        children: [
            { path: '', component: CreateTournamentComponent },
            { path: 'edit/:id', component: CreateTournamentComponent }
        ]
    }
]

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FormsModule,

        /* Angular material */
        MatButtonModule,
        MatToolbarModule,
        MatIconModule,
        MatListModule,
        MatInputModule,
        MatDialogModule
    ],
    declarations: [
        AdministrationComponent,
        CreateTournamentComponent
    ],
    providers: [ AdministrationService ]
})
export class AdministrationModule {}