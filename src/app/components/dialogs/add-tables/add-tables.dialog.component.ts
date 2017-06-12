import { Component } from '@angular/core';

@Component({
    templateUrl: './add-tables.dialog.component.html',
    styleUrls: [ './add-tables.dialog.component.scss' ]
})
export class AddTablesDialogComponent {
    title: string;
    tables: string;
}