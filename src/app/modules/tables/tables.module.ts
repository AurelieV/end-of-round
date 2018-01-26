import {TimeModule} from './../time/time.module'
import {TableInfoComponent} from './table-info.component'
import {AssignJudgeComponent} from './assign-judge.component'
import {
  MatDialogModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatCheckboxModule,
  MatSelectModule,
} from '@angular/material'
import {AddResultDialogComponent} from './add-result.dialog.component'
import {NgModule} from '@angular/core'
import {SharedModule} from '../shared/shared.module'
import {FormsModule} from '@angular/forms'

import {TablesService} from './tables.service'
import {AddTablesDialogComponent} from './add-tables.dialog.component'

@NgModule({
  imports: [
    MatDialogModule,
    SharedModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    TimeModule,
  ],
  declarations: [
    AddResultDialogComponent,
    AssignJudgeComponent,
    AddTablesDialogComponent,
    TableInfoComponent,
  ],
  providers: [TablesService],
  exports: [
    AddResultDialogComponent,
    AssignJudgeComponent,
    AddTablesDialogComponent,
    TableInfoComponent,
  ],
  entryComponents: [
    AddResultDialogComponent,
    AssignJudgeComponent,
    AddTablesDialogComponent,
  ],
})
export class TablesModule {}
