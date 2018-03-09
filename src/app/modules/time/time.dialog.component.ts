import {MatDialogRef} from '@angular/material'
import {BehaviorSubject} from 'rxjs/BehaviorSubject'
import {Observable} from 'rxjs/Observable'
import {Table, TournamentService} from '../tournament/tournament.service'
import {Component, OnInit, ViewChild} from '@angular/core'
import 'rxjs/add/observable/merge'
import 'rxjs/add/operator/map'
import {FormControl} from '@angular/forms'

interface TimeData {
  time: number
  tableNumber: string
  seat: 'A' | 'B' | 'C' | 'all'
}

@Component({
  templateUrl: 'time.dialog.component.html',
  styleUrls: ['./time.dialog.component.scss'],
})
export class TimeDialogComponent implements OnInit {
  addOrUpdate: 'update' | 'add' = 'add'
  currentTable$: Observable<Table | null>
  currentTableId$: BehaviorSubject<number | null> = new BehaviorSubject(null)
  data: TimeData = {
    time: null,
    tableNumber: '',
    seat: 'A',
  }
  isLoading: Observable<boolean>
  displayMessage: Observable<boolean>
  isTeam: boolean

  @ViewChild('form') form: FormControl

  constructor(
    private tournamentService: TournamentService,
    private md: MatDialogRef<any>
  ) {}

  ngOnInit() {
    this.currentTable$ = this.currentTableId$.switchMap(
      (id) =>
        id === null
          ? Observable.of(null)
          : this.tournamentService.getTable('' + id)
    )
    this.isLoading = Observable.combineLatest(
      this.currentTable$,
      this.currentTableId$
    ).map(([table, tableId]) => {
      if (!table) return true
      if (tableId !== 0 && !tableId) return true

      return table.number !== '' + tableId
    })
    this.displayMessage = Observable.combineLatest(
      this.isLoading,
      this.currentTable$
    ).map(([isLoading, table]) => {
      if (isLoading) return false
      if (!table) return false
      if (this.data.seat === 'all') {
        return (
          table.teamTime.A > 0 || table.teamTime.B > 0 || table.teamTime.C > 0
        )
      }
      if (this.isTeam) {
        return table.teamTime[this.data.seat] > 0
      }
      return table.time > 0
    })
  }

  onTableNumberChange(value) {
    this.currentTableId$.next(value)
  }

  onSeatChange(value) {
    this.currentTableId$
      .take(1)
      .subscribe((id) => this.currentTableId$.next(id))
  }

  submit(wantToContinue?: boolean) {
    this.currentTable$.take(1).subscribe((table) => {
      let time = this.data.time
      if (table && this.data.seat !== 'all' && this.addOrUpdate === 'add') {
        time += (this.isTeam ? table.teamTime[this.data.seat] : table.time) || 0
      }
      if (this.data.seat !== 'all') {
        this.tournamentService.setTime(
          time,
          this.data.tableNumber,
          this.isTeam ? this.data.seat : null
        )
      } else {
        this.tournamentService.setTime(
          this.data.time +
            (this.addOrUpdate === 'add' ? table.teamTime['A'] || 0 : 0),
          this.data.tableNumber,
          'A'
        )
        this.tournamentService.setTime(
          this.data.time +
            (this.addOrUpdate === 'add' ? table.teamTime['B'] || 0 : 0),
          this.data.tableNumber,
          'B'
        )
        this.tournamentService.setTime(
          this.data.time +
            (this.addOrUpdate === 'add' ? table.teamTime['C'] || 0 : 0),
          this.data.tableNumber,
          'C'
        )
      }
      if (wantToContinue) {
        this.form.reset()
        setTimeout(() => {
          this.data = {
            time: null,
            tableNumber: '',
            seat: 'A',
          }
          this.addOrUpdate = 'add'
          this.onTableNumberChange(null)
          this.onSeatChange('A')
        }, 0)
      } else {
        this.md.close()
      }
    })
  }

  close() {
    this.md.close()
  }
}
