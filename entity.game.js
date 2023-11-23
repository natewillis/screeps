require('entity.spawn');

// update prototypes
Game.prototype.loadMemory = function() {

    // spawns
    for (spawn of Game.spawns){
        spawn.loadMemory()
    }

    //for (creep of Game.creeps) {
    //    creep.loadMemory()
    //}

}


Game.prototype.storeMemory = function() {

    // spawns
    for (spawn of Game.spawns){
        spawn.storeMemory()
    }

    //for (creep of Game.creeps) {
    //    creep.storeMemory()
    //}
}








module.exports = {}