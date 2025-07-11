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

## Setup and Installation

### Prerequisites
- Node.js
- MongoDB

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Usage Guide

(Detailed usage instructions will be added as the project develops)

## Smart Assign Logic

The Smart Assign feature automatically assigns tasks to the user with the fewest active tasks, balancing the workload across the team.

## Conflict Handling

When two users edit the same task simultaneously, the application detects the conflict and presents both versions, allowing users to choose between merging the changes or overwriting with one version.

## Demo

(Demo links will be added when available)