require('utils.prototypes');

function pathKey(startPos, endPos) {
    return [startPos.roomName,startPos.x,startPos.y,endPos.roomName,endPos.x,endPos.y].join('-')
}

function getPath(originPos,goalPos) {
    var myPathKey = pathKey(originPos,goalPos);
    if (!('paths' in Memory)) {
        Memory.paths = {}
    }
    if (!(myPathKey in Memory.paths)) {
        var retypeOrigin = coerceRoomPosition(originPos);
        var retypeGoal = coerceRoomPosition(goalPos);
        console.log('creating path from ' + retypeOrigin.logString() + ' to ' + retypeGoal.logString());
        var pathFinderReturn = PathFinder.search(retypeOrigin, retypeGoal); 
        console.log(pathFinderReturn);
        Memory.paths[myPathKey] = pathFinderReturn.path;
        //console.log(Game.rooms[originPos.roomName].name);
        //Memory.paths[myPathKey] = Game.rooms[originPos.roomName].findPath(new RoomPosition(originPos.x, originPos.y, originPos.roomName), new RoomPosition(goalPos.x, goalPos.y, goalPos.roomName), {ignoreCreeps: true, serialize: true});
    }
    return Memory.paths[myPathKey];
}

function moveAlongPath(creep, path, target) {

    var moveReturn = ERR_NOT_FOUND;
    if (path !== null) {
        moveReturn = creep.moveByPath(path);
    }
    if (moveReturn !== OK) {
        if (path.length > 0) {
            var endPos = coerceRoomPosition(path[path.length-1]);
            //console.log(creep.name + ' resorting to move to ' + endPos.logString());
            var moveToReturn = creep.moveTo(endPos);
            if (moveToReturn !== OK) {
                console.log(creep.name + ' couldnt move to endpos so is moving to target');
                return creep.moveTo(target);
            } else {
                return moveToReturn;
            }
        } else {
            console.log(creep.name + ' bad path!');
            return ERR_NO_PATH;
        }
        
    } else {
        return moveReturn;
    }
}

function getValidWorkLocations(target) {
    if (!('workLocations' in Memory)) {
        Memory.workLocations = {}
    }
    var targetId = '';
    if ('id' in target) {
        targetId = target.id;
    } else {
        targetId = target.name;
    }
    if (!(target.id in Memory.workLocations)) {
        var myWorkLocations = [];
        var roomTerrain = Game.map.getRoomTerrain(target.pos.roomName);
        for (let deltaX = -1; deltaX<=1; deltaX++) {
            for (let deltaY = -1; deltaY<=1; deltaY++) {
                let x = target.pos.x + deltaX;
                let y = target.pos.y + deltaY;
                if ( deltaX !== 0 || deltaY !== 0 ) {
                    if (roomTerrain.get(x, y) == 0) {
                        myWorkLocations.push(new RoomPosition(x, y, target.pos.roomName));
                    }
                }
            }
        }
        Memory.workLocations[target.id] = myWorkLocations;
    }
    return Memory.workLocations[target.id];
}

function getEnergyFromSource(creep, source) {
    if ('structureType' in source) {
        return creep.withdraw(source, RESOURCE_ENERGY)
    } else {
        return creep.harvest(source)
    }
}

function coerceRoomPosition(posLikeObject) {
    return new RoomPosition(posLikeObject.x, posLikeObject.y, posLikeObject.roomName);
}

function createSequentialTargetLocationArray(targets, forContainerDeposit = false) {
    
    var returnArray = [];
    for (var targetIndex in targets) {
        var target = targets[targetIndex];
        var validWorkLocations = getValidWorkLocations(target);
        var currentEnergy = 100000;
        if (forContainerDeposit) {
            if ('structureType' in target) {
                currentEnergy = target.store.getFreeCapacity(RESOURCE_ENERGY);
            }
        }
        for (var validWorkLocationIndex in validWorkLocations) {

            // valid calcs if needed
            var validLocation = true;
            if (forContainerDeposit) {
                var validLocation = false;
                if (currentEnergy>0) {
                    validLocation = true;
                }
            } else {
                validLocation = true;
            }

            if (validLocation) {

                // valid calcs
                if (forContainerDeposit) {
                    currentEnergy = currentEnergy - 100;
                }

                // create location
                var validWorkLocation = validWorkLocations[validWorkLocationIndex];
                returnArray.push({
                    'workLocation': validWorkLocation,
                    'target': target
                })
            }
            
        }
    }
    return returnArray;
    
}

module.exports = { getPath, moveAlongPath, getValidWorkLocations, getEnergyFromSource, coerceRoomPosition,createSequentialTargetLocationArray };