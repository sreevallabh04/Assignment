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

let socket = null;

function Board() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Initialize socket connection
    socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch tasks, logs, and users simultaneously
        const [tasksRes, logsRes] = await Promise.all([
          axios.get('/api/tasks', { headers }),
          axios.get('/api/logs', { headers })
        ]);

        if (tasksRes.data.success) {
          setTasks(tasksRes.data.tasks);
        }

        if (logsRes.data.success) {
          setLogs(logsRes.data.logs);
        }

        setError('');
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 401) {
          logout();
        } else {
          setError('Failed to load data. Please refresh the page.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

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
      setTasks((prev) => prev.map((t) => 
        t._id === data.taskId ? { ...t, status: data.newStatus } : t
      ));
    });

    socket.on('newLog', (newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    });

    socket.on('taskBeingEdited', (taskId) => {
      // Handle conflict detection - another user is editing
      console.log('Task being edited by another user:', taskId);
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [user, navigate, logout]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
    
    // Emit that we're starting to edit this task
    if (socket) {
      socket.emit('taskEditing', task._id);
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      
      if (socket) {
        socket.emit('taskDelete', taskId);
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  };

  const handleSmartAssign = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/tasks/${taskId}/smart-assign`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        setTasks((prev) => prev.map((t) => t._id === taskId ? res.data.task : t));
        
        if (socket) {
          socket.emit('taskAssign', res.data.task);
        }
      }
    } catch (err) {
      console.error('Error smart assigning task:', err);
      alert('Failed to assign task. Please try again.');
    }
  };

  const handleTaskDrop = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const task = tasks.find(t => t._id === taskId);
      
      if (!task || task.status === newStatus) {
        return;
      }

      // Optimistically update UI
      setTasks((prev) => prev.map((t) => 
        t._id === taskId ? { ...t, status: newStatus } : t
      ));

      // Update on server
      await axios.put(`/api/tasks/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (socket) {
        socket.emit('statusChange', { taskId, newStatus });
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      // Revert optimistic update
      setTasks((prev) => prev.map((t) => 
        t._id === taskId ? { ...t, status: task.status } : t
      ));
      alert('Failed to update task status. Please try again.');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prev) => prev.map((t) => t._id === updatedTask._id ? updatedTask : t));
    
    if (socket) {
      socket.emit('taskUpdate', updatedTask);
    }
  };

  const handleTaskCreate = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
    
    if (socket) {
      socket.emit('taskCreate', newTask);
    }
  };

  const handleResolveConflict = (resolution, taskData) => {
    // Implement conflict resolution logic
    console.log('Resolving conflict:', resolution, taskData);
    setConflict(null);
  };

  const columns = ['Todo', 'In Progress', 'Done'];

  if (loading) {
    return (
      <div className="board">
        <div className="loading">Loading your workspace...</div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board">
        {/* Header */}
        <div className="board-header">
          <h1>🚀 Collaborative Workspace</h1>
          <div className="board-actions">
            <button 
              className="create-btn"
              onClick={() => setShowForm(true)}
            >
              ➕ New Task
            </button>
            <button 
              className="logout-btn"
              onClick={logout}
            >
              👋 Logout ({user?.username})
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Main Board Layout */}
        <div className="board-main">
          {/* Kanban Columns */}
          <div className="board-columns">
            {columns.map((status) => (
              <Column 
                key={status} 
                status={status}
                onTaskDrop={handleTaskDrop}
              >
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
                  ))
                }
                {tasks.filter((t) => t.status === status).length === 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#999', 
                    fontStyle: 'italic',
                    marginTop: '50px'
                  }}>
                    No tasks in {status}
                  </div>
                )}
              </Column>
            ))}
          </div>

          {/* Activity Log Panel */}
          <ActivityLog logs={logs} />
        </div>

        {/* Modals */}
        {showForm && (
          <TaskForm 
            onClose={handleFormClose}
            task={editingTask} 
            isEdit={!!editingTask}
            onTaskUpdate={handleTaskUpdate}
            onTaskCreate={handleTaskCreate}
          />
        )}

        {conflict && (
          <ConflictResolver 
            task={conflict.task} 
            conflictingVersion={conflict.version} 
            onResolve={handleResolveConflict} 
          />
        )}
      </div>
    </DndProvider>
  );
}

export default Board; 