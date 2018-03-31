import {
  TournamentService,
  CoverageData,
  Result,
} from './../tournament/tournament.service'
import {Component, ViewChild, TemplateRef, ElementRef} from '@angular/core'
import {TablesService} from '../tables/tables.service'
import {Observable} from 'rxjs/Observable'
import {Table, Zone} from '../tournament/tournament.service'
import {MatDialogRef, MatDialog} from '@angular/material'
import {handleReturn} from '../shared/handle-return'
import {NotificationService} from '../../notification.service'

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
  outstandingsTrigger = 50

  private dialogRef: MatDialogRef<any>

  @ViewChild('import') importTemplate: TemplateRef<any>
  @ViewChild('result') resultsTemplate: TemplateRef<any>

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
      this.notificationService.notify('Outstandings phase strated')
    }

    if (this.dialogRef) {
      this.dialogRef.close()
    }
    this.results = ''
  }
}
