#! /usr/bin/env node
'use strict'
const commander = require('commander');
const cli = require('../')(commander);
const log = console.log;


/*
 * NERD CLI
 * ===============================
 *
 */


log('NERD BIN')
commander
   .version(require('../package.json').version)
   .option('-t, --template <engine>')

commander.on('--help', function(){
  log('  Examples:');
  log('');
  log('    make-component Post');
  log('    make-component Post -t crud');
  log('');
});

commander    
    .command('make-component <name> [optional]')
    .description('Create new container')    
    .action(cli.mkComponent)

commander.parse(process.argv);
