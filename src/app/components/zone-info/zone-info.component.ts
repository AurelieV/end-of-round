import { Component, Input, OnChanges } from '@angular/core';

import { Table } from '../../model';


@Component({
    selector: 'zone-info',
    templateUrl: './zone-info.component.html',
    styleUrls: [ './zone-info.component.scss' ]
})
export class ZoneInfoComponent implements OnChanges {
    @Input() zone: any;
    @Input() tables: Table[];
    playingTableNumber: number;
    coveredTableNumber: number;
    extraTimeTables: Table[] = [];

    ngOnChanges() {
        const tables = (this.tables || []).filter(t => +(t as any).$key >= this.zone.start && +(t as any).$key <= this.zone.end);
        this.playingTableNumber = (tables || []).filter(t => t.status === "playing").length;
        this.coveredTableNumber = (tables || []).filter(t => t.status === "covered").length;
        this.extraTimeTables = (tables || []).filter(t => t.time > 0);
    }
}