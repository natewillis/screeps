var { EntityState, StoreState, StateQueue } = require('entity.js');
// Classes

class CreepState extends EntityState {

    constructor(tic, x, y, roomName, energy, hits, fatigue, spawning, nextAction) {
        super(tic);
        this.RoomPosition = new this.RoomPosition(x, y, roomName);
        this.StoreState = StoreState(energy);
        this.hits = hits;
        this.fatigue = fatigue;
        this.spawning = spawning;
        this.nextAction = nextAction;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...this.StoreState.toJSON(), 
            x: this.RoomPosition.x,
            y: this.RoomPosition.y,
            roomName: this.RoomPosition.roomName,
            hits: this.hits,
            fatigue: this.fatigue,
            spawning: this.spawning,
            nextAction: this.nextAction
        }
    }

    static fromJSON(json) {
        const data = JSON.parse(json);
        return new CreepState(
            data.tic,
            data.x,
            data.y,
            data.roomName,
            data.energy,
            data.hits,
            data.fatigue,
            data.spawning,
            data.nextAction
        );
    }



}


// Prototypes
Creep.prototype.loadMemory = function() {

    // StateQueue
    if (!('StateQueue' in this)) {
        if ('stateQueue' in this.memory) {
            this.StateQueue = StateQueue.fromJSON(this.memory.stateQueue);
        } else {
            this.StateQueue = new StateQueue;
        }
    }

}

Creep.prototype.storeMemory = function() {

    // StateQueue
    if (!('StateQueue' in this)) {
        this.StateQueue = new StateQueue;
    }
    this.memory.stateQueue = this.StateQueue.toJSON();

}

modules.export = {}