import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MdDialog } from '@angular/material';

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
  @ViewChild('help') help: TemplateRef<any>;

  constructor(private tournamentService: TournamentService, private md: MdDialog) {}

  ngOnInit() {
    this.tournamentService.getTournament().subscribe(tournament => this.tournament = tournament);
  }

  openHelp() {
    this.md.open(this.help);
  }
}