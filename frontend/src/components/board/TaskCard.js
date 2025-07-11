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

  return (
    <div ref={drag} className={`task-card ${isDragging ? 'dragging' : ''}`}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>Assigned: {task.assignedTo?.username || 'Unassigned'}</p>
      <button onClick={() => onEdit(task)}>Edit</button>
      <button onClick={() => onDelete(task._id)}>Delete</button>
      <button onClick={() => onSmartAssign(task._id)}>Smart Assign</button>
    </div>
  );
}

export default TaskCard; 