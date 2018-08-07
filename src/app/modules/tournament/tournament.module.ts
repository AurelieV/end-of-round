import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatRadioModule,
  MatSelectModule,
  MatToolbarModule,
} from '@angular/material'
import {RouterModule, Routes} from '@angular/router'
import {SharedModule} from '../shared/shared.module'
/* Modules */
import {ZoneModule} from '../zone/zone.module'
import {TimeModule} from './../time/time.module'
import {HomeComponent} from './home.component'
import {MainComponent} from './main.component'
import {MissingTablesComponent} from './missing-tables.component'
import {SetClockComponent} from './set-clock.component'
/* Components */
import {TournamentComponent} from './tournament.component'
import {TournamentService} from './tournament.service'

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
          },
          {
            path: 'missing-tables',
            component: MissingTablesComponent,
            data: {section: 'Missing tables'},
          },
          {
            path: 'zone/:zoneKey',
            loadChildren: '../zone/zone.module#ZoneWithRouteModule',
            data: {section: 'Zone'},
          },
          {
            path: 'coverage',
            loadChildren: '../coverage/coverage.module#CoverageModule',
          },
          {
            path: 'scorekeep',
            loadChildren: '../scorekeeper/scorekeeper.module#ScoreKeeperModule',
            data: {section: 'Scorekeeper'},
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
    SetClockComponent,
  ],
  entryComponents: [SetClockComponent],
  providers: [TournamentService],
})
export class TournamentModule {}
