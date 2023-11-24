// require
var { EntityState, StoreState, StateQueue } = require('entity');

// constants
var SPAWN_TICS_TO_PROPAGATE = 5000;

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
        console.log(json);
        const data = JSON.parse(json);
        return new CreepState(
            data.tic,
            data.energy,
            data.hits,
            data.spawning,
            data.nextAction
        );
    }

    equals(anotherSpawnState) {
        return this.tic === anotherSpawnState.tic &&
            this.energy === anotherSpawnState.energy &&
            this.hits === anotherSpawnState.hits &&
            this.spawning === anotherSpawnState.spawning
    }



}

// Prototypes
StructureSpawn.prototype.loadMemory = function() {

    // StateQueue
    if (!('StateQueue' in this)) {
        if ('stateQueue' in this.memory) {
            if (_.isEmpty(this.memory.stateQueue)) {
                this.StateQueue = new StateQueue;
            } else {
                this.StateQueue = StateQueue.fromJSON(this.memory.stateQueue);
            }
        } else {
            this.StateQueue = new StateQueue;
        }
    }

    // load current state
    this.loadCurrentState();

}

StructureSpawn.prototype.storeMemory = function() {

    // StateQueue
    if (!('StateQueue' in this)) {
        this.StateQueue = new StateQueue;
    }
    this.memory.stateQueue = this.StateQueue.toJSON();

}

StructureSpawn.prototype.currentSpawnState = function() {
    return new StateQueue(this.tic, this.store.getUsedCapacity(RESOURCE_ENERGY), this.hits, this.spawning);
}

StructureSpawn.prototype.loadCurrentState = function() {

    // get current state
    var currentState = this.currentSpawnState();

    // check if we have a state to begin with
    if (Game.time in this.StateQueue.getQueue()) {

        // verify its the state we expect and if not clear it and add the current one
        if (!(this.StateQueue.getQueue()[Game.time].equals(currentState))) {
            this.StateQueue.clearQueue();
            this.StateQueue.addState(currentState);
        }

    } else {
        this.StateQueue.clearQueue();
        this.StateQueue.addState(currentState);
    }

    // propagate it forward
    this.propagateModel(this.StateQueue.getLatestStateTic()+1, this.StateQueue.getLatestStateTic()+SPAWN_TICS_TO_PROPAGATE);
}

StructureSpawn.prototype.propagateModel = function(fromTic, toTic) {
        
    // validate
    if ((toTic < fromTic) || (fromTic <= Game.time)) {
        return
    }

    // simulate
    var currentState = this.StateQueue(fromTic-1);
    for (let i = fromTic; i <= toTic; i++) {
        var newState = new SpawnState(i, Math.min(currentState.energy + 1,300), currentState.hits, false, '');
        this.StateQueue.addState(newState);
        currentState = newState;
    }

}

module.export = {}