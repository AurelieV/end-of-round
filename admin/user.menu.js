const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const UserHelper = require('./user.helpers')
const applications = require('./applications')
const {DateTime} = require('luxon')

const USER_PER_PAGE = 10
module.exports = class UserMenu {
  get filteredUsers() {
    return this.users.filter((user) => {
      if (Object.keys(this.filters).length === 0) {
        return true
      }
      if (!user.customClaims) {
        return false
      }
      let isFiltered = true
      if (this.filters.name) {
        isFiltered =
          isFiltered && user.customClaims.name.includes(this.filters.name)
      }
      if (this.filters.level) {
        isFiltered = isFiltered && user.customClaims.level == this.filters.level
      }
      if (this.filters.region) {
        isFiltered =
          isFiltered && user.customClaims.region.includes(this.filters.region)
      }
      return isFiltered
    })
  }

  get stringifiedFilters() {
    if (Object.keys(this.filters).length === 0) {
      return 'No active filter'
    } else {
      return Object.keys(this.filters)
        .map((key) => `${key} = ${this.filters[key]}`)
        .join(' // ')
    }
  }

  constructor(options) {
    const app = options.prod ? applications.prod : applications.dev
    this.userHelper = new UserHelper(app)
    this.users = []
    this.filters = {}
    this.page = 0
  }

  async start() {
    const spinner = ora('Fetching database ...')
    spinner.start()
    try {
      this.users = await this.userHelper.list()
      spinner.info(
        `Currently ${chalk.blue.bold(this.users.length)} users in the database`
      )
    } catch (e) {
      console.log(e)
      spinner.fail('Impossible to contact the db')
      process.exit()
    }
    await this.displayMainMenu()
    process.exit()
  }

  async displayMainMenu() {
    const {action} = await inquirer.prompt({
      type: 'list',
      message: 'What do you want to do ? ',
      name: 'action',
      choices: [
        {value: 'list', name: 'View users'},
        {
          value: 'filter',
          name: `Edit filters (current: ${this.stringifiedFilters})`,
        },
        {value: null, name: 'Exit'},
      ],
    })
    if (!action) return
    switch (action) {
      case 'list':
        await this.displayUsersMenu()
        await this.displayMainMenu()
        break
      case 'filter':
        await this.displayFiltersMenu()
        await this.displayMainMenu()
        break
    }
  }

  async displayUsersMenu(user = null) {
    this.page = 0
    if (!user) {
      user = await this.pickUser()
    }
    if (!user) return
    const {action} = await inquirer.prompt({
      type: 'list',
      message: `What do you want to do with ${
        user.customClaims ? user.customClaims.name : 'Unknown'
      }?`,
      name: 'action',
      choices: [
        {value: 'log', name: 'Log all the information'},
        {value: 'disconnect', name: 'Disconnect from all devices'},
        {value: null, name: 'Exit'},
      ],
    })
    if (!action) return
    switch (action) {
      case 'log':
        console.log('User', user)
        break
      case 'disconnect':
        await this.userHelper.disconnect(user.uid)
        break
    }
    await this.displayUsersMenu(user)
  }

  async displayFiltersMenu() {
    const {action} = await inquirer.prompt({
      type: 'list',
      message: `What do you want to do ? (current: ${this.stringifiedFilters})`,
      name: 'action',
      choices: [
        {value: 'filterByName', name: 'Filter by name'},
        {
          value: 'filterByLevel',
          name: `Filter by level`,
        },
        {
          value: 'filterByRegion',
          name: `Filter by region`,
        },
        {
          value: 'reset',
          name: `Reset all filters`,
        },
        {value: null, name: 'Exit'},
      ],
    })
    if (!action) return
    switch (action) {
      case 'filterByName':
        const {name} = await inquirer.prompt({
          type: 'input',
          message: 'Type your filter',
          name: 'name',
        })
        this.filters.name = name
        break
      case 'filterByLevel':
        const {level} = await inquirer.prompt({
          type: 'input',
          message: 'Type your filter',
          name: 'level',
        })
        this.filters.level = level
        break
      case 'filterByRegion':
        const {region} = await inquirer.prompt({
          type: 'input',
          message: 'Type your filter',
          name: 'region',
        })
        this.filters.region = region
        break
      default:
        this.filters = {}
        break
    }
    await this.displayUsersMenu()
  }

  formatAndPaginate(users) {
    return users
      .sort((a, b) => {
        if (a.customClaims && a.customClaims.name) {
          return a.customClaims.name.localeCompare(
            b.customClaims && b.customClaims.name
          )
        } else {
          return 1
        }
      })
      .slice(USER_PER_PAGE * this.page, USER_PER_PAGE * (this.page + 1))
      .map((user, i) => {
        let description, lastConnection
        if (user.customClaims) {
          description = `${i + this.page * USER_PER_PAGE + 1} - ${
            user.customClaims.name
          } (Lvl ${user.customClaims.level}, ${user.customClaims.region})`
        } else {
          description = 'Unknown'
        }
        if (user.metadata.lastSignInTime) {
          lastConnection = DateTime.fromRFC2822(
            user.metadata.lastSignInTime
          ).toLocaleString(DateTime.DATE_FULL)
        } else {
          lastConnection = 'Unknown'
        }
        return {
          value: user,
          name: `${description} / last connection: ${lastConnection}`,
        }
      })
  }

  async pickUser() {
    const users = this.filteredUsers
    const choices = [...this.formatAndPaginate(users), new inquirer.Separator()]
    // At least one more users to display
    if ((this.page + 1) * USER_PER_PAGE < users.length) {
      choices.push({
        value: 'next',
        name: `Next page`,
      })
    }
    if (this.page > 0) {
      choices.push({
        value: 'previous',
        name: 'Previous page',
      })
    }
    choices.push({
      value: 'filter',
      name: `Filters (current: ${this.stringifiedFilters})`,
    })
    choices.push({value: null, name: 'Exit'})
    choices.push(new inquirer.Separator())

    const {user} = await inquirer.prompt({
      type: 'list',
      message: `Choose a user (${chalk.blue.bold(users.length)} available)`,
      name: 'user',
      choices,
      pageSize: 15,
    })
    if (user === null) return
    if (user === 'next') {
      this.page++
      return await this.pickUser()
    }
    if (user === 'previous') {
      this.page--
      return await this.pickUser()
    }
    if (user === 'filter') {
      await this.displayFiltersMenu()
      return await this.pickUser()
    }
    return user
  }
}
