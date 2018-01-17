import {Router} from '@angular/router'
import {TimeService} from './../time/time.service'
import {Observable} from 'rxjs/Observable'
import {Component, OnInit, OnDestroy} from '@angular/core'
import 'rxjs/add/operator/take'

import {TournamentService, Zone} from './tournament.service'
import {Subscription} from 'rxjs/Subscription'

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  information: Observable<string>
  isLoading: boolean = true
  zones$: Observable<Zone[]>

  zoneId: string
  private subcription: Subscription

  constructor(
    private tournamentService: TournamentService,
    private timeService: TimeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.information = this.tournamentService
      .getTournament()
      .map((t) => t.information)
    this.information.take(1).subscribe((_) => (this.isLoading = false))
    this.zones$ = this.tournamentService.getZones()
    this.subcription = this.zones$.subscribe((zones) => {
      if (zones.length <= 2 && zones.length > 1) {
        this.zoneId = zones[0].key
      }
    })
  }

  addTime() {
    this.timeService.openDialog()
  }

  goToZone() {
    this.router.navigate([
      '/tournament',
      this.tournamentService.key,
      'zone',
      this.zoneId,
    ])
  }

  ngOnDestroy() {
    this.subcription.unsubscribe()
  }
}
