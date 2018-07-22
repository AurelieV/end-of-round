import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { NotificationService } from '../../notification.service';
import { handleReturn } from '../shared/handle-return';
import { TablesService } from '../tables/tables.service';
import { Table, Zone } from '../tournament/tournament.service';
import { CoverageData, Result, TournamentService } from './../tournament/tournament.service';

@Component({
  templateUrl: './scorekeeper.component.html',
  styleUrls: ['./scorekeeper.component.scss'],
})
export class ScorekeeperComponent {
  tables$: Observable<Table[]>
  isOnOutstandingsStep$: Observable<boolean>
  okTables$: Observable<Table[]>
  zonesByKey$: Observable<{[key: string]: Zone}>
  results: string = ''
  importTables: string = ''
  importSeatAll: string = ''
  outstandingsTrigger = 50

  private dialogRef: MatDialogRef<any>

  @ViewChild('import') importTemplate: TemplateRef<any>
  @ViewChild('result') resultsTemplate: TemplateRef<any>
  @ViewChild('confirm') confirmTemplate: TemplateRef<any>
  @ViewChild('seatAll') seatAllTemplate: TemplateRef<any>

  constructor(
    private tableService: TablesService,
    private tournamentService: TournamentService,
    private md: MatDialog,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.zonesByKey$ = this.tournamentService.getZonesByKey()
    this.tables$ = this.tournamentService.getActiveTables()
    this.isOnOutstandingsStep$ = this.tournamentService.isOnOutstandingsStep()
    this.okTables$ = this.tournamentService.getOkTables()
  }

  trackByTableFn(table: Table) {
    return table.number
  }

  addOutstandings() {
    this.tableService.addOutstandings()
  }

  setFeatured() {
    this.tableService.administrateFeatured()
  }

  checkOutstandings() {
    this.tableService.checkOutstandings()
  }

  openImport() {
    const dialogRef = this.md.open(this.importTemplate)
    handleReturn(dialogRef)
    this.dialogRef = dialogRef
  }

  openImportSeatAll() {
    const dialogRef = this.md.open(this.seatAllTemplate)
    handleReturn(dialogRef)
    this.dialogRef = dialogRef
  }

  openResults() {
    const dialogRef = this.md.open(this.resultsTemplate)
    handleReturn(dialogRef)
    this.dialogRef = dialogRef
  }

  doImport() {
    let [header, ...body] = this.importTables.split('\n')
    body = body.filter((line) => !!line)
    header = header.replace('Team 1', 'Player 1')
    header = header.replace('Team 2', 'Player 2')
    header = header.replace(/Points/, 'player1Score')
    header = header.replace(/Points/, 'player2Score')
    const format = [header, ...body].join('\n')
    const tables = window['Papa']
      .parse(format, {
        header: true,
      })
      .data.map((table) => {
        return {
          number: table['Table'],
          coverage: {
            player1: table['Player 1'],
            player2: table['Player 2'],
            player1Score:
              table.player1Score === 'undefined'
                ? 0
                : Number(table.player1Score),
            player2Score:
              table.player2Score === 'undefined'
                ? 0
                : Number(table.player2Score),
          },
        }
      })
      .filter((t) => !isNaN(t.number))
    tables.forEach((table) => {
      this.addTable(table.coverage, table.number)
    })
    this.notificationService.notify(
      `Import successfully ${tables.length} tables`
    )
    if (this.dialogRef) {
      this.dialogRef.close()
    }
    this.importTables = ''
  }

  doImportSeatAll() {
    const lines = window['Papa']
      .parse(this.importSeatAll, {
        header: true,
      })
      .data.map((player) => {
        return {
          table: Number(player['Table']),
          player: player['Name']
        }
      })
      .filter((t) => t.table && !isNaN(t.table))
    const tables = {}
    lines.forEach((line) => {
      if (tables[line.table]) {
        tables[line.table].player2 = line.player
        tables[line.table].player2Score = 0
      } else {
        tables[line.table] = {
          player1: line.player,
          player1Score: 0,
        }
      }
    })
    Object.keys(tables).forEach((table) => {
      this.tournamentService.addCoverageTable(String(table), tables[table])
    })
    this.notificationService.notify(
      `Import successfully ${Object.keys(tables).length} tables`
    )
    if (this.dialogRef) {
      this.dialogRef.close()
    }
    this.importSeatAll = ''
  }

  addTable(data: CoverageData, number) {
    this.tournamentService.addCoverageTable(number, data)
  }

  importResults() {
    const data = window['Papa'].parse(this.results, {
      header: true,
    }).data

    // Update tables
    data
      .map((table) => {
        try {
          const result = table['Result']
          if (!result || result === 'pending' || result === 'BYE') {
            return null
          }
          const [type, scores] = result.split(' ')
          let score1, score2, draw
          if (type === 'Draw') {
            score1 = score2 = draw = 1
          } else {
            ;[score1, score2] = scores.split('-').map(Number)
          }
          if (isNaN(score1) || isNaN(score2)) {
            return null
          }
          const coverage: {number: number; result: Result} = {
            number: table['Table'],
            result: {
              player1: {
                score: Number(score1),
                drop: false,
              },
              player2: {
                score: Number(score2),
                drop: false,
              },
              draw: draw || 0,
            },
          }
          return coverage
        } catch (e) {
          return null
        }
      })
      .filter((t) => t && !isNaN(t.number))
      .forEach((table) => {
        this.tournamentService.updateTable(table.number, {
          result: table.result,
          status: 'done',
          hasResult: true,
        })
      })

    // Update outstandings?
    const remainings = data
      .map((table) => {
        try {
          const result = table['Result']
          if (result === 'pending') {
            return Number(table['Table'])
          }
        } catch (e) {
          return null
        }
      })
      .filter((id) => id && !isNaN(id))

    this.notificationService.notify(
      `Import done. ${remainings.length} tables with no result yet.`
    )

    if (remainings.length <= this.outstandingsTrigger) {
      this.tournamentService.addOutstandings(remainings, true)
      this.notificationService.notify('Outstandings phase started')
    }

    if (this.dialogRef) {
      this.dialogRef.close()
    }
    this.results = ''
  }

  openResetMissing() {
    this.dialogRef = this.md.open(this.confirmTemplate)
    handleReturn(this.dialogRef)
  }

  resetMissing() {
    this.tournamentService.resetMissingTables().then(
      () => {
        this.dialogRef.close()
        this.notificationService.notify(
          'Missing players report successfully reset'
        )
      },
      () => this.notificationService.notify('Something goes wrong', true)
    )
  }

  cancel() {
    this.dialogRef.close()
  }
}
