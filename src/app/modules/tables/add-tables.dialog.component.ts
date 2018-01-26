import {Component} from '@angular/core'

@Component({
  templateUrl: './add-tables.dialog.component.html',
  styleUrls: ['./add-tables.dialog.component.scss'],
})
export class AddTablesDialogComponent {
  data: {
    tables: string
    useWalterParsing: boolean
    replaceExisting: boolean
  } = {
    tables: '',
    useWalterParsing: false,
    replaceExisting: false,
  }
  title: string
  warning: string
  displayOptions: boolean = true

  formatData(data) {
    let tables = data.tables
    if (data.useWalterParsing) {
      const parsed = window['Papa'].parse(data.tables, {
        header: true,
      })
      tables = parsed.data
        .map((d) => d['Table'])
        .filter((t) => !isNaN(Number(t)))
        .join(' ')
    }
    return {
      tables: tables.match(/(\d+)/g) || [],
      replaceExisting: data.replaceExisting,
    }
  }
}
