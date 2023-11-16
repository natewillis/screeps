var TaskSourceTarget = require('task.SourceTarget')

class TaskRepair extends TaskSourceTarget{

    constructor(source, sourceWorkLocation, target, targetWorkLocation) {
        super(source, sourceWorkLocation, target, targetWorkLocation);
        this.taskType = 'repair';
        this.neededCreeps = 1;
    }

};

module.exports = TaskRepair;