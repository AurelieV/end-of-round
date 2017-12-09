import { MatDialogRef } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Table, TournamentService } from '../tournament/tournament.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { FormControl } from '@angular/forms';

interface TimeData {
    time: number;
    tableNumber: string;
    seat: 'A' | 'B' | 'C' | 'all';
}

@Component({
    templateUrl: 'time.dialog.component.html',
    styleUrls: [ './time.dialog.component.scss' ]
})
export class TimeDialogComponent implements OnInit {
    addOrUpdate: 'update' | 'add' = 'add';
    currentTable$: Observable<Table | null>;
    currentTableId$: BehaviorSubject<number | null> = new BehaviorSubject(null);
    data: TimeData = {
        time: null,
        tableNumber: '',
        seat: 'A'
    };
    isLoading: Observable<boolean>;
    displayMessage: Observable<boolean>;
    isTeam: boolean;

    @ViewChild('form') form: FormControl;

    constructor(private tournamentService: TournamentService, private md: MatDialogRef<any>) {}

    ngOnInit() {
        this.currentTable$ = this.currentTableId$
            .switchMap(id => id === null ? Observable.of(null) : this.tournamentService.getTable('' + id));
        this.isLoading = Observable.combineLatest(this.currentTable$, this.currentTableId$).map(([table, tableId]) => {
            if (!table) return true;
            if (tableId !== 0 && !tableId) return true;
            
            return table.number !== '' + tableId;
        });
        this.displayMessage = Observable.combineLatest(this.isLoading, this.currentTable$).map(([isLoading, table]) => {
            return !isLoading && table && this.data.seat !== 'all' &&
                ((!this.isTeam && table.time > 0) || (this.isTeam && table.time[this.data.seat] > 0));
        });
    }

    onTableNumberChange(value) {
        this.currentTableId$.next(value);
    }

    onSeatChange(value) {
        this.currentTableId$.take(1).subscribe(id => this.currentTableId$.next(id));
        if (value === 'all') {
            this.addOrUpdate = 'add';
        }
    }

    submit(wantToContinue?: boolean) {
        this.currentTable$.take(1).subscribe(table => {
            let time = this.data.time;
            if (table && this.data.seat !== 'all' && this.addOrUpdate === 'add' && table.time) {
                time += this.isTeam ? (table.time[this.data.seat] || 0) : table.time;
            }
            if (this.data.seat !== 'all') {
                this.tournamentService.setTime(time, this.data.tableNumber, this.isTeam ? this.data.seat : null);
            } else {
                this.tournamentService.setTime(this.data.time + (table.time['A'] || 0), this.data.tableNumber, 'A');
                this.tournamentService.setTime(this.data.time + (table.time['B'] || 0), this.data.tableNumber,'B');
                this.tournamentService.setTime(this.data.time + (table.time['C'] || 0), this.data.tableNumber,'C');
            }
            if (wantToContinue) {
                this.form.reset();
                setTimeout(() => {
                    this.data = {
                        time: null,
                        tableNumber: '',
                        seat: 'A'
                    };
                    this.addOrUpdate = 'add';
                    this.onTableNumberChange(null);
                    this.onSeatChange('A');
                }, 0);
            } else {
                this.md.close();
            }
        })
    }

    close() {
        this.md.close();
    }
}