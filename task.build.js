var TaskSourceTarget = require('task.SourceTarget')

class TaskBuild extends TaskSourceTarget{

    constructor(source, sourceWorkLocation, target, targetWorkLocation) {
        super(source, sourceWorkLocation, target, targetWorkLocation);
        this.taskType = 'build';
        this.neededCreeps = 1;
    }

};

module.exports = TaskBuild;