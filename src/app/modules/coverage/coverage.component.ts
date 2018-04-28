import {Component, OnInit, ViewChild} from '@angular/core'

import {
  TournamentService,
  Table,
  TableFilter,
} from '../tournament/tournament.service'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'

@Component({
  selector: 'coverage',
  templateUrl: './coverage.component.html',
  styleUrls: ['./coverage.component.scss'],
})
export class CoverageComponent implements OnInit {
  isLoading: boolean = true
  tables$: Observable<Table[]>
  filters$ = new BehaviorSubject<TableFilter>({})
  zoneTables$: Observable<Table[]>

  playerFilter: string
  scoreFilter: number

  constructor(private tournamentService: TournamentService) {}

  ngOnInit() {
    this.tables$ = this.filters$.switchMap((filters) =>
      this.tournamentService.getFilteredTables(filters)
    )
    this.tables$.take(1).subscribe((tables) => (this.isLoading = false))
    this.zoneTables$ = this.tournamentService.getDisplayTablesByZone('all')
  }

  search() {
    const filters: TableFilter = {}
    if (this.playerFilter) {
      filters.player = this.playerFilter
    }
    if (this.scoreFilter) {
      filters.atLeastPoints = this.scoreFilter
    }
    this.filters$.next(filters)
  }

  trackByFn(table: Table) {
    return table.number
  }
}
