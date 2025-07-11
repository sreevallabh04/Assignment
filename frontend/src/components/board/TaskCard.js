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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return '#e74c3c';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div 
      ref={drag} 
      className={`task-card ${isDragging ? 'dragging' : ''}`}
      style={{
        borderLeftColor: getPriorityColor(task.priority),
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* Task Header */}
      <div className="task-header">
        <h3>{task.title}</h3>
        <span className={`priority ${task.priority?.toLowerCase()}`}>
          {task.priority}
        </span>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="task-description">
          {task.description.length > 100 
            ? `${task.description.substring(0, 100)}...` 
            : task.description
          }
        </p>
      )}

      {/* Task Meta Information */}
      <div className="task-meta">
        <div className="assigned-info">
          <span className="label">Assigned to:</span>
          <span className="assigned-user">
            {task.assignedTo?.username || 'Unassigned'}
          </span>
        </div>
        
        <div className="created-info">
          <span className="label">Created:</span>
          <span className="date">
            {formatDate(task.createdAt)}
          </span>
        </div>
      </div>

      {/* Created by and Last edited info */}
      <div className="task-footer">
        <div className="created-by">
          <small>
            By: {task.createdBy?.username || 'Unknown'}
            {task.lastEditedBy && task.lastEditedBy._id !== task.createdBy?._id && (
              <span> • Edited by: {task.lastEditedBy.username}</span>
            )}
          </small>
        </div>
      </div>

      {/* Task Actions */}
      <div className="task-actions">
        <button 
          className="edit-btn"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          title="Edit task"
        >
          ✏️ Edit
        </button>
        <button 
          className="assign-btn"
          onClick={(e) => {
            e.stopPropagation();
            onSmartAssign(task._id);
          }}
          title="Smart assign to user with fewest tasks"
        >
          🎯 Auto-Assign
        </button>
        <button 
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task._id);
          }}
          title="Delete task"
        >
          🗑️ Delete
        </button>
      </div>

      {/* Editing indicator */}
      {task.isBeingEdited && (
        <div className="editing-indicator">
          <span>🔄 Being edited by {task.editingUser?.username}</span>
        </div>
      )}
    </div>
  );
}

export default TaskCard; 