import {MatDialog} from '@angular/material'
import {Injectable} from '@angular/core'

import {TournamentService} from './../tournament/tournament.service'
import {Observable} from 'rxjs/Observable'
import {TimeDialogComponent} from './time.dialog.component'
import {handleReturn} from '../shared/handle-return'
import {AngularFireDatabase} from 'angularfire2/database'

@Injectable()
export class TimeService {
  private isTeam$: Observable<boolean>

  constructor(
    private dialog: MatDialog,
    private tournamentService: TournamentService
  ) {
    this.isTeam$ = this.tournamentService.getTournament().map((t) => t.isTeam)
  }

  openDialog() {
    const dialogRef = this.dialog.open(TimeDialogComponent)
    this.isTeam$
      .take(1)
      .subscribe((isTeam) => (dialogRef.componentInstance.isTeam = isTeam))
    handleReturn(dialogRef)
  }
}
