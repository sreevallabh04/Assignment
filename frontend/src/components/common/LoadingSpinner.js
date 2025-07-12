import React from 'react';

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      color: '#667eea'
    }}>
      <div className="loading" style={{ marginBottom: '20px' }}></div>
      <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{message}</p>
    </div>
  );
}

export default LoadingSpinner; 