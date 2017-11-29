import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';

import { TournamentService, Table } from './../tournament/tournament.service';

@Component({
    selector: 'display-time',
    template: `<span [innerHtml]="timeString$ | async"></span>`
})
export class DisplayTimeComponent {
    @Input() time: any;
    timeString$: Observable<string>;
    time$ = new BehaviorSubject<any>(null);

    constructor(private tournamentService: TournamentService) {}

    ngOnInit() {
        const isTeam$ = this.tournamentService.getTournament().map(t => t.isTeam);
        this.timeString$ = Observable.combineLatest(isTeam$, this.time$).map(([isTeam, time]) => {
            if (isTeam) {
                return Object.keys(time)
                    .filter(k => time[k] > 0)
                    .map(k => `${k}: ${time[k]}min`)
                    .join('<br>')
            };

            return time ? time + 'min' : '';
        })
    }

    ngOnChanges() {
        this.time$.next(this.time);
    }
}