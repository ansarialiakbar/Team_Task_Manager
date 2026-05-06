const express = require('express');
const { 
  getTasks, createTask, updateTask, 
  updateTaskStatus, deleteTask 
} = require('../controllers/taskController');
const protect = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

module.exports = router;