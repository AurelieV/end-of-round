import {NotificationService} from './../../notification.service'
import {Component} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Table, TournamentService, MissingTableData} from './tournament.service'

@Component({
  selector: 'missing-tables',
  styleUrls: ['./missing-tables.component.scss'],
  templateUrl: './missing-tables.component.html',
})
export class MissingTablesComponent {
  currentTable$: Observable<Table | null>
  currentTableId$: BehaviorSubject<number | null> = new BehaviorSubject(null)
  isLoading$: Observable<boolean>
  tableNumber: number
  isPlayer1Missing: boolean = false
  isPlayer2Missing: boolean = false
  isSubmitting: boolean = false
  tables$: Observable<MissingTableData[]>

  constructor(
    private tournamentService: TournamentService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.currentTable$ = this.currentTableId$.switchMap(
      (id) =>
        id === null
          ? Observable.of(null)
          : this.tournamentService.getTable('' + id)
    )
    this.isLoading$ = Observable.combineLatest(
      this.currentTable$,
      this.currentTableId$
    ).map(([table, tableId]) => {
      if (!tableId) return false
      if (!table) return true

      return table.number !== '' + tableId
    })
    this.tables$ = this.tournamentService.getMissingTables()
  }

  onTableNumberChange(value) {
    this.currentTableId$.next(value)
  }

  submit() {
    this.isSubmitting = true
    this.currentTable$.take(1).subscribe((table) => {
      const data: MissingTableData = {
        player1: {
          name: table.coverage.player1,
          isMissing: this.isPlayer1Missing,
        },
        player2: {
          name: table.coverage.player2,
          isMissing: this.isPlayer2Missing,
        },
        key: String(this.tableNumber),
      }
      this.tournamentService.addMissingTable(data).then(
        () => {
          this.isSubmitting = false
          this.isPlayer1Missing = false
          this.isPlayer2Missing = false
          this.tableNumber = null
          this.currentTableId$.next(null)
          this.notificationService.notify(
            'Missing player(s) successfully added'
          )
        },
        () => {
          this.notificationService.notify('Something goes wrong', true)
          this.isSubmitting = false
        }
      )
    })
  }

  trackByFn(table: MissingTableData) {
    return table.key
  }
}
