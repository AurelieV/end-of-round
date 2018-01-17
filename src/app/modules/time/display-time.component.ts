import {Component, Input, ChangeDetectionStrategy} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import 'rxjs/add/observable/combineLatest'

import {TournamentService, Table} from './../tournament/tournament.service'

@Component({
  selector: 'display-time',
  template: `<span [innerHtml]="timeString$ | async"></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayTimeComponent {
  @Input() table: Table
  timeString$: Observable<string>
  table$ = new BehaviorSubject<Table>(null)

  constructor(private tournamentService: TournamentService) {}

  ngOnInit() {
    const isTeam$ = this.tournamentService.getTournament().map((t) => t.isTeam)
    this.timeString$ = Observable.combineLatest(isTeam$, this.table$).map(
      ([isTeam, table]) => {
        if (isTeam) {
          return Object.keys(table.teamTime)
            .filter((k) => table.teamTime[k] > 0)
            .map((k) => `${k}: ${table.teamTime[k]}min`)
            .join('<br>')
        }

        return table.time ? table.time + 'min' : ''
      }
    )
  }

  ngOnChanges() {
    this.table$.next(this.table)
  }
}
