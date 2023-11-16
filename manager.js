var _ = require('lodash');
var TaskHarvest = require('task.harvest');
var TaskUpgrade = require('task.upgrade');
var TaskBuild = require('task.build');
var TaskRepair = require('task.repair');
var TaskTruck = require('task.truck');
var TaskIdle = require('task.idle');
var utils = require("utils");


function runManager() {

    // clear old memory
    clearUnusedMemory();

    // spawn logic
    spawnLogic();

    // task logic
    var tasks = getNeededTasks();
    console.log('colony needs to run ' + Object.keys(tasks).length + ' tasks');
    assignTasks(tasks);
    runTasks(tasks);
    
}

function clearUnusedMemory() {
    for(var name in Memory.creeps) {
        if(!(name in Game.creeps)) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }    
}

function spawnLogic() {
    for (var spawnName in Game.spawns) {
        var spawn = Game.spawns[spawnName];
        if(spawn.store.getUsedCapacity(RESOURCE_ENERGY) >= 300) {
            var number = 1;
            var newName = spawn.name + ' ' + number;
            while (newName in Game.creeps) {
                number++;
                newName = spawn.name + number;
            }
            spawn.spawnCreep([WORK,CARRY,CARRY,MOVE,MOVE],newName,{memory:{role: 'worker', task: null}});
        }
    }
}

function runTasks(tasks) {
    for (var taskKey in tasks) {
        var task = tasks[taskKey];
        task.runTask()
    }
}

function assignTasks(tasks) {

    // second iteration for assigning creeps to their current tasks
    var unassignedCreeps = [];
    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (!('task' in creep.memory)) {
            creep.memory['task'] = null;
        }
        if (creep.memory.task !== null) {
            
            if (creep.memory.task.key in tasks) {
                var task = tasks[creep.memory.task.key];
                if (task.needsCreeps()) {
                    task.continueCreep(creep);
                } else {
                    console.log(creep.name + ' does not need to do task ' + creep.memory.task.key);
                    creep.memory.task = null;
                    unassignedCreeps.push(creep);
                }
            } else {
                console.log(creep.memory.task.key + ' is not a valid task for ' + creep.name);
                creep.memory.task = null;
                unassignedCreeps.push(creep);
            }
        } else {
            unassignedCreeps.push(creep);
        }
    }

    // third iteration for assigning unassigned creeps to needed tasks
    for (var taskIndex in tasks) {
        var task = tasks[taskIndex];
        while (task.needsCreeps() && unassignedCreeps.length > 0) {
            console.log('new assignment of creep ' + creep.name + ' to task ' + task.taskKey());
            task.assignCreep(unassignedCreeps.shift())
        }
    }

    

}

function getNeededTasks(){

    var tasks = {};

    for (var roomName in Game.rooms) {

        // get room
        var room = Game.rooms[roomName];

        // all storages
        var all_storages = room.find(FIND_STRUCTURES, {
            filter: function(object) {
                return object.structureType == STRUCTURE_CONTAINER
            }
        });

        // check for energy storage
        var storages_with_room = room.find(FIND_STRUCTURES, {
            filter: function(object) {
                return object.structureType == STRUCTURE_CONTAINER &&
                object.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            }
        });
        //console.log(storages_with_room.length + ' storages with room');

        // storages with energy
        var unsorted_storages_with_energy= room.find(FIND_STRUCTURES, {
            filter: function(object) {
                return object.structureType == STRUCTURE_CONTAINER &&
                object.store.getUsedCapacity(RESOURCE_ENERGY) > 100
            }
        });
        //console.log(unsorted_storages_with_energy.length + ' storages with energy');
        var storages_with_energy = _.sortBy(unsorted_storages_with_energy, [(storage) => storage.store[RESOURCE_ENERGY]], ['desc']);
        console.log(storages_with_energy.length + ' storages with energy');

        // get energy sources
        var sources = room.find(FIND_SOURCES, {
            filter: (source) => {
                return (source.id !== '70f9e8c0d2719f4653bad062')
            }
        });

        // Harvest
        var targets = [];
        if (all_storages.length > 0 ) {
            targets = storages_with_room;
        } else {
            targets = room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
        }
        
        for (var targetIndex in targets) {

            var target = targets[targetIndex];
            var targetWorkLocation = utils.getValidWorkLocations(target)[0];
            var amountNeeded = target.store.getFreeCapacity(RESOURCE_ENERGY) 
            var maxTasksForTarget = Math.ceil(amountNeeded/100);
            var currentAssignedToTarget = 0;
            console.log('we need ' + maxTasksForTarget + ' to fill ' + target.id);

            for (var sourceIndex in sources) {
                
                var source = sources[sourceIndex];
                var sourceWorkLocations = utils.getValidWorkLocations(source);
                for (var sourceWorkLocationIndex in sourceWorkLocations) {
                    if (currentAssignedToTarget<maxTasksForTarget) {
                        currentAssignedToTarget++;
                        var sourceWorkLocation = sourceWorkLocations[sourceWorkLocationIndex];
                    
                        var harvestTask = new TaskHarvest(source, sourceWorkLocation, target, targetWorkLocation);
                        tasks[harvestTask.taskKey()] = harvestTask;
                    }
                }
                
            }
        }

        // Build
        var energy_sources = storages_with_energy;
        if (all_storages.length == 0) {
            energy_sources = sources;
        }
        // extract variable
        if (energy_sources.length>0) {
            var source = energy_sources[0];
            var sourceWorkLocation = utils.getValidWorkLocations(source)[0];
            var targets = room.find(FIND_CONSTRUCTION_SITES);

            // loop through targets
            for (var targetIndex in targets) {

                // extract variable
                var target = targets[targetIndex];
                var targetWorkLocations = utils.getValidWorkLocations(target);

                // loop through locations
                for (var workLocationIndex in targetWorkLocations) {

                    // extract variable
                    var targetWorkLocation = targetWorkLocations[workLocationIndex];

                    // build
                    var buildTask = new TaskBuild(source, sourceWorkLocation, target, targetWorkLocation);
                    tasks[buildTask.taskKey()] = buildTask;
                }
            }
        }
        

        // repair
        var energy_sources = storages_with_energy;
        if (all_storages.length == 0) {
            energy_sources = sources;
        }
        if (energy_sources.length>0) {
            var targets = room.find(FIND_STRUCTURES, {
                filter: function(object) {
                    return object.structureType == STRUCTURE_CONTAINER &&
                    object.hits < object.hitsMax;
                }
            });
            for (var targetIndex in targets) {
    
                // extract variable
                var source = energy_sources[0];
                var sourceWorkLocation = utils.getValidWorkLocations(source)[0];
                var target = targets[targetIndex];
                var targetWorkLocation = utils.getValidWorkLocations(target)[0];
    
                // build
                var repairTask = new TaskRepair(source, sourceWorkLocation, target, targetWorkLocation);
                tasks[repairTask.taskKey()] = repairTask;
    
            }
        }
        

        // Truck
        var energy_sources = storages_with_energy;
        var targets = room.find(FIND_MY_SPAWNS, {
            filter: (structure) => {
                return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (targets.length > 0 && energy_sources.length>0) {
            var target = targets[0];
            var targetWorkLocations = utils.getValidWorkLocations(target);

            // extract variable
            var source = energy_sources[0];
            var sourceWorkLocation = utils.getValidWorkLocations(source)[0];
            var targetWorkLocation = targetWorkLocations[0];

            // truck
            var truckTask = new TaskTruck(source, sourceWorkLocation, target, targetWorkLocation);
            tasks[truckTask.taskKey()] = truckTask;

        } else {
            console.log(' no spawns with needs');
        }

        // Upgrade
        var energy_sources = storages_with_energy;
        if (all_storages.length == 0) {
            energy_sources = sources;
        }

        var target = room.controller;
        var targetWorkLocations = utils.getValidWorkLocations(target);

        for (var sourceIndex in energy_sources) {

            // extract variable
            var source = energy_sources[sourceIndex];
            var sourceWorkLocation = utils.getValidWorkLocations(source)[0];

            // loop through locations
            for (var workLocationIndex in targetWorkLocations) {

                // extract variable
                var targetWorkLocation = targetWorkLocations[workLocationIndex];

                // upgrade
                var upgradeTask = new TaskUpgrade(source, sourceWorkLocation, target, targetWorkLocation);
                tasks[upgradeTask.taskKey()] = upgradeTask;

            }

        }

        
        

        // idle
        var target = Game.flags['idle'];
        var energy_sources = storages_with_energy;
        if (all_storages.length == 0) {
            energy_sources = sources;
        }
        for (var sourceIndex in energy_sources) {
            // extract variable
            var source = energy_sources[sourceIndex];
            var sourceWorkLocation = utils.getValidWorkLocations(source)[0];
            var targetWorkLocation = utils.getValidWorkLocations(target)[0];

            // idle
            var idleTask = new TaskIdle(source, sourceWorkLocation, target, targetWorkLocation);
            tasks[idleTask.taskKey()] = idleTask;

        }

        return tasks;
    }

    

}

function creepCreation() {
    have = assessCurrentCreepRoles();
    need = assessNeededCreepRoles();
}

function assessNeededCreepRoles() {
    return {
        'harvester': { 
            'need': 1,
        },
        'upgrader': { 
            'need': 1,
        },
    }
}

function assessCurrentCreepRoles(){
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        counts = {

        }
        if (!(creep.memory.role in counts)) {
            counts[creep.memory.role] = 1
        } else {
            counts[creep.memory.role]++
        }
    }
}


module.exports = { runManager };