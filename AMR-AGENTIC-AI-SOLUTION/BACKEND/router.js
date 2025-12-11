const router=require('express').Router();

// Import createTask module
const createTask = require('./create_task');
const executeTask = require('./assign_task');
const robotState = require('./robot_state');
const getAllTasks = require('./get_all_task');
// Define route for adding a task
router.post('/api/task/addTask', createTask.addTask);
router.post('/api/task/execute',executeTask.summonVehicle);
router.get('/api/robot/state',robotState.getRobotState);
router.get('/api/task/names', getAllTasks.getAllTaskNames);
module.exports=router;