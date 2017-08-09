import { FormsModule } from '@angular/forms';
import { MdDialogModule, MdButtonModule, MdInputModule, MdToolbarModule, MdIconModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TournamentService } from './tournament.service';

/* Components */
import { TournamentComponent } from './tournament.component';
import { HomeComponent } from './home.component';
import { TimeDialogComponent } from './time.dialog.component';
import { MainComponent } from './main.component';

export const routes: Routes = [
    { 
        path: '',
        component: TournamentComponent,
        children: [
            { path: '', component: HomeComponent, pathMatch: 'full' },
            { path: '', component: MainComponent, children: [
                { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule' },
                { path: 'zone/:id', loadChildren: '../zone/zone.module#ZoneModule' }
            ]}
        ]
    }
]

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        FormsModule,

        /* Angular material */
        MdDialogModule,
        MdButtonModule,
        MdInputModule,
        MdToolbarModule,
        MdIconModule
    ],
    declarations: [
        TournamentComponent,
        HomeComponent,
        TimeDialogComponent,
        MainComponent
    ],
    entryComponents: [
        TimeDialogComponent
    ],
    providers: [ TournamentService ]
})
export class TournamentModule {}