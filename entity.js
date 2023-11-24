
// generic entity class state
class EntityState {
    constructor(tic) {
        this.tic = tic
    }

    toJSON() {
        return { tic: this.tic }
    }

    static fromJSON(json) {
        const data = JSON.parse(json);
        return new EntityState(data.tic);
    }

}

// store state
class StoreState {
    constructor(energy) {
        this.energy = energy
    }
    
    toJSON() {
        return { energy: this.energy }
    }

    static fromJSON(json) {
        const data = JSON.parse(json);
        return new StoreState(data.energy);
    }

}

// store a bunch of states
class StateQueue {
    constructor() {
        this.queue = {};
    }

    toJSON() {
        console.log('statequeue tojson');
        let serialized = {};
        for (const state of Object.values(this.queue)) {
            serialized[state.tic]  = state.toJSON();
        }
        return serialized;
    }

    static fromJSON(json) {
        const data = JSON.parse(json);
        const queue = new StateQueue();
        for (const key in data) {
            queue.addState(EntityState.fromJSON(JSON.stringify(data[key])));
        }
        return queue;
    }

    addState(state) {
        this.queue[state.tic] = state
    }

    getLatestStateTic() {
        if (Object.keys(this.queue).length === 0) {
            return null;
        } else {
            return Math.max(...Object.keys(this.queue).map(Number));
        }
    }

    getQueue() {
        return this.queue;
    }

    clearQueue(){
        Object.keys(this.queue).forEach(key => delete this.queue[key]);
    }
}

// export
module.exports = { EntityState, StoreState, StateQueue }