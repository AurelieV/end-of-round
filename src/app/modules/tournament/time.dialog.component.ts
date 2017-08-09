import { Component } from '@angular/core';

interface TimeData {
    time: null | number;
    tableNumber: null | number;
}

@Component({
    templateUrl: 'time.dialog.component.html'
})
export class TimeDialogComponent {
    data: TimeData = {
        time: null,
        tableNumber: null
    };
}