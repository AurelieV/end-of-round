import { Component, Input, OnChanges, HostBinding } from '@angular/core';

import { Table, TablesInformation, Zone } from '../../model';


@Component({
    selector: 'zone-info',
    templateUrl: './zone-info.component.html',
    styleUrls: [ './zone-info.component.scss' ]
})
export class ZoneInfoComponent implements OnChanges {
    @Input() zone: any;
    @Input() tables: Table[];
    tablesInformation: TablesInformation;
    extraTimeTables: Table[] = [];

    @HostBinding("class.need-help") get needHelp() {
        return this.zone.needHelp;
    }

    ngOnChanges() {
        const tables = (this.tables || []).filter(t => +(t as any).$key >= this.zone.start && +(t as any).$key <= this.zone.end);
        this.extraTimeTables = (tables || []).filter(t => t.time > 0 && t.status !== "done");
        this.tablesInformation = {
            playing: tables.filter(t => t.status === "playing").length,
            covered: tables.filter(t => t.status === "covered").length,
            extraTimed: this.extraTimeTables.length
        }
    }
}