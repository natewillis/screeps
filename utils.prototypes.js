var _ = require('lodash');
var utils = require("utils");

// Prototypes - Room Position
RoomPosition.prototype.logString = function() {
    return ['room:' + this.roomName, 'x:' + this.x, 'y:' + this.y].join(' ')
}

// Prototypes - Room
Room.prototype.ticMemory = {}

Room.prototype.resetTicMemory = function() {
    this.ticMemory = {}
}

Room.prototype.containers = function() {

    // containers
    if (!('containers' in this.ticMemory)) {
        console.log('creating contiainers in room cache');
        this.ticMemory.containers = this.find(FIND_STRUCTURES, {
            filter: function(object) {
                return object.structureType == STRUCTURE_CONTAINER
            }
        });
    }
    return this.ticMemory.containers;

}

Room.prototype.containers_with_room = function(){

    return _.filter(this.containers(), function(container) {
        return container.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });

}

Room.prototype.containers_with_energy = function(){

    return _.sortBy(
            _.filter(this.containers(), function(container) {
                return container.store.getUsedCapacity(RESOURCE_ENERGY) > 100
            }),
        [(storage) => storage.store[RESOURCE_ENERGY]], ['desc']);


}

Room.prototype.energy_sources = function() {
    return this.find(FIND_SOURCES);
}

Room.prototype.structures_needing_energy = function() {
    return this.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
}

Room.prototype.resetWorkLocationReservations = function() {
    if (('workLocationReservations' in this.memory)) {
        delete this.memory.workLocationReservations; 
    }
}

Room.prototype.reserveWorkLocation = function(creep, workLocation) {
    if (!('workLocationReservations' in this.memory)) {
        this.memory['workLocationReservations'] = {}
    }
    if (utils.coerceRoomPosition(workLocation).logString() in this.memory.workLocationReservations) {
        return false;
    } else {
        this.memory.workLocationReservations[utils.coerceRoomPosition(workLocation).logString()] = creep.name;
        return true;
    }
}


module.exports = {}; 