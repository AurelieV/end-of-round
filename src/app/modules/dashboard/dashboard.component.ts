import {SetClockComponent} from './../tournament/set-clock.component'
import {TablesService} from './../tables/tables.service'
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core'
import {Router, ActivatedRoute} from '@angular/router'
import {MatDialogRef, MatDialog} from '@angular/material'
import {Observable} from 'rxjs/Observable'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import 'rxjs/add/operator/take'
import 'rxjs/add/observable/combineLatest'
import {handleReturn} from '../shared/handle-return'

import * as moment from 'moment'

import {TimeService} from './../time/time.service'
import {
  TournamentService,
  Zone,
  Table,
} from './../tournament/tournament.service'
import {NgForm} from '@angular/forms'

@Component({
  selector: 'dashboard',
  styleUrls: ['dashboard.component.scss'],
  templateUrl: 'dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  zones$: Observable<Zone[]>
  tables$: Observable<Table[]>
  filteredTables$: Observable<Table[]>
  isOnOutstandingsStep$: Observable<boolean>
  okTables$: Observable<Table[]>
  filteredOkTables$: Observable<Table[]>
  remainingTables$: Observable<Table[]>
  remainingTablesByZone$: Observable<any>
  extraTimedTables$: Observable<Table[]>
  isLoading: boolean = true
  displayZoneId: string = ''
  agreedToRestart: boolean = false
  isTeam$: Observable<boolean>
  zonesByKey$: Observable<{[key: string]: Zone}>
  filter$ = new BehaviorSubject<number>(null)

  get filter(): number {
    return this.filter$.getValue()
  }

  set filter(value: number) {
    this.filter$.next(value)
  }

  @ViewChild('confirmEnd') confirmEnd: TemplateRef<any>
  confirmation: MatDialogRef<any>

  @ViewChild('extraTimed') extraTimedTemplate: TemplateRef<any>
  extraTimedDialog: MatDialogRef<any>

  @ViewChild('remainingTables') remainingTablesTemplate: TemplateRef<any>
  remainingTablesDialog: MatDialogRef<any>

  @ViewChild('sendMessage') sendMessageTemplate: TemplateRef<any>
  sendMessageDialog: MatDialogRef<any>

  clockDialog: MatDialogRef<SetClockComponent>

  constructor(
    private tournamentService: TournamentService,
    private router: Router,
    private md: MatDialog,
    private route: ActivatedRoute,
    private timeService: TimeService,
    private tableService: TablesService
  ) {}

  ngOnInit() {
    this.zones$ = this.tournamentService.getAllZones()
    this.zones$.take(1).subscribe(() => (this.isLoading = false))
    this.tables$ = this.tournamentService.getActiveTables()
    this.remainingTables$ = this.tables$.map((tables) =>
      tables.filter((t) => t.status !== 'done')
    )
    this.remainingTablesByZone$ = Observable.combineLatest(
      this.remainingTables$,
      this.zones$
    ).map(([tables, zones]) => {
      const result: any[] = []
      zones.forEach((zone) => {
        if (zone.key === 'all') return
        if (zone.key === 'feature') {
          result.push({
            name: zone.name,
            tables: tables.filter((t) => t.isFeatured),
          })
        } else {
          result.push({
            name: zone.name,
            tables: tables.filter(
              (t) => zone.key === t.zoneId && !t.isFeatured
            ),
          })
        }
      })
      return result
    })
    this.isOnOutstandingsStep$ = this.tournamentService.isOnOutstandingsStep()
    this.okTables$ = this.tournamentService.getOkTables()
    this.extraTimedTables$ = Observable.combineLatest(
      this.tables$,
      this.tournamentService.isTeam()
    ).map(([tables, isTeam]) => {
      tables = this.tournamentService
        .filterExtraTimedTable(tables, isTeam)
        .sort((a, b) => {
          if (isTeam) {
            const maxB = Math.max(
              b.teamTime.A || 0,
              b.teamTime.B || 0,
              b.teamTime.C || 0
            )
            const maxA = Math.max(
              a.teamTime.A || 0,
              a.teamTime.B || 0,
              a.teamTime.C || 0
            )
            return maxB > maxA ? 1 : -1
          } else {
            return b.time > a.time ? 1 : -1
          }
        })
      return tables
    })
    this.isTeam$ = this.tournamentService.isTeam()
    this.zonesByKey$ = this.tournamentService.getZonesByKey()
    this.filteredTables$ = Observable.combineLatest(
      this.filter$,
      this.tables$
    ).map(
      ([filter, tables]) =>
        filter
          ? (tables || []).filter((t) =>
              String(t.number).includes(String(filter))
            )
          : tables
    )
    this.filteredOkTables$ = Observable.combineLatest(
      this.filter$,
      this.okTables$
    ).map(
      ([filter, tables]) =>
        filter
          ? (tables || []).filter((t) =>
              String(t.number).includes(String(filter))
            )
          : tables
    )
  }

  goToZone(key: string) {
    this.router.navigate([
      '/tournament',
      this.tournamentService.key,
      'zone',
      key,
    ])
  }

  displayZone(key: string) {
    this.displayZoneId = key
  }

  endRound() {
    this.confirmation = this.md.open(this.confirmEnd)
    this.confirmation.afterClosed().subscribe((val) => {
      this.agreedToRestart = false
    })
  }

  addOutstandings() {
    this.tableService.addOutstandings()
  }

  setFeatured() {
    this.tableService.administrateFeatured()
  }

  checkOutstandings() {
    this.tableService.checkOutstandings()
  }

  cancelRestart() {
    this.confirmation.close()
  }

  restart() {
    this.tournamentService.restart()
    this.confirmation.close()
  }

  openExtraTimed() {
    this.extraTimedDialog = this.md.open(this.extraTimedTemplate)
    handleReturn(this.extraTimedDialog)
  }

  closeExtraTimed() {
    this.extraTimedDialog.close()
  }

  openRemainingTables() {
    this.remainingTablesDialog = this.md.open(this.remainingTablesTemplate)
    handleReturn(this.remainingTablesDialog)
  }

  closeRemainingTables() {
    this.remainingTablesDialog.close()
  }

  openClock() {
    this.clockDialog = this.md.open(SetClockComponent)
    handleReturn(this.clockDialog)
  }

  trackByFn(val: Zone) {
    return val.key
  }

  trackByTableFn(table: Table) {
    return table.number
  }

  addTime() {
    this.timeService.openDialog()
  }

  openSendMessageToAll() {
    this.sendMessageDialog = this.md.open(this.sendMessageTemplate)
    handleReturn(this.sendMessageDialog)
  }

  closeSendMessage(form: NgForm) {
    form.reset()
    this.sendMessageDialog.close()
  }

  sendMessageToAll(form: NgForm, message: string) {
    form.reset()
    this.tournamentService.sendMessageToAll(message)
    this.sendMessageDialog.close()
  }

  askStatus(table: Table) {
    this.tournamentService.sendMessage(
      table.zoneId,
      `Status for ${table.number}?`
    )
  }
}
