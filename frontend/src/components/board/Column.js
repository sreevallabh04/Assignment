import React from 'react';
import { useDrop } from 'react-dnd';

function Column({ status, children, onDrop }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      if (onDrop) {
        onDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  const getColumnIcon = (status) => {
    switch (status) {
      case 'Todo':
        return '📝';
      case 'In Progress':
        return '⚡';
      case 'Done':
        return '✅';
      default:
        return '📋';
    }
  };

  return (
    <div ref={drop} className={`column ${isOver ? 'highlight' : ''}`}>
      <h2>
        {getColumnIcon(status)} {status}
      </h2>
      <div className="column-content">
        {children}
        {React.Children.count(children) === 0 && (
          <div style={{ 
            textAlign: 'center', 
            color: '#a0aec0', 
            fontStyle: 'italic',
            marginTop: '40px',
            padding: '20px'
          }}>
            No tasks yet
          </div>
        )}
      </div>
    </div>
  );
}

export default Column; 