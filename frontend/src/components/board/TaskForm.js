import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskForm({ onClose, task, isEdit, onTaskUpdate, onTaskCreate }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    assignedTo: ''
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch users for assignment dropdown
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        // Don't show error for this as it's not critical
      }
    };

    fetchUsers();

    // If editing, populate form with existing task data
    if (isEdit && task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Todo',
        priority: task.priority || 'Medium',
        assignedTo: task.assignedTo?._id || ''
      });
    }
  }, [isEdit, task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Task title is required');
      return false;
    }

    if (formData.title.trim().length < 3) {
      setError('Task title must be at least 3 characters long');
      return false;
    }

    if (formData.title.trim().length > 100) {
      setError('Task title cannot exceed 100 characters');
      return false;
    }

    if (formData.description && formData.description.length > 500) {
      setError('Task description cannot exceed 500 characters');
      return false;
    }

    // Check for column name conflicts
    const columnNames = ['Todo', 'In Progress', 'Done'];
    if (columnNames.includes(formData.title.trim())) {
      setError('Task title cannot be the same as a column name (Todo, In Progress, Done)');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      // Prepare task data
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        priority: formData.priority,
        assignedTo: formData.assignedTo || null
      };

      let response;

      if (isEdit) {
        // Update existing task
        response = await axios.put(`/api/tasks/${task._id}`, taskData, { headers });
        
        if (response.data.success) {
          onTaskUpdate(response.data.task);
          onClose();
        } else {
          setError(response.data.message || 'Failed to update task');
        }
      } else {
        // Create new task
        response = await axios.post('/api/tasks', taskData, { headers });
        
        if (response.data.success) {
          onTaskCreate(response.data.task);
          onClose();
        } else {
          setError(response.data.message || 'Failed to create task');
        }
      }
    } catch (err) {
      console.error('Task form submission error:', err);
      
      if (err.response?.status === 409) {
        setError('This task is currently being edited by another user. Please try again later.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'Invalid task data. Please check your inputs.');
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h2>{isEdit ? 'Edit Task' : 'Create New Task'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              required
              disabled={loading}
              maxLength="100"
            />
            <small style={{ color: '#666', fontSize: '0.8rem' }}>
              {formData.title.length}/100 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter task description..."
              rows="4"
              disabled={loading}
              maxLength="500"
            />
            <small style={{ color: '#666', fontSize: '0.8rem' }}>
              {formData.description.length}/500 characters
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assignedTo">Assign To</label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Unassigned</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
            <small style={{ color: '#666', fontSize: '0.8rem' }}>
              Or use Auto-Assign to automatically assign to the user with fewest tasks
            </small>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading 
                ? (isEdit ? 'Updating...' : 'Creating...') 
                : (isEdit ? 'Update Task' : 'Create Task')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm; 