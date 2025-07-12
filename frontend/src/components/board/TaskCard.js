import React from 'react';
import { useDrag } from 'react-dnd';

function TaskCard({ task, onEdit, onDelete, onSmartAssign }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      ref={drag} 
      className={`task-card ${isDragging ? 'dragging' : ''}`}
    >
      <div className="task-header">
        <h3>{task.title}</h3>
        <span className={`priority-badge ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        <div className="assigned-user">
          {task.assignedTo ? (
            <>
              <div className="assigned-avatar">
                {task.assignedTo.username.charAt(0).toUpperCase()}
              </div>
              <span>{task.assignedTo.username}</span>
            </>
          ) : (
            <span style={{ color: '#a0aec0' }}>Unassigned</span>
          )}
        </div>
        <div className="task-date">
          {formatDate(task.createdAt)}
        </div>
      </div>
      
      <div className="task-actions">
        <button 
          className="btn btn-secondary" 
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          title="Edit task"
        >
          ✏️
        </button>
        <button 
          className="btn btn-primary" 
          onClick={(e) => {
            e.stopPropagation();
            onSmartAssign(task._id);
          }}
          title="Smart assign"
        >
          🎯
        </button>
        <button 
          className="btn btn-danger" 
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm('Are you sure you want to delete this task?')) {
              onDelete(task._id);
            }
          }}
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default TaskCard; 