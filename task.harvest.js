var TaskSourceTarget = require('task.SourceTarget')

class TaskHarvest extends TaskSourceTarget{

    constructor(source, sourceWorkLocation, target, targetWorkLocation) {
        super(source, sourceWorkLocation, target, targetWorkLocation);
        this.taskType = 'harvest';
        this.neededCreeps = 1;
    }

};

module.exports = TaskHarvest;