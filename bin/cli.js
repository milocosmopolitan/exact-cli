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


log('EXACT CLI')
commander
   .version(require('../package.json').version)
   .option('-t, --template <name>')
   

commander.on('--help', function(){
  log('  Examples:');
  log('');
  log('    make-component Post');
  log('    make-component Post -t crud');
  log('');
});

commander
    .command('init [optional]')
    .description('Create new project')
    .action((optional)=>{
      log('init')      
      log(optional)
    })

commander    
    .command('make-component <name> [optional]')
    .description('Create new container')    
    .action(cli.mkComponent)

commander.parse(process.argv);
