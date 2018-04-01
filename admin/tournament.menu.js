const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const TournamentHelper = require('./tournament.helpers')
const applications = require('./applications')

module.exports = menu

async function menu(options) {
  const db = options.prod
    ? applications.prod.database()
    : applications.dev.database()
  const tournamentHelper = new TournamentHelper(db)
  const spinner = ora('Fetching database ...')
  spinner.start()
  let tournaments
  try {
    tournaments = await tournamentHelper.list()
    spinner.info(
      `Currently ${chalk.blue.bold(
        tournaments.length
      )} tournaments in the database`
    )
  } catch (e) {
    spinner.fail('Impossible to contact the db')
  }
  const {tournament} = await inquirer.prompt({
    type: 'list',
    message: 'Choose a tournament',
    name: 'tournament',
    choices: [
      ...tournaments.map((t) => ({value: t, name: t.name})),
      new inquirer.Separator(),
      {value: null, name: 'Exit'},
    ],
  })
  if (!tournament) process.exit()
  const {action} = await inquirer.prompt({
    type: 'list',
    message: 'What do you want to do ?',
    name: 'action',
    choices: [
      {value: 'delete', name: 'Delete this tournament'},
      {value: 'detail', name: 'View more information'},
      {value: 'restart', name: 'Restart'},
    ],
  })
  if (!action) return process.exit()
  switch (action) {
    case 'delete':
      const {confirmation} = await inquirer.prompt({
        name: 'confirmation',
        message: `Confirm delete of ${tournament.name} ?`,
        type: 'confirm',
      })
      if (confirmation) {
        const spinner = ora('Delete')
        spinner.start()
        try {
          await tournamentHelper.delete(tournament.key)
          spinner.succeed(`${tournament.name} has been deleted`)
        } catch (e) {
          spinner.fail('Delete impossible')
        }
      }
      break
    case 'detail':
      console.log(chalk.bold.blue('Name: '), tournament.name)
      console.log(
        chalk.bold.blue('Range'),
        `${tournament.start}-${tournament.end}`
      )
      break
    case 'restart':
      console.log(`Restart ${tournament.name}`)
      await tournamentHelper.restart(tournament)
    default:
      process.exit()
  }
  menu(options)
}
