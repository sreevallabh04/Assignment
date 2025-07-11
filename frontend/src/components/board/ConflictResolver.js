import React, { useState } from 'react';
import axios from 'axios';

function ConflictResolver({ task, conflictingVersion, onResolve, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatVersion = (version) => {
    return {
      title: version.title || 'Untitled',
      description: version.description || 'No description',
      status: version.status || 'Todo',
      priority: version.priority || 'Medium',
      assignedTo: version.assignedTo?.username || 'Unassigned',
      lastEditedBy: version.lastEditedBy?.username || 'Unknown',
      updatedAt: version.updatedAt || new Date()
    };
  };

  const currentVersion = formatVersion(task);
  const conflictVersion = formatVersion(conflictingVersion);

  const handleResolve = async (resolution) => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      let taskData;

      if (resolution === 'overwrite') {
        // Use the conflicting version
        taskData = {
          title: conflictingVersion.title,
          description: conflictingVersion.description,
          status: conflictingVersion.status,
          priority: conflictingVersion.priority,
          assignedTo: conflictingVersion.assignedTo?._id || null
        };
      } else if (resolution === 'merge') {
        // Merge changes - prioritize non-empty values from conflicting version
        taskData = {
          title: conflictingVersion.title || task.title,
          description: conflictingVersion.description || task.description,
          status: conflictingVersion.status || task.status,
          priority: conflictingVersion.priority || task.priority,
          assignedTo: conflictingVersion.assignedTo?._id || task.assignedTo?._id || null
        };
      } else if (resolution === 'keep') {
        // Keep current version
        taskData = {
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assignedTo?._id || null
        };
      }

      const response = await axios.put(
        `/api/tasks/${task._id}/resolve-conflict`,
        { resolution, taskData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onResolve(resolution, response.data.task);
        onClose();
      } else {
        setError(response.data.message || 'Failed to resolve conflict');
      }
    } catch (err) {
      console.error('Conflict resolution error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to resolve conflict. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderVersionDetails = (version, title) => (
    <div className="conflict-version">
      <h3>{title}</h3>
      <div className="version-details">
        <div className="detail-item">
          <strong>Title:</strong> {version.title}
        </div>
        <div className="detail-item">
          <strong>Description:</strong> 
          <div style={{ marginTop: '5px', fontStyle: 'italic' }}>
            {version.description.length > 100 
              ? `${version.description.substring(0, 100)}...` 
              : version.description
            }
          </div>
        </div>
        <div className="detail-item">
          <strong>Status:</strong> {version.status}
        </div>
        <div className="detail-item">
          <strong>Priority:</strong> 
          <span className={`priority ${version.priority.toLowerCase()}`}>
            {version.priority}
          </span>
        </div>
        <div className="detail-item">
          <strong>Assigned to:</strong> {version.assignedTo}
        </div>
        <div className="detail-item">
          <strong>Last edited by:</strong> {version.lastEditedBy}
        </div>
        <div className="detail-item">
          <strong>Updated:</strong> 
          <small style={{ color: '#666', marginLeft: '5px' }}>
            {new Date(version.updatedAt).toLocaleString()}
          </small>
        </div>
      </div>
    </div>
  );

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="conflict-resolver">
        <h2>⚠️ Edit Conflict Detected</h2>
        
        <div className="conflict-description">
          <p>
            This task has been modified by another user while you were editing it. 
            Please choose how to resolve this conflict:
          </p>
        </div>

        <div className="conflict-versions">
          {renderVersionDetails(currentVersion, "📄 Your Current Version")}
          {renderVersionDetails(conflictVersion, "🔄 Other User's Version")}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="conflict-actions">
          <button 
            className="keep-btn"
            onClick={() => handleResolve('keep')}
            disabled={loading}
            title="Keep your current version and discard other changes"
          >
            {loading ? 'Resolving...' : '📄 Keep Mine'}
          </button>
          
          <button 
            className="merge-btn"
            onClick={() => handleResolve('merge')}
            disabled={loading}
            title="Intelligently merge both versions (prioritizes non-empty values)"
          >
            {loading ? 'Resolving...' : '🔀 Smart Merge'}
          </button>
          
          <button 
            className="overwrite-btn"
            onClick={() => handleResolve('overwrite')}
            disabled={loading}
            title="Use the other user's version and discard your changes"
          >
            {loading ? 'Resolving...' : '🔄 Use Theirs'}
          </button>
        </div>

        <div className="conflict-help">
          <details style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              ℹ️ What do these options do?
            </summary>
            <div style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <p><strong>Keep Mine:</strong> Preserve your changes and ignore the other user's edits.</p>
              <p><strong>Smart Merge:</strong> Automatically combine both versions, favoring non-empty values.</p>
              <p><strong>Use Theirs:</strong> Adopt the other user's changes and discard your edits.</p>
            </div>
          </details>
        </div>

        {!loading && (
          <button 
            className="cancel-btn"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#999'
            }}
            title="Close without resolving"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default ConflictResolver; 