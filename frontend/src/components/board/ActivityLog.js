import React from 'react';

function ActivityLog({ logs }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'create':
        return '➕';
      case 'update':
        return '✏️';
      case 'delete':
        return '🗑️';
      case 'assign':
        return '👤';
      case 'move':
        return '🔄';
      case 'login':
        return '🔐';
      case 'register':
        return '🆕';
      default:
        return '📝';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'create':
        return '#27ae60';
      case 'update':
        return '#3498db';
      case 'delete':
        return '#e74c3c';
      case 'assign':
        return '#9b59b6';
      case 'move':
        return '#f39c12';
      case 'login':
      case 'register':
        return '#667eea';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div className="activity-log">
      <h3>
        📊 Activity Feed
        {logs && logs.length > 0 && (
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 'normal', 
            color: '#666',
            marginLeft: '10px'
          }}>
            ({logs.length})
          </span>
        )}
      </h3>
      
      <div className="activity-log-content">
        {logs && logs.length > 0 ? (
          logs.map((log, index) => (
            <div 
              key={log._id || index} 
              className="activity-log-item"
              style={{
                borderLeftColor: getActionColor(log.action),
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div className="log-header">
                <span 
                  className="log-icon"
                  style={{ color: getActionColor(log.action) }}
                >
                  {getActionIcon(log.action)}
                </span>
                <span className="log-action">
                  {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                </span>
              </div>
              
              <div className="log-message">
                {log.details?.message || 'Activity occurred'}
              </div>
              
              <div className="log-details">
                <div className="log-user">
                  👤 {log.user?.username || 'Unknown User'}
                </div>
                <div className="log-time">
                  🕒 {formatTimestamp(log.timestamp)}
                </div>
              </div>

              {/* Show task name if available */}
              {log.task?.title && (
                <div className="log-task">
                  📝 Task: <strong>{log.task.title}</strong>
                </div>
              )}

              {/* Show field changes if available */}
              {log.details?.field && (
                <div className="log-field">
                  🔧 Changed: <em>{log.details.field}</em>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="activity-log-empty">
            <div style={{ 
              textAlign: 'center', 
              color: '#999', 
              fontStyle: 'italic',
              padding: '40px 20px'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📝</div>
              <div>No activity yet</div>
              <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
                Start creating and managing tasks to see activity here
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real-time indicator */}
      <div className="realtime-indicator">
        <span style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          backgroundColor: '#27ae60',
          borderRadius: '50%',
          marginRight: '8px',
          animation: 'pulse 2s infinite'
        }}></span>
        <span style={{ fontSize: '0.8rem', color: '#666' }}>
          Live updates
        </span>
      </div>
    </div>
  );
}

export default ActivityLog; 