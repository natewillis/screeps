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
        this.creeps.push(creep);
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