import React, { useState } from 'react';
import axios from 'axios';

function TaskForm({ onClose, task = {}, isEdit = false }) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority || 'Medium');
  const [status, setStatus] = useState(task.status || 'Todo');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, description, priority, status };
    try {
      if (isEdit) {
        await axios.put(`/api/tasks/${task._id}`, data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      } else {
        await axios.post('/api/tasks', data, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      { !isEdit && <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Todo</option>
        <option>In Progress</option>
        <option>Done</option>
      </select> }
      <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
      <button type="button" onClick={onClose}>Cancel</button>
    </form>
  );
}

export default TaskForm; 