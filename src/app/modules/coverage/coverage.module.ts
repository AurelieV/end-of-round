import {TimeModule} from './../time/time.module'
import {ZoneModule} from './../zone/zone.module'
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
    ],
  },
]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FormsModule,

    TablesModule,
    TimeModule,

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
  declarations: [CoverageComponent],
})
export class CoverageModule {}
