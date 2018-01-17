import {TablesModule} from './../tables/tables.module'
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
} from '@angular/material'
import {RouterModule, Routes} from '@angular/router'
import {NgModule} from '@angular/core'

import {SharedModule} from '../shared/shared.module'

/* Components */
import {CoverageComponent} from './coverage.component'
import {AdminCoverageComponent} from './admin-coverage.component'

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CoverageComponent,
        pathMatch: 'full',
        data: {section: 'Coverage'},
      },
      {
        path: 'admin',
        component: AdminCoverageComponent,
        data: {section: 'AdminCoverage'},
      },
    ],
  },
]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FormsModule,

    TablesModule,

    /* Angular material */
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatRadioModule,
    MatMenuModule,
    MatSelectModule,
  ],
  declarations: [CoverageComponent, AdminCoverageComponent],
})
export class CoverageModule {}
