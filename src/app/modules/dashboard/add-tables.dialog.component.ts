import { Component } from '@angular/core';

@Component({
    templateUrl: './add-tables.dialog.component.html',
    styleUrls: [ './add-tables.dialog.component.scss' ]
})
export class AddTablesDialogComponent {
    data: {
        tables: string;
        useWalterParsing: boolean;
        replaceExisting: boolean;
    } = {
        tables: "",
        useWalterParsing: false,
        replaceExisting: false
    };
    title: string;
    warning: string;
}