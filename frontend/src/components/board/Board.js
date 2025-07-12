import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';
import TaskCard from './TaskCard';
import ActivityLog from './ActivityLog';
import TaskForm from './TaskForm';
import ConflictResolver from './ConflictResolver';
import LoadingSpinner from '../common/LoadingSpinner';

function Board() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setTasks(res.data.tasks);
      } catch (err) {
        if (err.response?.status === 401) {
          handleLogout();
        }
      }
    };

    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/logs', { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        setLogs(res.data.logs);
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
    };

    fetchTasks();
    fetchLogs();

    // Socket listeners
    newSocket.on('taskUpdated', (updatedTask) => {
      setTasks((prev) => prev.map((t) => t._id === updatedTask._id ? updatedTask : t));
    });

    newSocket.on('taskCreated', (newTask) => {
      setTasks((prev) => [...prev, newTask]);
    });

    newSocket.on('taskDeleted', (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    newSocket.on('taskAssigned', (data) => {
      setTasks((prev) => prev.map((t) => t._id === data._id ? data : t));
    });

    newSocket.on('statusChanged', (data) => {
      setTasks((prev) => prev.map((t) => t._id === data.taskId ? { ...t, status: data.newStatus } : t));
    });

    newSocket.on('newLog', (newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      if (socket) socket.emit('taskDelete', taskId);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleSmartAssign = async (taskId) => {
    try {
      const res = await axios.put(`/api/tasks/${taskId}/smart-assign`, {}, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      setTasks((prev) => prev.map((t) => t._id === taskId ? res.data.task : t));
      if (socket) socket.emit('taskAssign', res.data.task);
    } catch (err) {
      console.error('Error smart assigning task:', err);
    }
  };

  const handleDrop = async (taskId, newStatus) => {
    try {
      const res = await axios.put(`/api/tasks/${taskId}`, { status: newStatus }, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      setTasks((prev) => prev.map((t) => t._id === taskId ? res.data.task : t));
      if (socket) socket.emit('statusChange', { taskId, newStatus });
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const handleResolveConflict = async (resolution, mergedData) => {
    // Implementation for conflict resolution
    setConflict(null);
  };

  const columns = ['Todo', 'In Progress', 'Done'];

  if (!user) {
    return <LoadingSpinner message="Loading your workspace..." />;
  }

  return (
    <div className="board-container">
      <div className="board-header">
        <h1>📋 TaskFlow</h1>
        <div className="header-actions">
          <div className="user-info">
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span>{user.username}</span>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(true)}
          >
            ✨ New Task
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="board">
          <div className="columns-container">
            {columns.map((status) => (
              <Column key={status} status={status} onDrop={handleDrop}>
                {tasks
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <TaskCard 
                      key={task._id} 
                      task={task} 
                      onEdit={handleEdit} 
                      onDelete={handleDelete} 
                      onSmartAssign={handleSmartAssign} 
                    />
                  ))}
              </Column>
            ))}
          </div>
          <ActivityLog logs={logs} />
        </div>
      </DndProvider>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TaskForm 
              onClose={() => {
                setShowForm(false); 
                setEditingTask(null);
              }} 
              task={editingTask} 
              isEdit={!!editingTask} 
            />
          </div>
        </div>
      )}

      {conflict && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ConflictResolver 
              task={conflict.task} 
              conflictingVersion={conflict.version} 
              onResolve={handleResolveConflict} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Board; 