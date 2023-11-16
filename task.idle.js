var TaskSourceTarget = require('task.SourceTarget')

class TaskIdle extends TaskSourceTarget{

    constructor(source, sourceWorkLocation, target, targetWorkLocation) {
        super(source, sourceWorkLocation, target, targetWorkLocation);
        this.taskType = 'idle';
        this.neededCreeps = 1;
    }

};

module.exports = TaskIdle;