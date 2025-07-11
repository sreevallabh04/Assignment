import React, { useState } from 'react';

function ConflictResolver({ task, conflictingVersion, onResolve }) {
  const [resolution, setResolution] = useState('merge'); // or 'overwrite'

  const handleResolve = () => {
    // Implement merge or overwrite logic
    onResolve(resolution, /* merged data */);
  };

  return (
    <div className="conflict-resolver">
      <h3>Conflict Detected</h3>
      <p>Another user edited this task.</p>
      {/* Display versions */}
      <button onClick={handleResolve}>Resolve</button>
    </div>
  );
}

export default ConflictResolver; 