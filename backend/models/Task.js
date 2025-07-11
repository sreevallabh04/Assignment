const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    required: true,
    enum: ['Todo', 'In Progress', 'Done'],
    default: 'Todo'
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // For conflict detection
  isBeingEdited: {
    type: Boolean,
    default: false
  },
  editStartTime: {
    type: Date,
    default: null
  },
  editingUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

// Middleware to update the updatedAt field on every save
TaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Validation to ensure task titles don't match column names
TaskSchema.path('title').validate(function(value) {
  const columnNames = ['Todo', 'In Progress', 'Done'];
  return !columnNames.includes(value);
}, 'Task title cannot be the same as a column name (Todo, In Progress, Done)');

module.exports = mongoose.model('Task', TaskSchema);