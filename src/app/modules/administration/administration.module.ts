import { FormsModule } from '@angular/forms';
import { MdButtonModule, MdToolbarModule, MdIconModule, MdListModule, MdInputModule, MdDialogModule } from '@angular/material';
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
        component: AdministrationComponent
    }
]

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FormsModule,

        /* Angular material */
        MdButtonModule,
        MdToolbarModule,
        MdIconModule,
        MdListModule,
        MdInputModule,
        MdDialogModule
    ],
    declarations: [
        AdministrationComponent,
        CreateTournamentComponent
    ],
    entryComponents: [
        CreateTournamentComponent
    ],
    providers: [ AdministrationService ]
})
export class AdministrationModule {}