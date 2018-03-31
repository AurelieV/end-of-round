import {TablesService} from './../tables/tables.service'
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  ChangeDetectorRef,
  Input,
  SimpleChanges,
  OnChanges,
  Output,
  EventEmitter,
  NgZone,
  HostBinding,
} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {AngularFireDatabase} from 'angularfire2/database'
import {MatDialog, MatDialogRef} from '@angular/material'
import 'rxjs/add/operator/take'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/pairwise'
import {handleReturn} from '../shared/handle-return'
import {Subscription} from 'rxjs/Subscription'

import {
  TournamentService,
  Zone,
  Table,
} from './../tournament/tournament.service'
import {TimeService} from '../time/time.service'
import {ZoneService} from './zone.service'
import {NotificationService} from '../../notification.service'
import * as moment from 'moment'

interface Filter {
  onlyPlaying: boolean
  onlyExtraTime: boolean
}

@Component({
  selector: 'zone',
  styleUrls: ['zone.component.scss'],
  templateUrl: 'zone.component.html',
  providers: [ZoneService],
})
export class ZoneComponent implements OnInit, OnChanges, OnDestroy {
  @Input() zoneId: string
  @Input() isInserted: boolean
  @Output() onClose = new EventEmitter()
  @Output() onZoneChange = new EventEmitter()

  private subscriptions: Subscription[] = []

  zone$: Observable<Zone>
  otherZones$: Observable<Zone[]>
  tables$: Observable<(Table & {isSectionStart?: boolean})[]>
  filter$: BehaviorSubject<Filter> = new BehaviorSubject({
    onlyPlaying: false,
    onlyExtraTime: false,
  })
  isOnOutstandingsStep$: Observable<boolean>
  isLoading: boolean = true
  otherNeedHelp$: Observable<{[key: string]: boolean}>
  isAnOtherNeedHelp$: Observable<boolean>
  isTeam$: Observable<boolean>
  needHelp$: Observable<boolean>
  isLoadingOutstanding: boolean = false

  @ViewChild('confirm') confirmTemplate: TemplateRef<any>
  confirmation: MatDialogRef<any>

  @ViewChild('help') helpTemplate: TemplateRef<any>

  @ViewChild('remainingTables') remainingTablesTemplate: TemplateRef<any>
  remainingTablesDialog: MatDialogRef<any>

  @HostBinding('class.inserted')
  get inserted() {
    return this.isInserted
  }

  constructor(
    private route: ActivatedRoute,
    private tournamentService: TournamentService,
    private md: MatDialog,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private timeService: TimeService,
    private zoneService: ZoneService,
    private zone: NgZone,
    private tablesService: TablesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.map((params) => params.zoneKey).subscribe((id) => {
        if (!id) return
        this.zoneService.key = id
        this.zoneId = id
        this.needHelp$ = this.tournamentService.getNeedHelp(id)
      })
    )
    this.isOnOutstandingsStep$ = this.tournamentService.isOnOutstandingsStep()
    this.zone$ = this.zoneService.getZone()
    this.isTeam$ = this.tournamentService.isTeam()
    this.otherZones$ = this.zoneService.getOtherZones()

    const filteredTables$ = Observable.combineLatest(
      this.zoneService.getTables(),
      this.filter$,
      this.isOnOutstandingsStep$,
      this.isTeam$
    ).map(([tables, filters, isOnOutstandingsStep, isTeam]) => {
      if (isOnOutstandingsStep) return tables
      if (filters.onlyExtraTime) {
        tables = this.tournamentService.filterExtraTimedTable(tables, isTeam)
      }
      return tables.filter(
        (t) =>
          !filters.onlyPlaying ||
          t.status === 'playing' ||
          t.status === 'covered'
      )
    })
    this.tables$ = Observable.combineLatest(filteredTables$, this.zone$).map(
      ([tables, z]) => {
        if (!z.tables || z.tables.length === 0) return tables

        let cursor = 0
        for (let t of tables) {
          if (!z.tables[cursor]) return
          if (+t.number > z.tables[cursor].end) {
            cursor++
            ;(t as any).isSectionStart = true
          }
        }

        return tables
      }
    )

    this.tables$.take(1).subscribe((_) => (this.isLoading = false))
    this.otherNeedHelp$ = this.zoneService.getOtherNeedHelp()
    this.isAnOtherNeedHelp$ = this.otherNeedHelp$.map((helps) => {
      return Object.keys(helps).filter((z) => helps[z]).length > 0
    })

    this.subscriptions.push(
      this.zone$.subscribe((zone) => {
        // Only zone key, object is empty
        if (Object.keys(zone).length === 1) {
          this.router.navigate(['/'])
          this.notificationService.notify(
            'Zone does not exist any more, redirecting you to home'
          )
        }
      })
    )

    this.subscriptions.push(
      this.isOnOutstandingsStep$
        .pairwise()
        .subscribe(([previousisOnOustanding, currentisOnOutstanding]) => {
          // Return if we are already in outstanding step
          if (previousisOnOustanding) return

          // Return if you are currently displaying the loader
          if (this.isLoadingOutstanding) return

          if (currentisOnOutstanding) {
            this.isLoadingOutstanding = true
            setTimeout(() => (this.isLoadingOutstanding = false), 3000)
          }
        })
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.zoneId) {
      this.zoneService.key = changes.zoneId.currentValue
    }
  }

  trackByFn(table: Table) {
    return table.number
  }

  callHelp(needHelp: boolean) {
    this.tournamentService.setNeedHelp(this.zoneId, needHelp)
  }

  toggleOnlyPlaying(val: boolean) {
    this.filter$
      .take(1)
      .subscribe((f) =>
        this.filter$.next(Object.assign({}, f, {onlyPlaying: val}))
      )
  }

  toggleOnlyExtraTime(val: boolean) {
    this.filter$
      .take(1)
      .subscribe((f) =>
        this.filter$.next(Object.assign({}, f, {onlyExtraTime: val}))
      )
  }

  allGreen() {
    this.confirmation = this.md.open(this.confirmTemplate)
    handleReturn(this.confirmation)
  }

  confirmAllGreen() {
    this.confirmation.close()
    this.tournamentService
      .getAllTablesByZone(this.zoneService.key)
      .map((tables) => tables.filter((t) => !t.status))
      .take(1)
      .subscribe((tables) => {
        this.cd.detach()
        tables.forEach((table) => {
          this.tournamentService.updateTable(table.number, {
            status: 'done',
            doneTime: moment.utc().valueOf(),
          })
        })
        this.cd.reattach()
      })
  }

  cancelAllGreen() {
    this.confirmation.close()
  }

  addResult() {
    this.tablesService.addResult()
  }

  assign() {
    this.tablesService.assign()
  }

  markAsDone() {
    this.tablesService.markAsDone()
  }

  addTime() {
    this.timeService.openDialog()
  }

  seeHelp() {
    this.md.open(this.helpTemplate)
  }

  goToZone(key: string) {
    if (this.isInserted) {
      this.onZoneChange.emit(key)
    } else {
      this.router.navigate([
        '/tournament',
        this.tournamentService.key,
        'zone',
        key,
      ])
    }
  }

  openRemainingTables() {
    this.remainingTablesDialog = this.md.open(this.remainingTablesTemplate)
    handleReturn(this.remainingTablesDialog)
  }

  closeRemainingTables() {
    this.remainingTablesDialog.close()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe())
  }
}
