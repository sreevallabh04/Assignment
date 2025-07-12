import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { API_CONFIG } from '../../config/api';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';
import TaskCard from './TaskCard';
import ActivityLog from './ActivityLog';
import TaskForm from './TaskForm';
import ConflictResolver from './ConflictResolver';
import LoadingSpinner from '../common/LoadingSpinner';
import Notification from '../common/Notification';

function Board() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [conflict, setConflict] = useState(null);
  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    const newSocket = io(API_CONFIG.SOCKET_URL);
    setSocket(newSocket);

    const fetchTasks = async () => {
      try {
        const res = await axios.get(API_CONFIG.ENDPOINTS.TASKS, { 
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
        const res = await axios.get(API_CONFIG.ENDPOINTS.LOGS, { 
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
  }, [navigate, handleLogout]);

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId) => {
    // 🔬 LOG: Frontend delete request
    console.log('🔬 FRONTEND DELETE - Starting delete request');
    console.log('🔬 FRONTEND DELETE - Task ID:', taskId);
    console.log('🔬 FRONTEND DELETE - Task ID type:', typeof taskId);
    console.log('🔬 FRONTEND DELETE - API endpoint:', API_CONFIG.ENDPOINTS.TASK_BY_ID(taskId));
    console.log('🔬 FRONTEND DELETE - Token exists:', !!localStorage.getItem('token'));
    
    try {
      console.log('🔬 FRONTEND DELETE - Making DELETE request...');
      
      const response = await axios.delete(API_CONFIG.ENDPOINTS.TASK_BY_ID(taskId), { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      
      console.log('🔬 FRONTEND DELETE - Request successful:', response.status);
      console.log('🔬 FRONTEND DELETE - Response data:', response.data);
      
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      if (socket) socket.emit('taskDelete', taskId);
      
      setNotification({
        message: 'Task deleted successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error('🔬 FRONTEND DELETE - Error occurred:');
      console.error('🔬 FRONTEND DELETE - Error message:', err.message);
      console.error('🔬 FRONTEND DELETE - Error response:', err.response);
      console.error('🔬 FRONTEND DELETE - Error status:', err.response?.status);
      console.error('🔬 FRONTEND DELETE - Error data:', err.response?.data);
      console.error('🔬 FRONTEND DELETE - Full error:', err);
      
      setNotification({
        message: `Failed to delete task. Error: ${err.response?.data?.message || err.message}`,
        type: 'error'
      });
    }
  };

  const handleSmartAssign = async (taskId) => {
    try {
      const res = await axios.put(API_CONFIG.ENDPOINTS.SMART_ASSIGN(taskId), {}, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      
      if (res.data.success) {
        // Update the task with the assigned user information
        const updatedTask = {
          ...res.data.task,
          assignedTo: res.data.assignedUser
        };
        
        setTasks((prev) => prev.map((t) => t._id === taskId ? updatedTask : t));
        
        if (socket) {
          socket.emit('taskAssign', updatedTask);
        }
        
        // Show success notification
        setNotification({
          message: `Task assigned to ${res.data.assignedUser.username}!`,
          type: 'success'
        });
      }
    } catch (err) {
      console.error('Error smart assigning task:', err);
      setNotification({
        message: 'Failed to assign task. Please try again.',
        type: 'error'
      });
    }
  };

  const handleDrop = async (taskId, newStatus) => {
    try {
      const res = await axios.put(API_CONFIG.ENDPOINTS.TASK_BY_ID(taskId), { status: newStatus }, { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } 
      });
      setTasks((prev) => prev.map((t) => t._id === taskId ? res.data.task : t));
      if (socket) socket.emit('statusChange', { taskId, newStatus });
    } catch (err) {
      console.error('Error updating task status:', err);
      setNotification({
        message: 'Failed to update task status. Please try again.',
        type: 'error'
      });
    }
  };

  const handleResolveConflict = async (resolution, mergedData) => {
    // Implementation for conflict resolution
    setConflict(null);
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification(null);
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
              onSuccess={showNotification}
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

      {notification && (
        <Notification 
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}
    </div>
  );
}

export default Board; 