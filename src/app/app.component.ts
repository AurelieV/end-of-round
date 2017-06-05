import { Component, OnInit } from '@angular/core';

import { Tournament, Zone } from './model';
import { TournamentService } from './services/tournament.service';

interface ZoneInformation {
  zone: Zone;
  needJudge: boolean;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {
  tournament: Tournament;

  constructor(private tournamentService: TournamentService) {}

  ngOnInit() {
    this.tournamentService.getTournament().subscribe(tournament => this.tournament = tournament);
  }

}
