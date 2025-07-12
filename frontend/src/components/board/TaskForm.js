import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskForm({ onClose, task = {}, isEdit = false }) {
  const [formData, setFormData] = useState({
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'Medium',
    status: task.status || 'Todo'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit && task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        status: task.status || 'Todo'
      });
    }
  }, [isEdit, task]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    const { title } = formData;
    
    // Check if title is empty
    if (!title.trim()) {
      setError('Task title is required');
      return false;
    }
    
    // Check if title matches column names
    const columnNames = ['Todo', 'In Progress', 'Done'];
    if (columnNames.includes(title.trim())) {
      setError('Task title cannot be the same as a column name (Todo, In Progress, Done)');
      return false;
    }
    
    // Check title length
    if (title.trim().length < 3) {
      setError('Task title must be at least 3 characters long');
      return false;
    }
    
    if (title.trim().length > 100) {
      setError('Task title cannot exceed 100 characters');
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
      const dataToSend = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim()
      };
      
      if (isEdit) {
        await axios.put(`/api/tasks/${task._id}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/tasks', dataToSend, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      onClose();
      window.location.reload(); // Refresh to show updated tasks
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form">
      <h3>{isEdit ? '✏️ Edit Task' : '✨ Create New Task'}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Task Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title..."
            required
            maxLength="100"
          />
          <small style={{ color: '#666', fontSize: '0.8rem' }}>
            {formData.title.length}/100 characters
          </small>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description..."
            rows="4"
            maxLength="500"
          />
          <small style={{ color: '#666', fontSize: '0.8rem' }}>
            {formData.description.length}/500 characters
          </small>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
        </div>

        {!isEdit && (
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Todo">📝 Todo</option>
              <option value="In Progress">⚡ In Progress</option>
              <option value="Done">✅ Done</option>
            </select>
          </div>
        )}

        {error && <div className="error" style={{ marginBottom: '15px' }}>{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <span className="loading"></span> : (isEdit ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm; 