const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'assign', 'move', 'login', 'register']
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    // Not required as some actions (like login) don't involve a task
  },
  details: {
    // For storing additional details about the action
    previousState: {
      type: mongoose.Schema.Types.Mixed
    },
    newState: {
      type: mongoose.Schema.Types.Mixed
    },
    field: {
      // The field that was changed (e.g., status, assignedTo)
      type: String
    },
    message: {
      // Human-readable description of the action
      type: String,
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Method to get the most recent activities
ActivityLogSchema.statics.getRecentActivities = async function(limit = 20) {
  return this.find()
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('user', 'username')
    .populate('task', 'title');
};

// Helper method to log an activity
ActivityLogSchema.statics.logActivity = async function(logData) {
  try {
    const activity = new this(logData);
    return await activity.save();
  } catch (error) {
    console.error('Error logging activity:', error);
    // We don't want activity logging to block the main flow
    // so we just log the error and return null
    return null;
  }
};

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);