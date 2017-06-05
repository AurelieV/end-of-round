import { Component } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';

import { Tournament, Zone } from './model';
import { TournamentService } from './services/tournament.service';
import { TimeComponent } from './components/time/time.component';

interface ZoneInformation {
  zone: Zone;
  needJudge: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  tournament: Tournament;
  zonesInfo: ZoneInformation[] = [];

  constructor(private tournamentService: TournamentService, private dialog: MdDialog) {
      tournamentService.getTournament().subscribe(tournament => {
        this.tournament = tournament;
        this.zonesInfo = tournament.zones.map(zone => ({ zone, needJudge: false}));
        this.zonesInfo[2].needJudge = true;
        this.zonesInfo[4].needJudge = true;
      });
  }

  addTime() {
    const dialogRef = this.dialog.open(TimeComponent);
    dialogRef.afterClosed().subscribe(data => {
      if (!data) return;
      const table = this.tournament.tables.find(t => t.id === data.tableNumber);
      if (!table) return;
      this.tournamentService.setTime(table, data.time);
    })
  }
}
