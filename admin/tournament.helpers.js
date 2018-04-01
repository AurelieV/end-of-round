class TournamentHelper {
  constructor(db) {
    this.db = db
  }

  async list() {
    const tournamentsRef = this.db.ref('tournaments')
    const snapshot = await tournamentsRef.once('value')
    const val = snapshot.val()
    const tournaments = []
    if (!val) return []
    Object.keys(val).forEach((key) => {
      tournaments.push({...val[key], key})
    })
    return tournaments
  }

  async restart(id) {
    const tablesRef = this.db.ref(`tables/${id}`)
    const snapshot = await tablesRef.once('value')
    const val = snapshot.val()
    const tables = []
    if (!val) return []
    Object.keys(val).forEach((key) => {
      tables.push({...val[key], key})
    })
    tables.forEach((table) => {
      this.db.ref(`tables/${id}/${table.key}`).set({
        number: table.number,
        time: table.time,
        teamTime: {
          A: table.teamTime.A,
          B: table.teamTime.B,
          C: table.teamTime.C,
        },
        status: '',
        teamStatus: {
          A: '',
          B: '',
          C: '',
        },
        doneTime: null,
        hasResult: false,
        result: null,
        isFeatured: false,
        zoneId: table.zoneId,
      })
    })
  }

  delete(id) {
    return this.db.ref(`tournaments/${id}`).remove()
  }
}

module.exports = TournamentHelper
