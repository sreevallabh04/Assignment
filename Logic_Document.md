# Logic Document - TaskFlow Collaborative To-Do Board

## Smart Assign Logic Implementation

### Overview
The Smart Assign feature automatically assigns tasks to the team member with the lowest current workload, ensuring fair distribution of work across all users.

### How Smart Assign Works

#### 1. **User Analysis**
When the Smart Assign button is clicked, the system:
- Retrieves all registered users from the database
- Excludes inactive or deleted users
- Ensures there are users available for assignment

#### 2. **Workload Calculation**
The algorithm calculates each user's current workload by:
- Counting only **active tasks** (status: "Todo" or "In Progress")
- Ignoring completed tasks (status: "Done") as they don't contribute to current workload
- Initializing all users with a count of 0 to ensure fair consideration

#### 3. **Optimal User Selection**
The system determines the best assignee by:
- Finding the user(s) with the minimum number of active tasks
- In case of ties (multiple users with same minimum count), selecting randomly
- This ensures balanced distribution even when multiple users have equal workloads

#### 4. **Assignment Process**
Once the optimal user is identified:
- The task's `assignedTo` field is updated with the selected user's ID
- The task's `lastEditedBy` field is updated to track who performed the assignment
- The change is saved to the database with proper error handling

#### 5. **Real-time Updates**
After successful assignment:
- All connected users receive real-time updates via Socket.IO
- Activity logs are updated to track the assignment action
- Success notifications are shown to provide user feedback

### Example Scenario
```
Users and their current active tasks:
- Alice: 2 active tasks
- Bob: 1 active task  
- Charlie: 3 active tasks
- Diana: 1 active task

Smart Assign Result: Task assigned to Bob or Diana (randomly chosen between the two users with minimum workload of 1 task)
```

### Benefits
- **Automatic Load Balancing**: Prevents work overload on individual team members
- **Fair Distribution**: Ensures equal opportunity for all team members
- **Time Saving**: Eliminates manual decision-making for task assignments
- **Scalable**: Works efficiently regardless of team size

---

## Conflict Handling Logic Implementation

### Overview
The conflict handling system detects and resolves situations where multiple users attempt to edit the same task simultaneously, preventing data loss and maintaining data integrity.

### How Conflict Detection Works

#### 1. **Edit Session Tracking**
When a user begins editing a task:
- The system sets an `isBeingEdited` flag to `true`
- Records the `editingUser` ID and `editStartTime` timestamp
- This creates a "lock" on the task for the editing session

#### 2. **Concurrent Edit Detection**
When another user attempts to edit the same task:
- The system checks if `isBeingEdited` is `true`
- Compares the `editingUser` with the current user's ID
- If different users are involved, a conflict is detected

#### 3. **Conflict Response**
Upon detecting a conflict, the system:
- Returns a 409 (Conflict) HTTP status code
- Provides detailed conflict information including:
  - The user currently editing the task
  - The time when editing began
  - Both the current version and attempted changes

### Conflict Resolution Strategies

#### 1. **Wait and Retry**
- User can wait for the other user to finish editing
- System automatically releases the lock after successful save or timeout
- Recommended for minor conflicts or when coordination is possible

#### 2. **Force Override**
- User can choose to override the other user's changes
- System displays a warning about potential data loss
- Useful when urgent changes are needed or when the other user is unresponsive

#### 3. **Merge Changes**
- System attempts to merge non-conflicting changes automatically
- For example: if one user changes title and another changes description
- Provides the safest option for preserving all work

#### 4. **Cancel Edit**
- User can cancel their edit attempt and try again later
- No changes are lost, maintaining data integrity
- Recommended when the conflict involves critical changes

### Technical Implementation

#### Backend Conflict Detection
```javascript
// Simplified conflict detection logic
if (task.isBeingEdited && 
    task.editingUser && 
    task.editingUser.toString() !== currentUser._id.toString()) {
    
    return {
        success: false,
        conflict: true,
        message: 'Task is currently being edited by another user',
        conflictData: {
            editingUser: task.editingUser,
            editStartTime: task.editStartTime,
            currentVersion: task,
            attemptedChanges: newData
        }
    };
}
```

#### Frontend Conflict Resolution
The frontend presents a user-friendly interface showing:
- Both versions of the task (current and attempted changes)
- Clear options for resolution (Wait, Override, Merge, Cancel)
- Visual indicators of what changes were made by each user
- Timestamps to help users understand the sequence of events

### Example Conflict Scenario
```
Scenario: Alice and Bob both try to edit "Design Homepage" task

1. Alice starts editing at 2:30 PM
2. Bob attempts to edit at 2:31 PM
3. System detects conflict and shows Bob:
   - Alice's version: "Design Homepage - Updated wireframes"
   - Bob's version: "Design Homepage - Added mobile mockups"
   - Options: Wait, Override, Merge, Cancel

4. Bob chooses "Merge" 
5. Result: "Design Homepage - Updated wireframes, Added mobile mockups"
```

### Benefits
- **Data Integrity**: Prevents loss of work due to simultaneous edits
- **User Awareness**: Users are informed about conflicts immediately
- **Flexible Resolution**: Multiple strategies accommodate different scenarios
- **Audit Trail**: All conflict resolutions are logged for transparency
- **Real-time Feedback**: Users receive immediate notifications about conflicts

---

## Validation Logic Implementation

### Task Title Validation

#### 1. **Uniqueness Check**
- Every task title must be unique across the entire board
- System checks existing tasks before creating or updating
- Prevents confusion and ensures clear task identification

#### 2. **Column Name Restriction**
- Task titles cannot match column names: "Todo", "In Progress", "Done"
- Prevents system confusion between tasks and board structure
- Maintains clear separation between tasks and board organization

#### 3. **Length Validation**
- Minimum length: 3 characters (ensures meaningful titles)
- Maximum length: 100 characters (prevents UI layout issues)
- Provides clear feedback for invalid lengths

#### 4. **Content Validation**
- Trims whitespace from titles to prevent formatting issues
- Validates that titles contain actual content, not just spaces
- Ensures consistent data storage and display

### Implementation Benefits
- **Data Quality**: Ensures all tasks have meaningful, unique identifiers
- **User Experience**: Clear error messages guide users to valid inputs
- **System Stability**: Prevents edge cases that could break functionality
- **Consistency**: Maintains uniform data structure across the application

---

## Security Considerations

### Authentication & Authorization
- All task operations require valid JWT tokens
- User permissions are verified before any database operations
- Session management prevents unauthorized access

### Data Validation
- All user inputs are validated and sanitized
- SQL injection prevention through parameterized queries
- XSS protection through proper data encoding

### Conflict Resolution Security
- Only authorized users can resolve conflicts
- Audit logs track all conflict resolutions
- Prevents malicious users from disrupting collaborative work

---

*This document provides a comprehensive overview of the core logic implementations in TaskFlow. The system is designed to be robust, user-friendly, and scalable for teams of any size.* 