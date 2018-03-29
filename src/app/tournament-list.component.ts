import {Router} from '@angular/router'
import {Observable} from 'rxjs/Observable'
import {Component, OnInit} from '@angular/core'
import {AngularFireDatabase} from 'angularfire2/database'
import 'rxjs/add/operator/take'

import {Tournament, TournamentData} from './model'

@Component({
  selector: 'tournament-list',
  templateUrl: './tournament-list.component.html',
  styleUrls: ['./tournament-list.component.scss'],
})
export class TournamentListComponent implements OnInit {
  tournaments$: Observable<Tournament[]>
  noTournament$: Observable<boolean>
  isLoading: boolean = true
  client: any

  constructor(private db: AngularFireDatabase, private router: Router) {}

  ngOnInit() {
    this.tournaments$ = this.db
      .list<TournamentData>('/tournaments')
      .snapshotChanges()
      .map((actions) =>
        actions.map(({payload}) => ({key: payload.key, ...payload.val()}))
      )
    this.noTournament$ = this.tournaments$.map(
      (tournaments) => tournaments.length === 0
    )
    this.tournaments$.take(1).subscribe(() => (this.isLoading = false))
  }

  goToTournament(key: string) {
    this.router.navigate(['/tournament', key])
  }
}
