import {FormsModule} from '@angular/forms'
import {
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatListModule,
  MatInputModule,
  MatDialogModule,
  MatCheckboxModule,
} from '@angular/material'
import {RouterModule, Routes} from '@angular/router'
import {NgModule} from '@angular/core'

import {SharedModule} from '../shared/shared.module'

/* Components */
import {AdministrationComponent} from './administration.component'
import {CreateTournamentComponent} from './create-tournament.component'

/* Service */
import {AdministrationService} from './administration.service'
import {AuthenticatedGuard} from '../user/auth-gards.service'

export const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
    canActivate: [AuthenticatedGuard],
    children: [
      {path: '', component: CreateTournamentComponent},
      {
        path: 'edit/:tournamentKey',
        component: CreateTournamentComponent,
        data: {section: 'Edition'},
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
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
  ],
  declarations: [AdministrationComponent, CreateTournamentComponent],
  providers: [AdministrationService],
})
export class AdministrationModule {}
