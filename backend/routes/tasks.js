const express = require('express');
const router = express.Router();
const { 
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  startEditingTask,
  cancelEditingTask,
  smartAssignTask,
  resolveTaskConflict
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Basic CRUD routes
router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

// Special feature routes
router.put('/:id/smart-assign', smartAssignTask);
router.put('/:id/edit-start', startEditingTask);
router.put('/:id/edit-cancel', cancelEditingTask);
router.put('/:id/resolve-conflict', resolveTaskConflict);

module.exports = router;