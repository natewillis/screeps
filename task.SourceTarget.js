var utils = require("utils");
require('utils.prototypes');
var TaskCreepTask = require('task.CreepTask')

class TaskSourceTarget extends TaskCreepTask {

    constructor(source, sourceWorkLocation, target, targetWorkLocation) {
        super();
        this.source = source;
        this.sourceWorkLocation = utils.coerceRoomPosition(sourceWorkLocation);
        this.target = target;
        this.targetWorkLocation = utils.coerceRoomPosition(targetWorkLocation);
        this.taskType = 'unknown'
    }

    taskKey() {
        return [this.taskType, this.source.id, this.sourceWorkLocation.x,this.sourceWorkLocation.y ,this.target.id, this.targetWorkLocation.x, this.targetWorkLocation.y].join('-');
    }

    runTask() {
        
        for (var creepIndex in this.creeps) {

            // get creep variable
            var creep = this.creeps[creepIndex];

            // get define getting energy flag if needed
            if (!('gettingEnergy' in creep.memory.task)) {
                creep.memory.task.gettingEnergy = true;
            }

            // getting energy logic
            if(creep.memory.task.gettingEnergy) {
                if (creep.store.getFreeCapacity() == 0) {
                    creep.memory.task.gettingEnergy = false;
                } else {
                    if (!creep.pos.isEqualTo(this.sourceWorkLocation)) {
                        var path = utils.getPath(creep.memory.task.startPos, this.sourceWorkLocation);
                        var moveReturn = utils.moveAlongPath(creep, path, this.source);
                    }
                    if (creep.pos.inRangeTo(this.source, 1)) {
                        utils.getEnergyFromSource(creep, this.source);
                    }
                }

            // work on target logic
            } else {
                if (creep.store[RESOURCE_ENERGY] == 0) {
                    creep.memory.task = null;
                } else {
                    if (!creep.pos.isEqualTo(this.targetWorkLocation)) {
                        var path = utils.getPath(this.sourceWorkLocation, this.targetWorkLocation);
                        utils.moveAlongPath(creep, path, this.target);
                    }
                    if (creep.pos.inRangeTo(this.target,1)) {
                        switch (this.taskType) {
                            case 'build':
                                creep.build(this.target);
                                break;
                            case 'repair':
                                creep.repair(this.target);
                                break;
                            case 'upgrade':
                                creep.upgradeController(this.target);
                                break;
                            case 'idle':
                                creep.memory.task = null;
                                break;
                            case 'harvest':
                                creep.transfer(this.target, RESOURCE_ENERGY);
                                break;
                            case 'truck':
                                creep.transfer(this.target, RESOURCE_ENERGY);
                                break;
                        }
                    }
                }
            }

            // visualization
            if (creep.memory.task !== null) {
                if (creep.memory.task.gettingEnergy) {
                    this.visualizeCreep(creep,this.sourceWorkLocation);
                } else {
                    this.visualizeCreep(creep,this.targetWorkLocation);
                }
            }

        }
    }

};

module.exports = TaskSourceTarget;