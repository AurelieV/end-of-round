import { Component, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

import { Table } from '../../model';

@Component({
    selector: 'tables-info',
    templateUrl: './tables-info.component.html',
    styleUrls: [ 'tables-info.component.scss' ]
})
export class TablesInfoComponent {
    @Input() tables: Table[];

    constructor(private db: AngularFireDatabase) {}

    setHasResult(id: string, hasResult: boolean) {
        this.db.object('/vegas/tables/' + id).update({ hasResult });
    }
}