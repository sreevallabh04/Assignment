import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import io from 'socket.io-client';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';
import TaskCard from './TaskCard';
import ActivityLog from './ActivityLog';
import TaskForm from './TaskForm';
import ConflictResolver from './ConflictResolver';

function Board() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [conflict, setConflict] = useState(null);
  const socket = io('http://localhost:5000');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setTasks(res.data.tasks);
      } catch (err) {
        if (err.response?.status === 401) logout();
      }
    };

    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/logs', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setLogs(res.data.logs);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
    fetchLogs();

    // Socket listeners
    socket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) => prev.map((t) => t._id === updatedTask._id ? updatedTask : t));
    });

    socket.on('taskCreated', (newTask) => {
      setTasks((prev) => [...prev, newTask]);
    });

    socket.on('taskDeleted', (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    socket.on('taskAssigned', (data) => {
      setTasks((prev) => prev.map((t) => t._id === data._id ? data : t));
    });
    socket.on('statusChanged', (data) => {
      setTasks((prev) => prev.map((t) => t._id === data.taskId ? { ...t, status: data.newStatus } : t));
    });
    // Add for logs if needed
    socket.on('newLog', (newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, navigate, logout, socket]);

  // Implement drag and drop, task management, etc.

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      socket.emit('taskDelete', taskId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSmartAssign = async (taskId) => {
    try {
      const res = await axios.put(`/api/tasks/${taskId}/smart-assign`, {}, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setTasks((prev) => prev.map((t) => t._id === taskId ? res.data.task : t));
      socket.emit('taskAssign', res.data.task);
    } catch (err) {
      console.error(err);
    }
  };

  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board">
        <h1>Collaborative To-Do Board</h1>
        <button onClick={logout}>Logout</button>
        <button onClick={() => setShowForm(true)}>Create Task</button>
        {showForm && <TaskForm onClose={() => {setShowForm(false); setEditingTask(null);}} task={editingTask} isEdit={!!editingTask} />}
        {conflict && <ConflictResolver task={conflict.task} conflictingVersion={conflict.version} onResolve={handleResolveConflict} />}
        {/* Columns */}
        {columns.map((status) => (
          <Column key={status} status={status}>
            {tasks.filter((t) => t.status === status).map((task) => (
              <TaskCard key={task._id} task={task} onEdit={handleEdit} onDelete={handleDelete} onSmartAssign={handleSmartAssign} />
            ))}
          </Column>
        ))}
        {/* Activity Log */}
        <ActivityLog logs={logs} />
      </div>
    </DndProvider>
  );
}

export default Board; 