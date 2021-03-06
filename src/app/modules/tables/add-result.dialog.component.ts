import {Result, Table} from './../tournament/tournament.service'
import {Component} from '@angular/core'

@Component({
  templateUrl: './add-result.dialog.component.html',
  styleUrls: ['./add-result.dialog.component.scss'],
})
export class AddResultDialogComponent {
  result: Result = {
    player1: {
      score: 0,
      drop: false,
    },
    player2: {
      score: 0,
      drop: false,
    },
    draw: 0,
  }
  tableId: string
  table: Table
  displayTable: boolean = true

  setTableId(id: string) {
    this.displayTable = false
    this.tableId = id
  }

  incrementScore(id: 2 | 1) {
    this.result[`player${id}`].score++
  }

  decrementScore(id: 2 | 1) {
    this.result[`player${id}`].score--
  }

  incrementDraw() {
    this.result.draw++
  }

  decrementDraw() {
    this.result.draw--
  }
}
