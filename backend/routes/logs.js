const express = require('express');
const router = express.Router();
const { 
  getRecentLogs,
  getTaskLogs,
  getUserLogs
} = require('../controllers/logController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Get recent logs (default 20)
router.get('/', getRecentLogs);

// Get logs for a specific task
router.get('/task/:taskId', getTaskLogs);

// Get logs for a specific user
router.get('/user/:userId', getUserLogs);

module.exports = router;