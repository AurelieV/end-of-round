import {NotificationService} from './../../notification.service'
import {ConnectionService} from '../user/connection.service'
import {Observable} from 'rxjs/Observable'
import {Subscription} from 'rxjs/Subscription'
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  PRIMARY_OUTLET,
} from '@angular/router'
import {Component, OnInit, OnDestroy} from '@angular/core'

import {TournamentService, Tournament} from './tournament.service'

@Component({
  template: '<router-outlet></router-outlet>',
  selector: 'tournament',
})
export class TournamentComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  tournament$: Observable<Tournament>

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.tournament$ = this.tournamentService.getTournament()
    this.subscriptions.push(
      this.route.paramMap.subscribe((params) => {
        const key = params.get('tournamentKey')
        if (key) {
          this.tournamentService.key = key
        }
      })
    )
    this.subscriptions.push(
      this.tournament$.subscribe((tournament) => {
        if (Object.keys(tournament).length === 1) {
          this.router.navigate(['/'])
          this.notificationService.notify(
            'Tournament does not exist any more, redirecting you to home'
          )
        }
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe())
  }
}
