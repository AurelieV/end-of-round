import {
  MatDialogModule,
  MatInputModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatCheckboxModule,
  MatMenuModule,
} from '@angular/material'
import {FormsModule} from '@angular/forms'
import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'

import {SharedModule} from '../shared/shared.module'
import {ZoneMessageModule} from './../zone-message/zone-message.module'
import {ZoneModule} from '../zone/zone.module'
import {TimeModule} from './../time/time.module'

/* Components */
import {DashboardComponent} from './dashboard.component'
import {AddTablesDialogComponent} from './add-tables.dialog.component'
import {ZoneInfoComponent} from './zone-info.component'
import {TableInfoComponent} from './table-info.component'

const routes: Routes = [
  {path: '', pathMatch: 'full', component: DashboardComponent},
]

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes),
    ZoneMessageModule,
    ZoneModule,
    TimeModule,

    // Angular material
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatMenuModule,
  ],
  declarations: [
    DashboardComponent,
    AddTablesDialogComponent,
    ZoneInfoComponent,
    TableInfoComponent,
  ],
  entryComponents: [AddTablesDialogComponent],
})
export class DashboardModule {}
