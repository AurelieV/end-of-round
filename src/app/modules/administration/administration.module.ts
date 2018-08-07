import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatToolbarModule,
} from '@angular/material'
import {RouterModule, Routes} from '@angular/router'
import {SharedModule} from '../shared/shared.module'
/* Components */
import {AdministrationComponent} from './administration.component'
/* Service */
import {AdministrationService} from './administration.service'
import {CreateTournamentComponent} from './create-tournament.component'

export const routes: Routes = [
  {
    path: '',
    component: AdministrationComponent,
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
