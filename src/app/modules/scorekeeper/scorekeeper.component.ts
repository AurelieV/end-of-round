import {TournamentService} from './../tournament/tournament.service'
import {Component} from '@angular/core'
import {TablesService} from '../tables/tables.service'
import {Observable} from 'rxjs/Observable'
import {Table, Zone} from '../tournament/tournament.service'

@Component({
  templateUrl: './scorekeeper.component.html',
  styleUrls: ['./scorekeeper.component.scss'],
})
export class ScorekeeperComponent {
  tables$: Observable<Table[]>
  isOnOutstandingsStep$: Observable<boolean>
  okTables$: Observable<Table[]>
  zonesByKey$: Observable<{[key: string]: Zone}>

  constructor(
    private tableService: TablesService,
    private tournamentService: TournamentService
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

  addFeatured() {
    this.tableService.addFeatured()
  }

  checkOutstandings() {
    this.tableService.checkOutstandings()
  }
}
