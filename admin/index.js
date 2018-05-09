#!/usr/bin/env node
const commander = require('commander')
const TournamentMenu = require('./tournament.menu')
const UserMenu = require('./user.menu')

commander.version('0.1.0')
commander
  .command('tournaments')
  .alias('t')
  .option('-p, --prod', 'Use production environnement')
  .action((options) => {
    const tournamentMenu = new TournamentMenu(options)
    tournamentMenu.start()
  })

commander
  .command('users')
  .alias('u')
  .option('-l, --list', 'List all users', {isDefault: true})
  .option('-p, --prod', 'Use production environnement')
  .action((options) => {
    const userMenu = new UserMenu(options)
    userMenu.start()
  })

commander.parse(process.argv)
