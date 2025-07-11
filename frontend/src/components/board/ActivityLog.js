import React from 'react';

function ActivityLog({ logs }) {
  return (
    <div className="activity-log">
      <h2>Activity Log</h2>
      <ul>
        {logs.map((log) => (
          <li key={log._id}>
            {log.details.message} - {new Date(log.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityLog; 