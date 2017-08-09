import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

interface TournamentInfo {
    information: string;
    start: number;
    end: number;
    name: string;
    $key: string;
}

@Component({
    selector: 'tournament-list',
    templateUrl: './tournament-list.component.html',
    styleUrls: [ './tournament-list.component.scss' ]
})
export class TournamentListComponent implements OnInit {
    tournaments: Observable<TournamentInfo[]>;
    hasTournament: Observable<boolean>;

    constructor(private db: AngularFireDatabase, private router: Router) {}

    ngOnInit() {
        this.tournaments = this.db.list('/tournaments');
        this.hasTournament = this.tournaments.map(tournaments => tournaments.length > 0);
    }

    goToTournament(key: string) {
        this.router.navigate([ '/tournament', key ]);
    }
}