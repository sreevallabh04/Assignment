import React from 'react';
import { useDrop } from 'react-dnd';

function Column({ status, children }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => ({ status }),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={`column ${isOver ? 'highlight' : ''}`}>
      <h2>{status}</h2>
      {children}
    </div>
  );
}

export default Column; 