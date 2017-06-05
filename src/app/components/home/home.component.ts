import { Component, OnInit } from '@angular/core';
import { MdDialogRef, MdDialog } from '@angular/material';

import { TournamentService } from '../../services/tournament.service';
import { Tournament, Zone } from '../../model';
import { TimeComponent } from '../time/time.component';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {
    tournament: Tournament;

    constructor(private tournamentService: TournamentService, private dialog: MdDialog) {}

    ngOnInit() {
        this.tournamentService.getTournament().subscribe(tournament => this.tournament = tournament);
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