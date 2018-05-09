const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const TournamentHelper = require('./tournament.helpers')
const applications = require('./applications')

module.exports = class TournamentsMenu {
  constructor(options) {
    const db = options.prod
      ? applications.prod.database()
      : applications.dev.database()
    this.tournamentHelper = new TournamentHelper(db)
    this.tournaments = []
  }

  async start() {
    const spinner = ora('Fetching database ...')
    spinner.start()
    try {
      this.tournaments = await this.tournamentHelper.list()
      spinner.info(
        `Currently ${chalk.blue.bold(
          this.tournaments.length
        )} tournaments in the database`
      )
    } catch (e) {
      console.log(e)
      spinner.fail('Impossible to contact the db')
      process.exit()
    }
    const tournament = await this.pickTournament()
    if (!tournament) process.exit()
    const {action} = await inquirer.prompt({
      type: 'list',
      message: 'What do you want to do ?',
      name: 'action',
      choices: [
        {value: 'delete', name: 'Delete this tournament'},
        {value: 'password', name: 'View password'},
        //{value: 'restart', name: 'Restart'},
        {value: null, name: 'Exit'},
      ],
    })
    if (!action) return process.exit()
    switch (action) {
      case 'delete':
        await this.delete(tournament)
        break
      case 'password':
        const password = await this.tournamentHelper.getPassword(tournament.key)
        console.log(
          `Password for ${tournament.name} is ${chalk.blue.bold(password)}`
        )
        break
      default:
        process.exit()
    }
    await this.start()
  }

  async pickTournament() {
    const {tournament} = await inquirer.prompt({
      type: 'list',
      message: 'Choose a tournament',
      name: 'tournament',
      choices: [
        ...this.tournaments.map((t) => ({value: t, name: t.name})),
        new inquirer.Separator(),
        {value: null, name: 'Exit'},
        new inquirer.Separator(),
      ],
    })
    return tournament
  }

  async delete(tournament) {
    const {confirmation} = await inquirer.prompt({
      name: 'confirmation',
      message: `Confirm delete of ${tournament.name} ?`,
      type: 'confirm',
    })
    if (confirmation) {
      const spinner = ora('Delete')
      spinner.start()
      try {
        await this.tournamentHelper.delete(tournament.key)
        spinner.succeed(`${tournament.name} has been deleted`)
      } catch (e) {
        spinner.fail('Delete impossible')
      }
    }
  }

  async restart(tournament) {
    console.log(`Restart ${tournament.name}`)
    await this.tournamentHelper.restart(tournament)
  }
}
