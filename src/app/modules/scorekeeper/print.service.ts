import {Injectable} from '@angular/core'

import * as jspdf from 'jspdf'
import {
  TournamentService,
  Tournament,
  CoveredTable,
} from '../tournament/tournament.service'

@Injectable()
export class Printer {
  constructor() {}

  print(tournament: Tournament, tables: CoveredTable[], round: number) {
    const pdf = new jspdf()
    pdf.setFontSize(10)
    const initialX = 10

    let x = initialX
    let y = 10

    tables.forEach((table, i) => {
      // First line
      pdf.text(x, y, tournament.name)

      // Second line
      y += 8
      x = initialX
      pdf.text(x, y, 'Penality')
      x += 50
      pdf.text(x, y, `Round #${round}`)
      x += 75
      pdf.text(x, y, `Table ${table.number}`)

      // Third line
      y += 6
      x = initialX
      x += 125
      pdf.text(x, y, '#Wins')
      x += 20
      pdf.text(x, y, '#Draws')
      x += 25
      pdf.text(x, y, 'Drop?')

      // Fourth Line
      y += 4
      x = initialX
      x += 5
      pdf.circle(x, y + 4, 4)
      x += 10
      pdf.text(
        x,
        y,
        `${table.coverage.player1} (${table.coverage.player1Score})`
      )

      // Fifth line
      y += 10
      x = initialX
      x += 15
      pdf.text(x, y, 'Sign')
      x += 10
      pdf.lines([[50, 0]], x, y)
      x += 100
      pdf.lines([[10, 0]], x, y)
      x += 45
      pdf.rect(x, y - 10, 12, 10)

      // Sixth line
      y += 4
      x = initialX
      x += 145
      pdf.lines([[10, 0]], x, y + 5)

      // Seventh line
      y += 4
      x = initialX
      x += 5
      pdf.circle(x, y + 4, 4)
      x += 10
      pdf.text(
        x,
        y,
        `${table.coverage.player2} (${table.coverage.player2Score})`
      )

      // Height line
      y += 10
      x = initialX
      x += 15
      pdf.text(x, y, 'Sign')
      x += 10
      pdf.lines([[50, 0]], x, y)
      x += 100
      pdf.lines([[10, 0]], x, y)
      x += 45
      pdf.rect(x, y - 10, 12, 10)

      if ((i + 1) % 4 === 0 && i !== tables.length - 1) {
        pdf.addPage()
        y = 10
      } else {
        y += 20
      }
      x = initialX
    })

    window.open(pdf.output('bloburl'), '_blank')
  }
}
