const ActivityLog = require('../models/ActivityLog');

/**
 * @desc    Get recent activity logs
 * @route   GET /api/logs
 * @access  Private
 */
const getRecentLogs = async (req, res) => {
  try {
    // Get limit from query or default to 20
    const limit = parseInt(req.query.limit) || 20;
    
    // Get recent logs using the static method
    const logs = await ActivityLog.getRecentActivities(limit);
    
    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error('Get recent logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching logs',
      error: error.message
    });
  }
};

/**
 * @desc    Get logs for a specific task
 * @route   GET /api/logs/task/:taskId
 * @access  Private
 */
const getTaskLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ task: req.params.taskId })
      .populate('user', 'username')
      .populate('task', 'title')
      .sort({ timestamp: -1 });
    
    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error('Get task logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task logs',
      error: error.message
    });
  }
};

/**
 * @desc    Get logs for a specific user
 * @route   GET /api/logs/user/:userId
 * @access  Private
 */
const getUserLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.find({ user: req.params.userId })
      .populate('user', 'username')
      .populate('task', 'title')
      .sort({ timestamp: -1 });
    
    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error('Get user logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user logs',
      error: error.message
    });
  }
};

module.exports = {
  getRecentLogs,
  getTaskLogs,
  getUserLogs
};