import {TablesModule} from './../tables/tables.module'
import {FormsModule} from '@angular/forms'
import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {
  MatTabsModule,
  MatDialogModule,
  MatButtonModule,
  MatInputModule,
  MatToolbarModule,
  MatIconModule,
  MatRadioModule,
  MatMenuModule,
  MatSelectModule,
} from '@angular/material'

import {SharedModule} from '../shared/shared.module'
import {ScorekeeperComponent} from './scorekeeper.component'
import {AdminCoverageComponent} from './admin-coverage.component'
import {Printer} from './print.service'

/* Components */

const routes: Routes = [
  {path: '', pathMatch: 'full', component: ScorekeeperComponent},
]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    MatTabsModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatRadioModule,
    MatMenuModule,
    MatSelectModule,
    TablesModule,
  ],
  declarations: [ScorekeeperComponent, AdminCoverageComponent],
  providers: [Printer],
})
export class ScoreKeeperModule {}
