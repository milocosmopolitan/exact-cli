'use strict';
const chalk = require('chalk');

module.exports = {
	red: function(string, option){
		let message = option && option.fill ? 
									chalk.bgRed(chalk.white(` ${string} `)) : 
									chalk.red(` ${string} `);

		console.log(message);
	},
	green: function(string, option){
		let message = option && option.fill ? 
									chalk.bgGreen(chalk.white(` ${string} `)) : 
									chalk.green(` ${string} `);

		console.log(message);
	},
}

