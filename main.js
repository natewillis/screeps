var utils = require("utils");
var manager = require('manager');
require('./utils.prototypes');

module.exports.loop = function () {
    
    manager.runManager();

	// list cpu usage
	console.log('cpu usage is ' + Game.cpu.getUsed())

}