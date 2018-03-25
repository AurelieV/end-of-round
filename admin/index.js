#!/usr/bin/env node
const commander = require('commander')
const tournamentsMenu = require('./tournament.menu')

commander.version('0.1.0')
commander
  .command('tournaments')
  .alias('t')
  .option('-p, --prod', 'Use production environnement')
  .action((options) => {
    tournamentsMenu(options)
  })

commander
  .command('users')
  .alias('u')
  .option('-l, --list', 'List all users', {isDefault: true})
  .action((options) => {
    usersMenu(options)
  })

commander.parse(process.argv)

async function usersMenu(options) {
  console.log('users', options)
}
