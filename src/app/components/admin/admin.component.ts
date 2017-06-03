import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TournamentService } from '../../services/tournament.service';
import { Tournament, Zone, Table } from '../../model';

@Component({
    selector: 'admin',
    styleUrls: [ 'admin.component.scss' ],
    templateUrl: 'admin.component.html'
})
export class AdminComponent implements OnInit {
    tournament: Tournament;

    constructor(private tournamentService: TournamentService, private router: Router) {}

    ngOnInit() {
        this.tournamentService.getTournament().subscribe(tournament => this.tournament = tournament);
    }

    goToZone(id: number) {
        this.router.navigate(['zone', id]);
    }

    createTables() {
        const tables: Table[] = [];
        for (let i = this.tournament.start; i <= this.tournament.end; i++ ) {
            tables.push({
                id: i,
                time: null,
                status: null
            });
        }
        this.tournamentService.addTables(this.tournament.name, tables);
    }
}