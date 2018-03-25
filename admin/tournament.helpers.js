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

  delete(id) {
    return this.db.ref(`tournaments/${id}`).remove()
  }
}

module.exports = TournamentHelper
