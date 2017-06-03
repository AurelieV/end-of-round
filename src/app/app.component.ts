import { Component } from '@angular/core';

import { Tournament } from './model';
import { TournamentService } from './services/tournament.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {
  tournament: Tournament;

  constructor(private tournamentService: TournamentService) {
      tournamentService.getTournament().subscribe(tournament => this.tournament = tournament);
  }
}
