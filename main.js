var planner = require('planner');
require('entity.spawn');

module.exports.loop = function () {
    
	// load memory if needed
	loadMemory();

	// update plans
    planner.plan();

	// store memory
	storeMemory();

	// list cpu usage
	console.log('cpu usage is ' + Game.cpu.getUsed())

}

loadMemory = function() {

    // spawns
    for (const spawn of Object.values(Game.spawns)){
        spawn.loadMemory()
    }

}

storeMemory = function() {

    // spawns
    for (const spawn of Object.values(Game.spawns)){
        spawn.storeMemory()
    }

}