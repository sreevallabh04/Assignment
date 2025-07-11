import React from 'react';
import { useDrop } from 'react-dnd';

function Column({ status, children, onTaskDrop }) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      if (onTaskDrop) {
        onTaskDrop(item.id, status);
      }
      return { status };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    }),
  });

  // Count tasks in this column
  const taskCount = React.Children.count(children) - (React.Children.toArray(children).some(child => 
    child.props?.style?.textAlign === 'center' // Empty state message
  ) ? 1 : 0);

  const actualTaskCount = Math.max(0, taskCount);

  return (
    <div 
      ref={drop} 
      className={`column ${isOver && canDrop ? 'highlight' : ''}`}
      style={{
        backgroundColor: isOver && canDrop 
          ? 'rgba(102, 126, 234, 0.1)' 
          : undefined
      }}
    >
      <h2>
        {status}
        <span style={{ 
          fontSize: '0.8rem', 
          fontWeight: 'normal', 
          marginLeft: '10px',
          color: '#667eea',
          background: 'rgba(102, 126, 234, 0.1)',
          padding: '2px 8px',
          borderRadius: '12px'
        }}>
          {actualTaskCount}
        </span>
      </h2>
      <div className="column-content">
        {children}
      </div>
      {isOver && canDrop && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(102, 126, 234, 0.1)',
          border: '2px dashed #667eea',
          borderRadius: '15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#667eea',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          pointerEvents: 'none'
        }}>
          Drop task here
        </div>
      )}
    </div>
  );
}

export default Column; 