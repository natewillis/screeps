var planner = require('planner');
require('entity.game');

module.exports.loop = function () {
    
	// load memory if needed
	Game.loadMemory();

	// update plans
    planner.plan();

	// store memory
	Game.storeMemory();

	// list cpu usage
	console.log('cpu usage is ' + Game.cpu.getUsed())

}