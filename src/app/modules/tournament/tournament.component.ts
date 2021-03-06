import {UserInfo, UserService} from './../user/user.service'
import {MatDialog} from '@angular/material'
import {NotificationService} from './../../notification.service'
import {ConnectionService} from '../user/connection.service'
import {Observable} from 'rxjs/Observable'
import {Subscription} from 'rxjs/Subscription'
import 'rxjs/add/observable/timer'
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  PRIMARY_OUTLET,
} from '@angular/router'
import {Component, OnInit, OnDestroy} from '@angular/core'

import {TournamentService, Tournament} from './tournament.service'

import * as moment from 'moment'
import {SetClockComponent} from './set-clock.component'
import {handleReturn} from '../shared/handle-return'

@Component({
  templateUrl: './tournament.component.html',
  selector: 'tournament',
  styleUrls: ['./tournament.component.scss'],
})
export class TournamentComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  tournament$: Observable<Tournament>
  clockEnd$: Observable<number>
  timer$: Observable<string>

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private router: Router,
    private notificationService: NotificationService,
    private md: MatDialog,
    private userService: UserService
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
    this.clockEnd$ = this.tournamentService.getClock()
    this.timer$ = this.clockEnd$.switchMap((time) => {
      if (!time) return Observable.of('50:00')
      return Observable.timer(1, 1000).map((tick) => {
        const now = moment()
          .utc()
          .valueOf()
        const duration = moment.duration(time - now)
        let minutes = duration.minutes()
        let seconds = duration.seconds()
        const negative = seconds < 0 || minutes < 0
        minutes = Math.abs(minutes)
        seconds = Math.abs(seconds)
        return `${negative ? '-' : ''}${minutes < 10 ? '0' : ''}${minutes}:${
          seconds < 10 ? '0' : ''
        }${seconds}`
      })
    })
  }

  openClock() {
    this.userService
      .isAuthorized(this.tournamentService.key)
      .take(1)
      .subscribe((isAuthorized) => {
        const clockDialog = this.md.open(SetClockComponent)
        handleReturn(clockDialog)
      })
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe())
  }
}
