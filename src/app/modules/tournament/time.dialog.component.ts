import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Table, TournamentService } from './tournament.service';
import { Component, OnInit } from '@angular/core';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

interface TimeData {
    time: null | number;
    tableNumber: null | number;
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
        tableNumber: null
    };
    isLoading: Observable<boolean>;
    displayMessage: Observable<boolean>;

    constructor(private tournamentService: TournamentService) {}

    ngOnInit() {
        this.currentTable$ = this.currentTableId$.switchMap(id => id === null ? Observable.of(null) : this.tournamentService.getTable('' + id));
        this.isLoading = Observable.combineLatest(this.currentTable$, this.currentTableId$).map(([table, tableId]) => {
            if (!table) return true;
            if (tableId !== 0 && !tableId) return true;
            
            return table['$key'] !== '' + tableId;
        });
        this.displayMessage = Observable.combineLatest(this.isLoading, this.currentTable$).map(([isLoading, table]) => {
            return !isLoading && table && table.time > 0;
        });
    }

    onTableNumberChange(value) {
        this.currentTableId$.next(value);
    }

    submit() {
        this.currentTable$.take(1).subscribe(table => {
            if (!table || this.addOrUpdate === 'update') {
                this.tournamentService.setTime(this.data.time as number, this.data.tableNumber as number);
            } else {
                this.tournamentService.setTime(this.data.time as number + table.time, this.data.tableNumber as number);
            }
        })
    }
}