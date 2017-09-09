import { Component } from '@angular/core';

@Component({
    templateUrl: './add-tables.dialog.component.html',
    styleUrls: [ './add-tables.dialog.component.scss' ]
})
export class AddTablesDialogComponent {
    data: {
        tables: string;
        useWalterParsing: boolean;
    } = {
        tables: "",
        useWalterParsing: false
    };
    title: string;
    warning: string;
}