# Collaborative To-Do Board

A web-based collaborative to-do board application where multiple users can log in, manage tasks, and see changes happen in real-time—similar to a minimal Trello board but with live synchronization and custom business logic.

## Tech Stack

### Backend
- Node.js/Express
- MongoDB
- Socket.IO for real-time updates
- JWT for authentication

### Frontend
- React (no UI libraries)
- Custom CSS for styling
- React DnD for drag-and-drop functionality

## Features

- User Registration & Login with secure authentication
- Kanban-style board with three columns: Todo, In Progress, Done
- Real-time updates with WebSockets
- Task management (create, edit, delete, assign)
- Drag-and-drop functionality for moving tasks between columns
- Smart Assign feature to automatically assign tasks to users with the lowest workload
- Conflict handling when multiple users edit the same task
- Activity log showing recent actions
- Responsive design for desktop and mobile

## Setup
1. Backend: cd backend && npm install && npm start
2. Frontend: cd frontend && npm install && npm start
## Features
- User auth
- Real-time task management
- Drag & drop
- Smart assign
- Conflict handling
- Activity log
## Smart Assign Logic
Assigns to user with fewest active tasks.
## Conflict Handling
Shows both versions, allows merge or overwrite.

## Demo

(Demo links will be added when available)