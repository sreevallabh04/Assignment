const Task = require('../models/Task');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res) => {
  // Check MongoDB connection status
  if (!global.isMongoDBConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database service unavailable. Please try again later.',
      isDbConnected: false
    });
  }

  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username')
      .populate('lastEditedBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks',
      error: error.message
    });
  }
};

/**
 * @desc    Get a specific task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res) => {
  // Check MongoDB connection status
  if (!global.isMongoDBConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database service unavailable. Please try again later.',
      isDbConnected: false
    });
  }

  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username')
      .populate('lastEditedBy', 'username');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.json({ success: true, task });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task',
      error: error.message
    });
  }
};

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
  // Check MongoDB connection status
  if (!global.isMongoDBConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database service unavailable. Please try again later.',
      isDbConnected: false
    });
  }

  try {
    const { title, description, status, priority, assignedTo } = req.body;

    // Check if task title already exists
    const taskExists = await Task.findOne({ title });
    if (taskExists) {
      return res.status(400).json({
        success: false,
        message: 'Task with this title already exists'
      });
    }

    // Check if title matches column names
    const columnNames = ['Todo', 'In Progress', 'Done'];
    if (columnNames.includes(title)) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot be the same as a column name'
      });
    }

    const newTask = new Task({
      title,
      description,
      status,
      priority,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      lastEditedBy: req.user._id
    });

    const savedTask = await newTask.save();

    // Log the activity
    try {
      await ActivityLog.logActivity({
        user: req.user._id,
        action: 'create',
        task: savedTask._id,
        details: {
          message: `Task "${title}" created by ${req.user.username}`,
          newState: {
            title,
            description,
            status,
            priority,
            assignedTo
          }
        }
      });
    } catch (logError) {
      console.warn('Failed to log task creation activity:', logError.message);
      // Continue even if logging fails
    }

    res.status(201).json({
      success: true,
      task: savedTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating task',
      error: error.message
    });
  }
};

/**
 * @desc    Update a task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res) => {
  // Check MongoDB connection status
  if (!global.isMongoDBConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database service unavailable. Please try again later.',
      isDbConnected: false
    });
  }

  try {
    const { title, description, status, priority, assignedTo } = req.body;
    
    // Find the task
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check for conflict if the task is being edited
    if (task.isBeingEdited && 
        task.editingUser && 
        task.editingUser.toString() !== req.user._id.toString()) {
      
      // Return conflict information
      return res.status(409).json({
        success: false,
        message: 'Task is currently being edited by another user',
        conflict: true,
        editingUser: task.editingUser
      });
    }

    // Check if new title matches column names
    if (title && title !== task.title) {
      const columnNames = ['Todo', 'In Progress', 'Done'];
      if (columnNames.includes(title)) {
        return res.status(400).json({
          success: false,
          message: 'Task title cannot be the same as a column name'
        });
      }
      
      // Check if new title already exists
      const taskWithTitle = await Task.findOne({ 
        title, 
        _id: { $ne: req.params.id } 
      });
      
      if (taskWithTitle) {
        return res.status(400).json({
          success: false,
          message: 'Another task with this title already exists'
        });
      }
    }

    // Store previous state for activity log
    const previousState = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo
    };

    // Update the task
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status || task.status;
    task.priority = priority || task.priority;
    task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
    task.lastEditedBy = req.user._id;
    task.isBeingEdited = false;
    task.editingUser = null;
    task.editStartTime = null;

    const updatedTask = await task.save();

    // Determine what fields were changed
    const changes = [];
    if (previousState.title !== updatedTask.title) changes.push('title');
    if (previousState.description !== updatedTask.description) changes.push('description');
    if (previousState.status !== updatedTask.status) changes.push('status');
    if (previousState.priority !== updatedTask.priority) changes.push('priority');
    
    // Special handling for assignedTo changes
    let assignAction = false;
    if (previousState.assignedTo?.toString() !== updatedTask.assignedTo?.toString()) {
      changes.push('assignment');
      assignAction = true;
    }

    // Determine action type for logging
    let action = 'update';
    if (previousState.status !== updatedTask.status) {
      action = 'move';
    } else if (assignAction) {
      action = 'assign';
    }

    // Log the activity
    try {
      await ActivityLog.logActivity({
        user: req.user._id,
        action,
        task: updatedTask._id,
        details: {
          previousState,
          newState: {
            title: updatedTask.title,
            description: updatedTask.description,
            status: updatedTask.status,
            priority: updatedTask.priority,
            assignedTo: updatedTask.assignedTo
          },
          field: changes.join(', '),
          message: `Task "${updatedTask.title}" ${action}d by ${req.user.username} (changed: ${changes.join(', ')})`
        }
      });
    } catch (logError) {
      console.warn('Failed to log task update activity:', logError.message);
      // Continue even if logging fails
    }

    res.json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating task',
      error: error.message
    });
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res) => {
  // Check MongoDB connection status
  if (!global.isMongoDBConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database service unavailable. Please try again later.',
      isDbConnected: false
    });
  }

  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Store task details before deletion for logging
    const taskDetails = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo
    };
    
    const taskId = task._id.toString();
    
    await task.remove();
    
    // Log the activity
    try {
      await ActivityLog.logActivity({
        user: req.user._id,
        action: 'delete',
        task: taskId,
        details: {
          message: `Task "${taskDetails.title}" deleted by ${req.user.username}`,
          previousState: taskDetails
        }
      });
    } catch (logError) {
      console.warn('Failed to log task deletion activity:', logError.message);
      // Continue even if logging fails
    }
    
    res.json({
      success: true,
      message: 'Task removed'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task',
      error: error.message
    });
  }
};

/**
 * @desc    Mark a task as being edited (for conflict detection)
 * @route   PUT /api/tasks/:id/edit-start
 * @access  Private
 */
const startEditingTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Check if someone else is already editing
    if (task.isBeingEdited && 
        task.editingUser && 
        task.editingUser.toString() !== req.user._id.toString()) {
      
      return res.status(409).json({
        success: false,
        message: 'Task is already being edited by another user',
        conflict: true,
        editingUser: task.editingUser
      });
    }
    
    // Mark as being edited
    task.isBeingEdited = true;
    task.editingUser = req.user._id;
    task.editStartTime = Date.now();
    
    await task.save();
    
    res.json({
      success: true,
      message: 'Task marked as being edited'
    });
  } catch (error) {
    console.error('Start editing task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking task as being edited',
      error: error.message
    });
  }
};

/**
 * @desc    Cancel editing a task
 * @route   PUT /api/tasks/:id/edit-cancel
 * @access  Private
 */
const cancelEditingTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Only the user who started editing can cancel
    if (task.editingUser && task.editingUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the user who started editing can cancel'
      });
    }
    
    task.isBeingEdited = false;
    task.editingUser = null;
    task.editStartTime = null;
    
    await task.save();
    
    res.json({
      success: true,
      message: 'Task editing cancelled'
    });
  } catch (error) {
    console.error('Cancel editing task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling task editing',
      error: error.message
    });
  }
};

/**
 * @desc    Smart assign a task to the user with fewest active tasks
 * @route   PUT /api/tasks/:id/smart-assign
 * @access  Private
 */
const smartAssignTask = async (req, res) => {
  try {
    // Get the task
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Get all users
    const users = await User.find();
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found to assign task'
      });
    }
    
    // Count active tasks per user (only Todo and In Progress tasks)
    const userTaskCounts = {};
    
    // Initialize counts for all users
    users.forEach(user => {
      userTaskCounts[user._id] = 0;
    });
    
    // Get all active tasks
    const activeTasks = await Task.find({
      status: { $in: ['Todo', 'In Progress'] }
    });
    
    // Count tasks per user
    activeTasks.forEach(activeTask => {
      if (activeTask.assignedTo) {
        const userId = activeTask.assignedTo.toString();
        if (userTaskCounts[userId] !== undefined) {
          userTaskCounts[userId]++;
        }
      }
    });
    
    // Find the user with the minimum number of tasks
    let minTaskCount = Infinity;
    let userWithMinTasks = null;
    
    Object.entries(userTaskCounts).forEach(([userId, count]) => {
      if (count < minTaskCount) {
        minTaskCount = count;
        userWithMinTasks = userId;
      }
    });
    
    if (!userWithMinTasks) {
      return res.status(500).json({
        success: false,
        message: 'Could not determine user with fewest tasks'
      });
    }
    
    // Store previous assignee for logging
    const previousAssignee = task.assignedTo;
    
    // Assign the task
    task.assignedTo = userWithMinTasks;
    task.lastEditedBy = req.user._id;
    
    const updatedTask = await task.save();
    
    // Populate the assignedTo field with user data
    await updatedTask.populate('assignedTo', 'username email');
    
    // Get the username of the assigned user for the response
    const assignedUser = await User.findById(userWithMinTasks);
    
    // Log the activity
    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'assign',
      task: task._id,
      details: {
        previousState: { assignedTo: previousAssignee },
        newState: { assignedTo: userWithMinTasks },
        field: 'assignedTo',
        message: `Task "${task.title}" smart-assigned to ${assignedUser.username} by ${req.user.username}`
      }
    });
    
    res.json({
      success: true,
      message: `Task assigned to ${assignedUser.username} who has ${minTaskCount} active tasks`,
      task: updatedTask,
      assignedUser: {
        _id: assignedUser._id,
        username: assignedUser.username
      }
    });
  } catch (error) {
    console.error('Smart assign task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during smart assign',
      error: error.message
    });
  }
};

/**
 * @desc    Resolve a conflict by choosing between versions
 * @route   PUT /api/tasks/:id/resolve-conflict
 * @access  Private
 */
const resolveTaskConflict = async (req, res) => {
  try {
    const { resolution, taskData } = req.body;
    
    if (!['overwrite', 'merge'].includes(resolution)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resolution type. Must be "overwrite" or "merge"'
      });
    }
    
    if (!taskData) {
      return res.status(400).json({
        success: false,
        message: 'Task data is required'
      });
    }
    
    // Get the current task
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    // Store previous state for logging
    const previousState = {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo
    };
    
    // Update the task based on resolution type
    if (resolution === 'overwrite') {
      // Completely replace with new data
      task.title = taskData.title;
      task.description = taskData.description;
      task.status = taskData.status;
      task.priority = taskData.priority;
      task.assignedTo = taskData.assignedTo;
    } else if (resolution === 'merge') {
      // Merge changes - implement your merging logic
      // For example, you might have specific fields to keep from each version
      task.title = taskData.title || task.title;
      task.description = taskData.description || task.description;
      task.status = taskData.status || task.status;
      task.priority = taskData.priority || task.priority;
      task.assignedTo = taskData.assignedTo !== undefined 
        ? taskData.assignedTo 
        : task.assignedTo;
    }
    
    // Reset editing flags
    task.isBeingEdited = false;
    task.editingUser = null;
    task.editStartTime = null;
    task.lastEditedBy = req.user._id;
    
    const updatedTask = await task.save();
    
    // Log the conflict resolution
    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'update',
      task: task._id,
      details: {
        previousState,
        newState: {
          title: updatedTask.title,
          description: updatedTask.description,
          status: updatedTask.status,
          priority: updatedTask.priority,
          assignedTo: updatedTask.assignedTo
        },
        message: `Conflict for task "${updatedTask.title}" resolved by ${req.user.username} using ${resolution}`
      }
    });
    
    res.json({
      success: true,
      message: `Conflict resolved using ${resolution}`,
      task: updatedTask
    });
  } catch (error) {
    console.error('Resolve conflict error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resolving conflict',
      error: error.message
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  startEditingTask,
  cancelEditingTask,
  smartAssignTask,
  resolveTaskConflict
};