import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatInputModule, MatToolbarModule, MatIconModule, MatRadioModule, MatMenuModule } from '@angular/material';
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
            { path: '', component: HomeComponent, pathMatch: 'full', data: { section: 'Home' } },
            { path: '', component: MainComponent, children: [
                { path: 'dashboard', loadChildren: '../dashboard/dashboard.module#DashboardModule', data: { section: 'Dashboard' } },
                { path: 'zone/:id', loadChildren: '../zone/zone.module#ZoneModule', data: { section: 'Zone' } }
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
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule,
        MatRadioModule,
        MatMenuModule
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