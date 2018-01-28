import {CoverageData} from './../tournament/tournament.service'
import {TablesService} from './../tables/tables.service'
import {MatDialog, MatDialogRef} from '@angular/material'
import {Component, ViewChild, TemplateRef, OnInit} from '@angular/core'
import {handleReturn} from '../shared/handle-return'
import {Observable} from 'rxjs/Observable'

import {TournamentService, CoveredTable} from '../tournament/tournament.service'
import {FormControl} from '@angular/forms'
import {Printer} from './print.service'

@Component({
  selector: 'admin-coverage',
  templateUrl: './admin-coverage.component.html',
  styleUrls: ['./admin-coverage.component.scss'],
})
export class AdminCoverageComponent implements OnInit {
  data = {
    coverage: {
      player1: '',
      player2: '',
      player1Score: null,
      player2Score: null,
    },
    number: '',
  }
  importTables: string = ''
  results: string = ''
  tables$: Observable<CoveredTable[]>
  isLoading: boolean = true

  private dialogRef: MatDialogRef<any>

  @ViewChild('import') importTemplate: TemplateRef<any>
  @ViewChild('print') printTemplate: TemplateRef<any>
  @ViewChild('result') resultsTemplate: TemplateRef<any>
  @ViewChild('form') form

  constructor(
    private md: MatDialog,
    private tournamentService: TournamentService,
    private tablesService: TablesService,
    private printer: Printer
  ) {}

  ngOnInit() {
    this.tables$ = this.tournamentService.getCoverageTables(true)
    this.tables$.take(1).subscribe((tables) => (this.isLoading = false))
  }

  addTable(data: CoverageData = null, number = null) {
    if (!number) {
      number = this.data.number
    }
    if (!data) {
      data = this.data.coverage
    }
    this.tournamentService.addCoverageTable(number, data)
    this.data = {
      coverage: {
        player1: '',
        player2: '',
        player1Score: null,
        player2Score: null,
      },
      number: '',
    }
    this.form.reset()
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
    window['Papa']
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
      .forEach((table) => {
        this.addTable(table.coverage, table.number)
      })
    if (this.dialogRef) {
      this.dialogRef.close()
    }
    this.importTables = ''
  }

  importResults() {
    window['Papa']
      .parse(this.results, {
        header: true,
      })
      .data.map((table) => {
        const result = table['Result']
        if (!result || result === 'pending' || result === 'BYE') return null
        const [score1, score2] = (result.split(' ')[1] || '').split('-')
        return {
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
          },
        }
      })
      .filter((t) => t && !isNaN(t.number))
      .forEach((table) => {
        this.tournamentService.updateTable(table.number, {
          result: table.result,
          status: 'done',
        })
      })
    if (this.dialogRef) {
      this.dialogRef.close()
    }
    this.results = ''
  }

  addResult(table: CoveredTable) {
    this.tablesService.addResult(table)
  }

  trackByFn(table: CoveredTable) {
    return table.number
  }

  openPrint() {
    const dialogRef = this.md.open(this.printTemplate)
    handleReturn(dialogRef)
    this.dialogRef = dialogRef
  }

  doPrint(roundNumber: number) {
    if (this.dialogRef) {
      this.dialogRef.close()
    }
    this.tournamentService
      .getCoverageTables()
      .take(1)
      .subscribe((tables) => {
        this.tournamentService
          .getTournament()
          .take(1)
          .subscribe((tournament) => {
            this.printer.print(tournament, tables, roundNumber)
          })
      })
  }
}
