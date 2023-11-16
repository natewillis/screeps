var TaskSourceTarget = require('task.SourceTarget')

class TaskTruck extends TaskSourceTarget{

    constructor(source, sourceWorkLocation, target, targetWorkLocation) {
        super(source, sourceWorkLocation, target, targetWorkLocation);
        this.taskType = 'truck';
        this.neededCreeps = 1;
    }

};

module.exports = TaskTruck;