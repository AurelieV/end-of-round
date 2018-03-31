import {MatDialog, MatDialogRef} from '@angular/material'
import {
  Component,
  Input,
  ViewChild,
  TemplateRef,
  HostBinding,
  ChangeDetectionStrategy,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core'
import {AngularFireDatabase} from 'angularfire2/database'

import {Table, Zone} from '../tournament/tournament.service'
import {TournamentService} from './../tournament/tournament.service'
import {handleReturn} from '../shared/handle-return'
import {TablesService} from '../tables/tables.service'
import * as moment from 'moment'

@Component({
  selector: 'table-info',
  templateUrl: './table-info.component.html',
  styleUrls: ['table-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableInfoComponent implements OnDestroy, OnChanges {
  @Input() table: Table
  @Input() displayMode: 'full' | 'minimal' = 'full'
  @Input() isOnOutstandingsStep: boolean
  @Input() zones: {[key: string]: Zone}

  updateTimeout: number

  @HostBinding('class.warn') warn: boolean

  @HostBinding('class.isFeatured')
  get isFeatured() {
    return this.table && this.table.isFeatured
  }

  @HostBinding('class.no-status')
  get hasNoStatus() {
    return this.table && this.table.status === ''
  }

  @HostBinding('class.extra-timed')
  get hasExtraTime() {
    return (
      this.table &&
      this.table.status !== 'done' &&
      (this.table.time > 0 ||
        this.table.teamTime.A > 0 ||
        this.table.teamTime.B > 0 ||
        this.table.teamTime.C > 0)
    )
  }

  constructor(
    private tournamentService: TournamentService,
    private md: MatDialog,
    private tablesService: TablesService,
    private cd: ChangeDetectorRef
  ) {}

  setHasResult(tableId: string, value: boolean) {
    this.tournamentService.updateTable(tableId, {
      hasResult: value,
    })
  }

  addResult(e: Event, table: Table) {
    if (e) e.stopPropagation()
    this.tablesService.addResult(table)
  }

  assign(e: Event, table: Table) {
    if (e) e.stopPropagation()
    this.tablesService.assign(table)
  }

  trackByFn(table: Table) {
    return table.number
  }

  checkWarn() {
    this.warn =
      this.table &&
      this.isOnOutstandingsStep &&
      !this.table.hasResult &&
      this.table.status === 'done' &&
      moment.utc().diff(moment.utc(this.table.doneTime), 'minute') > 3
  }

  ngOnChanges(changes: SimpleChanges) {
    this.checkWarn()
    if (this.warn) {
      this.cancelTimeout()
    }
    if (changes.table) {
      const current = changes.table.currentValue
      const previous = changes.table.previousValue
      if ((!previous || current.doneTime !== previous.doneTime) && !this.warn) {
        this.setTimeout()
      }
    }
  }

  setTimeout() {
    const timeToWait = 20 * 1000
    setTimeout(() => {
      this.checkWarn()
      if (!this.warn) this.setTimeout()
    }, timeToWait)
  }

  cancelTimeout() {
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout)
      this.updateTimeout = null
    }
  }

  ngOnDestroy() {
    this.cancelTimeout()
  }
}
