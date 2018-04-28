import {MatDialogRef} from '@angular/material'
import {TournamentService} from './tournament.service'
import {Component} from '@angular/core'

import * as moment from 'moment'

@Component({
  selector: 'set-clock',
  templateUrl: './set-clock.component.html',
  styleUrls: ['./set-clock.component.scss'],
})
export class SetClockComponent {
  clockMinutes: number = 50
  clockSeconds: number = 0

  constructor(
    private tournamentService: TournamentService,
    private dialogRef: MatDialogRef<any>
  ) {}

  setClock() {
    const now = moment.utc()
    this.tournamentService.setClock(
      now
        .add(this.clockMinutes, 'minutes')
        .add(this.clockSeconds, 'seconds')
        .valueOf()
    )
    this.dialogRef.close()
  }

  resetClock() {
    this.tournamentService.setClock(null)
    this.dialogRef.close()
  }
}
