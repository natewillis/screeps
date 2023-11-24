
// update prototypes
Game.prototype.loadMemory = function() {

    // spawns
    for (spawn of Game.spawns){
        spawn.loadMemory()
    }

}


Game.prototype.storeMemory = function() {

    // spawns
    for (spawn of Game.spawns){
        spawn.storeMemory()
    }

}








module.export = {}