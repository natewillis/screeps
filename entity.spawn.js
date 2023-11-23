// require
var { EntityState, StoreState, StateQueue } = require('entity.js');


// ACTIONS



class SpawnState extends EntityState {

    constructor(tic, energy, hits, spawning, nextAction) {
        super(tic);
        this.StoreState = StoreState(energy);
        this.hits = hits;
        this.spawning = spawning;
        this.nextAction = nextAction;
    }

    toJSON() {
        return {
            ...super.toJSON(),
            ...this.StoreState.toJSON(), 
            hits: this.hits,
            spawning: this.spawning,
            nextAction: this.nextAction
        }
    }

    static fromJSON(json) {
        const data = JSON.parse(json);
        return new CreepState(
            data.tic,
            data.energy,
            data.hits,
            data.spawning,
            data.nextAction
        );
    }



}

// Prototypes
StructureSpawn.prototype.loadMemory = function() {

    // StateQueue
    if (!('StateQueue' in this)) {
        if ('stateQueue' in this.memory) {
            this.StateQueue = StateQueue.fromJSON(this.memory.stateQueue);
        } else {
            this.StateQueue = new StateQueue;
        }
    }

}

StructureSpawn.prototype.storeMemory = function() {

    // StateQueue
    if (!('StateQueue' in this)) {
        this.StateQueue = new StateQueue;
    }
    this.memory.stateQueue = this.StateQueue.toJSON();

}

modules.export = {}