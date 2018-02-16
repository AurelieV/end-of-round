import {Component, OnInit} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import {Table, TournamentService} from '../tournament/tournament.service'

@Component({
  selector: 'admin-featured',
  templateUrl: './admin-featured.component.html',
  styleUrls: ['./admin-featured.component.scss'],
})
export class AdminFeaturedComponent implements OnInit {
  tables$: Observable<Table[]>
  isLoading: boolean = true

  constructor(private tournamentService: TournamentService) {}

  ngOnInit() {
    this.tables$ = this.tournamentService.getAllTablesByZone('feature')
    this.tables$.take(1).subscribe((table) => (this.isLoading = false))
  }

  add(tables: string) {
    const ids = tables.match(/(\d+)/g)
    this.tournamentService.addFeatured(ids)
  }

  delete(tableId: string) {
    this.tournamentService.removeFeatured([tableId])
  }

  trackByFn(table: Table) {
    return table.number
  }
}
