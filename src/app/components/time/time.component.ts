import { Component } from '@angular/core';

interface TimeData {
    time: null | number;
    tableNumber: null | number;
}

@Component({
    selector: 'time',
    styleUrls: [ 'time.component.scss' ],
    templateUrl: 'time.component.html'
})
export class TimeComponent {
    start: number;
    end: number;
    data: TimeData = {
        time: null,
        tableNumber: null
    };
}