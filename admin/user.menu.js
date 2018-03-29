const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const UserHelper = require('./user.helpers')
const applications = require('./applications')
const {DateTime} = require('luxon')

module.exports = menu

async function menu(options) {
  const app = options.prod ? applications.prod : applications.dev
  const userHelper = new UserHelper(app)
  const spinner = ora('Fetching database ...')
  spinner.start()
  let users, anonymousUsers, obsoleteUsers
  try {
    users = await userHelper.list()
    anonymousUsers = users.filter((user) => user.providerData.length === 0)
    const limit = DateTime.local()
      .minus({days: 2})
      .startOf('day')
    obsoleteUsers = anonymousUsers.filter(
      (user) => DateTime.fromRFC2822(user.metadata.lastSignInTime) < limit
    )
    spinner.info(
      `Currently ${chalk.blue.bold(
        users.length
      )} users in the database, ${chalk.blue.bold(
        anonymousUsers.length
      )} anonymous accounts, ${chalk.blue.bold(
        obsoleteUsers.length
      )} obsolete ones`
    )
  } catch (e) {
    spinner.fail('Impossible to contact the db')
  }
  const {action} = await inquirer.prompt({
    type: 'list',
    message: 'What do you want to do ?',
    name: 'action',
    choices: [
      {value: 'purge', name: 'Purge the database'},
      {value: 'list', name: 'View non anonymous users'},
      {value: null, name: 'Exit'},
    ],
  })
  if (!action) return process.exit()
  switch (action) {
    case 'purge':
      const spinner = ora(
        `Delete ${chalk.blue.bold(obsoleteUsers.length)} obsolete users`
      )
      spinner.start()
      try {
        await userHelper.deleteAll(obsoleteUsers)
        spinner.succeed('All obsolete users deleted')
      } catch (e) {
        spinner.fail('Somethings go wrong')
        console.log('ERROR', e)
      }
      await menu(options)
      break
    case 'list':
      const {user} = await inquirer.prompt({
        type: 'list',
        message: 'Choose a user',
        name: 'user',
        choices: [
          ...users.filter((u) => u.providerData.length > 0).map((user) => ({
            value: user,
            name: `${user.email} (${user.displayName})`,
          })),
          new inquirer.Separator(),
          {value: null, name: 'Exit'},
        ],
      })
  }
  process.exit()
}
