# Logic Document

## Smart Assign
The smart assign feature queries the database to find the user with the least number of tasks assigned in 'Todo' or 'In Progress' status. It then assigns the task to that user and updates the task.

## Conflict Handling
When updating a task, if the backend detects it's being edited by another user (via isBeingEdited flag), it returns a conflict. The frontend then displays both versions and allows the user to choose to merge changes or overwrite with one version, then sends the resolution to the backend to apply. 