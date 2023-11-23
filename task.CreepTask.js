var utils = require("utils");
require('utils.prototypes');

class TaskCreepTask {

    constructor() {
        this.creeps = [];
        this.neededCreeps = 1
        this.creepRole = 'worker';
        this.taskType = 'unknown'
    }

    needsCreeps() {
        return (this.creeps.length < this.neededCreeps)
    }

    /** @param {Creep} creep **/
    assignCreep(creep) {

        // add creep to tracked array
        this.creeps.push(creep);

        // figure out which target work location we can grab
        var possibleWorkLocations = utils.getValidWorkLocations(this.target);
        var targetWorkLocation = null;
        var currentWorkLocationIndex = 0;
        while (targetWorkLocation === null && currentWorkLocationIndex < (possibleWorkLocations.length-1)) {
            var possibleWorkLocation = utils.coerceRoomPosition(possibleWorkLocations[currentWorkLocationIndex]);
            if (Game.rooms[target.pos.roomName].reserveWorkLocation(currentWorkLocationIndex)) {
                targetWorkLocation = possibleWorkLocation;
            }
            currentWorkLocationIndex++;
        }
        if (targetWorkLocation === null) {
            return false;
        }

        // figure out the source and source work location
        var sourceWorkLocation = null;
        var source = null;
        var sourceIndex = 0;
        while (source == null && sourceIndex <= (this.sources.length-1))

        // figure out 

        creep.memory.task = {
            key: this.taskKey(),
            startPos: creep.pos
        }
    }

    continueCreep(creep) {
        this.creeps.push(creep);
    }

    visualizeCreep(creep, targetPos) {
        creep.room.visual.text(this.taskType + '\n' + targetPos.x + ',' + targetPos.y, creep.pos.x, creep.pos.y,{
            font: 0.3,
            opacity: 0.7
        });
    }

};

module.exports = TaskCreepTask;