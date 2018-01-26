import {AssignJudgeComponent} from './assign-judge.component'
import {MatDialog} from '@angular/material'
import {Injectable} from '@angular/core'

import {TournamentService, Table} from '../tournament/tournament.service'
import {AddResultDialogComponent} from './add-result.dialog.component'
import {handleReturn} from '../shared/handle-return'
import {AddTablesDialogComponent} from './add-tables.dialog.component'

@Injectable()
export class TablesService {
  constructor(
    private tournamentService: TournamentService,
    private md: MatDialog
  ) {}

  addResult(table?: Table) {
    const dialogRef = this.md.open(AddResultDialogComponent, {width: '90%'})
    handleReturn(dialogRef)
    if (table) {
      dialogRef.componentInstance.setTableId(table.number)
      if (table.result) {
        dialogRef.componentInstance.result = table.result
      }
    }
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return
      const {result, number} = data
      let doneTime = new Date()
      if (table && table.doneTime) {
        doneTime = table.doneTime
      }
      this.tournamentService.updateTable(number, {
        result,
        status: 'done',
        doneTime: doneTime,
      })
    })
  }

  assign(table?: Table) {
    const dialogRef = this.md.open(AssignJudgeComponent, {width: '70%'})
    handleReturn(dialogRef)
    if (table) {
      dialogRef.componentInstance.displayTableInput = false
      dialogRef.componentInstance.tableId = table.number
    }
    dialogRef.afterClosed().subscribe((data) => {
      if (!data) return
      let {judge, number} = data
      judge = judge.replace(' ', '')
      this.tournamentService.updateTable(number, {
        assignated: judge,
        status: 'covered',
      })
      this.tournamentService.addJudge(judge)
    })
  }

  addOutstandings() {
    const dialogRef = this.md.open(AddTablesDialogComponent)
    handleReturn(dialogRef)
    dialogRef.componentInstance.title = 'Add outstandings tables'
    dialogRef.componentInstance.warning =
      '/!\\ Be aware that this will delete all others table from the current round'
    dialogRef.afterClosed().subscribe((val) => {
      if (!val) return
      this.tournamentService.addOutstandings(val.tables, val.replaceExisting)
    })
  }

  addFeatured() {
    const dialogRef = this.md.open(AddTablesDialogComponent)
    handleReturn(dialogRef)
    dialogRef.componentInstance.title = 'Add featured tables'
    dialogRef.afterClosed().subscribe((val) => {
      if (!val) return
      this.tournamentService.addFeatured(val.tables, val.replaceExisting)
    })
  }

  checkOutstandings() {
    const dialogRef = this.md.open(AddTablesDialogComponent)
    handleReturn(dialogRef)
    dialogRef.componentInstance.title = 'Check outstandings tables'
    dialogRef.componentInstance.displayOptions = false
    dialogRef.afterClosed().subscribe((val) => {
      if (!val) return
      val.tables.forEach((tableId) => {
        this.tournamentService.updateTable(tableId, {hasResult: true})
      })
    })
  }
}
