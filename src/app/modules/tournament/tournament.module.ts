import {MissingTablesComponent} from './missing-tables.component'
import {FormsModule} from '@angular/forms'
import {
  MatDialogModule,
  MatButtonModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatRadioModule,
  MatMenuModule,
  MatSelectModule,
  MatCheckboxModule,
} from '@angular/material'
import {RouterModule, Routes} from '@angular/router'
import {NgModule} from '@angular/core'

import {SharedModule} from '../shared/shared.module'
import {TournamentService} from './tournament.service'

/* Components */
import {TournamentComponent} from './tournament.component'
import {HomeComponent} from './home.component'
import {MainComponent} from './main.component'

/* Modules */
import {ZoneModule} from '../zone/zone.module'
import {TimeModule} from './../time/time.module'

/* Guards */
import {AuthenticatedGuard, ConnectedGuard} from '../user/auth-gards.service'

export const routes: Routes = [
  {
    path: '',
    component: TournamentComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
        data: {section: 'Home'},
      },
      {
        path: '',
        component: MainComponent,
        children: [
          {
            path: 'dashboard',
            loadChildren: '../dashboard/dashboard.module#DashboardModule',
            data: {section: 'Dashboard'},
            canActivate: [AuthenticatedGuard],
          },
          {
            path: 'missing-tables',
            component: MissingTablesComponent,
            data: {section: 'Missing tables'},
            canActivate: [ConnectedGuard],
          },
          {
            path: 'zone/:zoneKey',
            loadChildren: '../zone/zone.module#ZoneWithRouteModule',
            data: {section: 'Zone'},
            canActivate: [ConnectedGuard],
          },
          {
            path: 'coverage',
            loadChildren: '../coverage/coverage.module#CoverageModule',
          },
          {
            path: 'scorekeep',
            loadChildren: '../scorekeeper/scorekeeper.module#ScoreKeeperModule',
            data: {section: 'Scorekeeper'},
            canActivate: [AuthenticatedGuard],
          },
        ],
      },
    ],
  },
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
    MatCheckboxModule,

    ZoneModule,
    TimeModule.forRoot(),
  ],
  declarations: [
    TournamentComponent,
    HomeComponent,
    MainComponent,
    MissingTablesComponent,
  ],
  providers: [TournamentService],
})
export class TournamentModule {}
