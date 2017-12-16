import {
  Component,
  Input,
  HostListener,
  HostBinding,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core'

import {Table, TournamentService} from '../tournament/tournament.service'
import {TablesService} from '../tables/tables.service'
import * as moment from 'moment'

@Component({
  selector: 'zone-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnChanges, OnDestroy {
  @Input() table: Table
  @Input() isOnOutstandingsStep: boolean
  @Input() isTeam: boolean
  @Input() canInteractWithFeaturedTables: boolean

  updateTimeout: number

  @HostBinding('class.warn') warn: boolean

  @HostBinding('class.has-time')
  get hasTime() {
    if (!this.table) return false
    if (this.isTeam) {
      const time = this.table.time as any
      return time && (time.A > 0 || time.B > 0 || time.C > 0)
    }
    return this.table.time > 0
  }

  @HostBinding('class.is-team')
  get displayTeam() {
    return this.isTeam
  }

  @HostBinding('class.featured')
  get isFeatured() {
    return (
      !this.canInteractWithFeaturedTables && this.table && this.table.isFeatured
    )
  }

  constructor(
    private tournamentService: TournamentService,
    private tablesService: TablesService
  ) {}

  @HostListener('click')
  onClick() {
    let update = {}
    if (this.table.isFeatured && !this.canInteractWithFeaturedTables) return
    switch (this.table.status) {
      case '':
        update = {status: 'playing'}
        break
      case 'playing':
        update = {status: 'covered'}
        break
      case 'covered':
        update = {status: 'done', doneTime: new Date()}
        break
      case 'done':
        update = {status: 'playing', doneTime: null}
        break
    }
    this.tournamentService.updateTable(this.table.number, update)
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

  checkWarn() {
    this.warn =
      this.table &&
      this.isOnOutstandingsStep &&
      this.table.status === 'done' &&
      moment().diff(moment(this.table.doneTime), 'minute') > 3
  }

  assign($event: Event) {
    $event.stopPropagation()
    this.tablesService.assign(this.table)
  }

  addResult($event: Event) {
    $event.stopPropagation()
    this.tablesService.addResult(this.table)
  }

  ngOnDestroy() {
    this.cancelTimeout()
  }
}
