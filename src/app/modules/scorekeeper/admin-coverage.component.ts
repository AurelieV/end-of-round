import {CoverageData} from './../tournament/tournament.service'
import {TablesService} from './../tables/tables.service'
import {MatDialog, MatDialogRef} from '@angular/material'
import {Component, ViewChild, TemplateRef, OnInit} from '@angular/core'
import {handleReturn} from '../shared/handle-return'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'

import {TournamentService, Table, Result} from '../tournament/tournament.service'
import {FormControl} from '@angular/forms'

@Component({
  selector: 'admin-coverage',
  templateUrl: './admin-coverage.component.html',
  styleUrls: ['./admin-coverage.component.scss'],
})
export class AdminCoverageComponent implements OnInit {
  importTables: string = ''
  results: string = ''
  tables$: Observable<Table[]>
  isLoading: boolean = true
  filter$ = new BehaviorSubject<string>('');

  private dialogRef: MatDialogRef<any>

  @ViewChild('import') importTemplate: TemplateRef<any>
  @ViewChild('result') resultsTemplate: TemplateRef<any>

  constructor(
    private md: MatDialog,
    private tournamentService: TournamentService,
    private tablesService: TablesService
  ) {}

  ngOnInit() {
    this.tables$ = this.filter$.switchMap(filter => this.tournamentService.getFilteredTables({player: filter}))
    this.tables$.take(1).subscribe((tables) => (this.isLoading = false))
  }

  onFilterChange(value: string) {
    this.filter$.next(value)
  }

  addTable(data: CoverageData, number) {
    this.tournamentService.addCoverageTable(number, data)
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
        try {
          const result = table['Result']
          if (!result || result === 'pending' || result === 'BYE') {
            return null
          }
          const [type, scores] = result.split(' ');
          let score1, score2, draw;
          if (type === 'Draw') {
            score1 = score2 = draw = 1;
          }
          else {
            [score1, score2] = scores.split('-').map(Number)
          }
          if (isNaN(score1) || isNaN(score2)) {
            return null;
          }
          const coverage: {number: number, result: Result} = {
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
              draw: draw || 0
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
    if (this.dialogRef) {
      this.dialogRef.close()
    }
    this.results = ''
  }

  addResult(table: Table) {
    this.tablesService.addResult(table)
  }

  trackByFn(table: Table) {
    return table.number
  }
}
