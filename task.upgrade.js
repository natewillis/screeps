var TaskSourceTarget = require('task.SourceTarget')

class TaskUpgrade extends TaskSourceTarget{

    constructor(source, sourceWorkLocation, target, targetWorkLocation) {
        super(source, sourceWorkLocation, target, targetWorkLocation);
        this.taskType = 'upgrade';
        this.neededCreeps = 1;
    }

};

module.exports = TaskUpgrade;