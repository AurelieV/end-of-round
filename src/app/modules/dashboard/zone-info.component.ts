import {Subscription} from 'rxjs/Subscription'
import {Router, ActivatedRoute} from '@angular/router'
import {
  Component,
  Input,
  OnInit,
  HostBinding,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/take'

import {
  TournamentService,
  Zone,
  Table,
  TablesInformation,
} from '../tournament/tournament.service'

@Component({
  selector: 'zone-info',
  templateUrl: './zone-info.component.html',
  styleUrls: ['./zone-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoneInfoComponent implements OnChanges, OnDestroy {
  @Input() zone: Zone
  @Output() onView = new EventEmitter()

  tablesInformation$: Observable<TablesInformation>
  isLoading: boolean = true
  subtitle: string

  private subscriptions: Subscription[] = []

  @HostBinding('class.need-help') needHelp: boolean

  constructor(
    private tournamentService: TournamentService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    if (!this.zone) return
    this.isLoading = true
    this.tablesInformation$ = this.tournamentService.getActiveTablesInformationByZone(
      this.zone.key
    )
    this.tablesInformation$.take(1).subscribe((_) => {
      this.isLoading = false
      this.cd.markForCheck()
    })
    this.subscriptions.forEach((s) => s.unsubscribe())
    this.subscriptions = []
    this.subscriptions.push(
      this.tournamentService
        .getNeedHelp(this.zone.key)
        .subscribe((needHelp) => (this.needHelp = needHelp))
    )
    if (this.zone.key === 'all') {
      this.subtitle = 'All tables'
    } else if (this.zone.key === 'feature') {
      this.subtitle = 'Feature tables'
    } else {
      this.subtitle = this.zone.tables
        .map((section) => `${section.start}-${section.end}`)
        .join('<br>')
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe())
  }
}
