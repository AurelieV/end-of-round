import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatButtonModule, MatInputModule, MatToolbarModule, MatIconModule, MatRadioModule, MatMenuModule, MatSelectModule } from '@angular/material';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TournamentService } from './tournament.service';

/* Components */
import { TournamentComponent } from './tournament.component';
import { HomeComponent } from './home.component';
import { MainComponent } from './main.component';

/* Modules */
import { ZoneModule } from '../zone/zone.module';
import { TimeModule } from './../time/time.module';

/* Guards */
import { AuthenticatedGuard, SetLoginGuard } from '../user/auth-gards.service';

export const routes: Routes = [
    { 
        path: '',
        component: TournamentComponent,
        children: [
            { path: '', component: HomeComponent, pathMatch: 'full', data: { section: 'Home' } },
            { path: '', component: MainComponent, children: [
                {
                    path: 'dashboard',
                    loadChildren: '../dashboard/dashboard.module#DashboardModule',
                    data: { section: 'Dashboard' },
                    canActivate: [ AuthenticatedGuard ]
                },
                { 
                    path: 'zone/:id',
                    loadChildren: '../zone/zone.module#ZoneWithRouteModule',
                    data: { section: 'Zone' },
                    canActivate: [ SetLoginGuard ]
                },
                { path: 'coverage', loadChildren: '../coverage/coverage.module#CoverageModule' }
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
        MatMenuModule,
        MatSelectModule,

        ZoneModule,
        TimeModule.forRoot()
    ],
    declarations: [
        TournamentComponent,
        HomeComponent,
        MainComponent
    ],
    providers: [ TournamentService ]
})
export class TournamentModule {}