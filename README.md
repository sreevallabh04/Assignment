# 📋 TaskFlow - Collaborative To-Do Board

> A modern, real-time collaborative task management application built with the MERN stack

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)

## 🌟 Project Overview

TaskFlow is a sophisticated collaborative task management application that enables teams to work together seamlessly in real-time. Built as a modern alternative to traditional Kanban boards, it combines the simplicity of drag-and-drop task management with powerful real-time collaboration features.

**Key Highlights:**
- 🚀 **Real-time synchronization** across all connected users
- 🎯 **Smart task assignment** with intelligent workload balancing
- 🔄 **Conflict resolution** for simultaneous edits
- 🎨 **Beautiful, modern UI** with glassmorphism design
- 📱 **Fully responsive** for all devices
- 🔒 **Secure authentication** with JWT tokens

## ✨ Features

### 🔐 **Authentication & Security**
- **Secure Registration & Login** with JWT authentication
- **Password hashing** using bcryptjs with salt rounds
- **Protected routes** and middleware validation
- **Session management** with automatic token validation
- **Input sanitization** to prevent XSS attacks

### 🎯 **Task Management**
- **Create, Edit, Delete** tasks with rich details
- **Drag & Drop** functionality between columns (Todo, In Progress, Done)
- **Priority levels** (Low, Medium, High) with color-coded visual indicators
- **Task assignment** to team members
- **Unique task titles** with validation against column names
- **Task descriptions** with character limits
- **Creation timestamps** and user tracking

### 🤖 **Smart Features**
- **Smart Assign** - Automatically assigns tasks to users with the lowest workload
- **Real-time Sync** - See changes instantly across all connected users
- **Conflict Detection** - Handles simultaneous edits gracefully
- **Activity Logging** - Track all actions with detailed timestamps
- **Auto-refresh** functionality for seamless updates

### 🎨 **Modern UI/UX**
- **Beautiful gradient design** with glassmorphism effects
- **Responsive layout** that works on desktop, tablet, and mobile
- **Smooth animations** and hover effects
- **Custom CSS** - No third-party UI frameworks
- **Intuitive drag-and-drop** interface with visual feedback
- **Loading states** and error handling
- **Toast notifications** for user feedback

### 🔄 **Real-time Collaboration**
- **WebSocket integration** using Socket.IO
- **Live updates** for all connected users
- **Instant notifications** for task changes
- **Collaborative editing** with conflict resolution
- **User presence indicators**

## 🚀 Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework for RESTful APIs
- **MongoDB** with **Mongoose** - NoSQL database and ODM
- **Socket.IO** - Real-time bidirectional communication
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcryptjs** - Password hashing and salt generation
- **CORS** - Cross-origin resource sharing configuration
- **dotenv** - Environment variable management

### Frontend
- **React 18** - Modern UI framework with hooks
- **React Router DOM** - Client-side routing and navigation
- **React DnD** - Drag and drop functionality
- **Axios** - HTTP client for API calls
- **Socket.IO Client** - Real-time updates and communication
- **Custom CSS** - Handcrafted styling and animations

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB Atlas** account (recommended) or local MongoDB installation
- **Git** for version control

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/taskflow-collaborative-board.git
cd taskflow-collaborative-board
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Environment Configuration
Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/your-database?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random-minimum-32-characters

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

**Important Notes:**
- Replace `your-username` and `your-password` with your MongoDB Atlas credentials
- Replace `your-cluster` and `your-database` with your actual MongoDB Atlas cluster and database names
- Generate a strong JWT secret using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
- For production, use environment-specific values and different secrets

#### Start the Backend Server
```bash
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000
🌐 Access your application at: http://localhost:5000
✅ MongoDB Atlas connected successfully
📚 Database: taskflow
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Start the Frontend Development Server
```bash
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view the app in the browser.

Local:            http://localhost:3000
On Your Network:  http://192.168.1.x:3000
```

### 4. Access the Application
- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **API Documentation**: `http://localhost:5000/api` (if implemented)

### 5. Verify Installation
1. Open `http://localhost:3000` in your browser
2. Register a new account
3. Create your first task
4. Open another browser window/tab and login with a different account
5. Verify real-time updates work between windows

## 🎮 Usage Guide

### Getting Started
1. **Register** a new account with username, email, and password
2. **Login** with your credentials to access the dashboard
3. **Create tasks** using the "✨ New Task" button
4. **Fill in task details**: title, description, priority, and initial status
5. **Drag and drop** tasks between columns (Todo → In Progress → Done)
6. **Edit tasks** by clicking the edit button (✏️) on any task card
7. **Use Smart Assign** (🎯) to automatically assign tasks optimally
8. **Monitor activity** in the real-time activity log panel
9. **Delete tasks** using the delete button (🗑️) with confirmation

### Advanced Features
- **Multi-user Collaboration**: Share the URL with team members
- **Real-time Updates**: Changes appear instantly across all connected users
- **Conflict Resolution**: System handles simultaneous edits gracefully
- **Activity Tracking**: Monitor all actions with timestamps and user details

## 🧠 Smart Assign Logic - Detailed Explanation

### How It Works
The Smart Assign feature implements an intelligent workload balancing algorithm that automatically assigns tasks to the most suitable team member.

#### Algorithm Steps:
1. **User Query**: Fetch all registered users from the database
2. **Task Analysis**: Count active tasks (Todo + In Progress status) for each user
3. **Workload Calculation**: Calculate current workload per user
4. **Optimal Selection**: Select user(s) with the minimum active task count
5. **Tie Breaking**: If multiple users have the same minimum count, select randomly
6. **Assignment**: Update the task with the selected user ID
7. **Notification**: Broadcast the assignment to all connected users

#### Implementation Details:
```javascript
// Pseudo-code for Smart Assign Logic
async function smartAssignTask(taskId) {
  // 1. Get all users
  const users = await User.find({});
  
  // 2. Count active tasks for each user
  const userWorkloads = await Promise.all(
    users.map(async (user) => {
      const activeTaskCount = await Task.countDocuments({
        assignedTo: user._id,
        status: { $in: ['Todo', 'In Progress'] }
      });
      return { user, activeTaskCount };
    })
  );
  
  // 3. Find minimum workload
  const minWorkload = Math.min(...userWorkloads.map(uw => uw.activeTaskCount));
  
  // 4. Get users with minimum workload
  const optimalUsers = userWorkloads.filter(uw => uw.activeTaskCount === minWorkload);
  
  // 5. Select user (random if tie)
  const selectedUser = optimalUsers[Math.floor(Math.random() * optimalUsers.length)];
  
  // 6. Update task
  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { assignedTo: selectedUser.user._id },
    { new: true }
  );
  
  return updatedTask;
}
```

#### Benefits:
- **Balanced Workload**: Ensures fair distribution of tasks
- **Automatic Optimization**: No manual intervention required
- **Scalable**: Works with any number of team members
- **Real-time Updates**: Immediately reflects changes across all users

## 🔄 Conflict Handling Logic - Detailed Explanation

### Conflict Detection System
The application implements a sophisticated conflict detection and resolution system to handle simultaneous edits gracefully.

#### How Conflicts Are Detected:
1. **Edit Tracking**: When a user starts editing a task, the system sets an `isBeingEdited` flag
2. **Timestamp Monitoring**: Records `editStartTime` and `editingUser` information
3. **Concurrent Edit Detection**: If another user attempts to edit the same task, the system detects the conflict
4. **Version Comparison**: Compares the current task state with the attempted changes

#### Conflict Resolution Process:
```javascript
// Pseudo-code for Conflict Detection
async function updateTask(taskId, newData, userId) {
  const task = await Task.findById(taskId);
  
  // Check for active editing session
  if (task.isBeingEdited && 
      task.editingUser && 
      task.editingUser.toString() !== userId) {
    
    // Conflict detected!
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
  
  // No conflict, proceed with update
  const updatedTask = await Task.findByIdAndUpdate(taskId, newData, { new: true });
  return { success: true, task: updatedTask };
}
```

#### Resolution Options:
1. **Wait and Retry**: User can wait for the other user to finish editing
2. **Force Override**: User can choose to override the other user's changes (with warning)
3. **Merge Changes**: System attempts to merge non-conflicting changes
4. **Cancel Edit**: User can cancel their edit and try later

#### Frontend Conflict UI:
```javascript
// Conflict resolution component
function ConflictResolver({ task, conflictingVersion, onResolve }) {
  return (
    <div className="conflict-resolver">
      <h3>⚠️ Conflict Detected</h3>
      <p>Another user is editing this task: {conflictingVersion.editingUser.username}</p>
      
      <div className="conflict-versions">
        <div className="version-current">
          <h4>Your Changes</h4>
          {/* Display user's changes */}
        </div>
        <div className="version-other">
          <h4>Other User's Version</h4>
          {/* Display other user's version */}
        </div>
      </div>
      
      <div className="conflict-actions">
        <button onClick={() => onResolve('wait')}>Wait</button>
        <button onClick={() => onResolve('override')}>Override</button>
        <button onClick={() => onResolve('merge')}>Merge</button>
        <button onClick={() => onResolve('cancel')}>Cancel</button>
      </div>
    </div>
  );
}
```

#### Benefits:
- **Data Integrity**: Prevents data loss from simultaneous edits
- **User Awareness**: Users are informed about conflicts
- **Flexible Resolution**: Multiple resolution strategies available
- **Real-time Feedback**: Immediate notification of conflicts

## 🏗️ Project Structure

```
taskflow-collaborative-board/
├── backend/
│   ├── controllers/              # Route handlers and business logic
│   │   ├── authController.js     # Authentication logic
│   │   ├── taskController.js     # Task management logic
│   │   └── logController.js      # Activity logging logic
│   ├── middleware/               # Custom middleware
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/                   # MongoDB schemas
│   │   ├── User.js              # User data model
│   │   ├── Task.js              # Task data model
│   │   └── ActivityLog.js       # Activity log model
│   ├── routes/                   # API routes
│   │   ├── auth.js              # Authentication routes
│   │   ├── tasks.js             # Task management routes
│   │   └── logs.js              # Activity log routes
│   ├── .env                     # Environment variables
│   ├── package.json             # Backend dependencies
│   └── server.js                # Express server setup
├── frontend/
│   ├── public/                  # Static assets
│   │   └── index.html           # HTML template
│   └── src/
│       ├── components/          # React components
│       │   ├── auth/            # Authentication components
│       │   │   ├── Login.js     # Login form
│       │   │   └── Register.js  # Registration form
│       │   ├── board/           # Board and task components
│       │   │   ├── Board.js     # Main board component
│       │   │   ├── Column.js    # Kanban column
│       │   │   ├── TaskCard.js  # Individual task card
│       │   │   ├── TaskForm.js  # Task creation/editing form
│       │   │   ├── ActivityLog.js # Activity feed
│       │   │   └── ConflictResolver.js # Conflict resolution
│       │   └── common/          # Shared components
│       │       └── LoadingSpinner.js # Loading indicator
│       ├── App.js               # Main app component
│       ├── index.js             # React entry point
│       ├── index.css            # Global styles
│       └── package.json         # Frontend dependencies
├── Logic_Document.md            # Detailed logic explanations
└── README.md                    # This file
```

## 🔧 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
  - Body: `{ username, email, password }`
  - Returns: `{ success, user, token }`

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: `{ success, user, token }`

- `GET /api/auth/profile` - Get user profile (Protected)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ success, user }`

### Task Management Endpoints
- `GET /api/tasks` - Get all tasks (Protected)
  - Returns: `{ success, tasks }`

- `POST /api/tasks` - Create new task (Protected)
  - Body: `{ title, description, status, priority }`
  - Returns: `{ success, task }`

- `PUT /api/tasks/:id` - Update task (Protected)
  - Body: `{ title, description, status, priority, assignedTo }`
  - Returns: `{ success, task }` or `{ conflict: true }`

- `DELETE /api/tasks/:id` - Delete task (Protected)
  - Returns: `{ success, message }`

- `PUT /api/tasks/:id/smart-assign` - Smart assign task (Protected)
  - Returns: `{ success, task }`

### Activity Log Endpoints
- `GET /api/logs` - Get recent activity logs (Protected)
  - Returns: `{ success, logs }`

## 🎯 Key Features Demo

### Real-time Collaboration
1. Open multiple browser windows/tabs
2. Login with different accounts in each window
3. Create/edit tasks in one window
4. Watch changes appear instantly in other windows
5. Observe activity log updates in real-time

### Smart Assignment Demo
1. Create multiple user accounts
2. Assign tasks manually to different users
3. Create a new task and use Smart Assign
4. Observe how the system balances workload automatically

### Drag & Drop Demo
1. Create tasks in different columns
2. Drag tasks between Todo, In Progress, and Done
3. Notice smooth animations and visual feedback
4. Verify changes sync across all connected users

### Conflict Resolution Demo
1. Open same task for editing in two different windows
2. Start editing in both windows simultaneously
3. Observe conflict detection and resolution options
4. Test different resolution strategies

## 🔒 Security Features

### Authentication Security
- **JWT Tokens** with secure secret keys
- **Password Hashing** using bcryptjs with salt rounds
- **Token Expiration** (30 days default)
- **Protected Routes** with middleware validation

### Data Security
- **Input Validation** for all user inputs
- **SQL Injection Prevention** (using Mongoose ODM)
- **XSS Protection** through input sanitization
- **CORS Configuration** for secure cross-origin requests

### API Security
- **Rate Limiting** (can be implemented)
- **Request Validation** using middleware
- **Error Handling** without exposing sensitive information
- **Environment Variables** for sensitive configuration

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1200px and above
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

### Responsive Features
- **Flexible Grid Layout** that adapts to screen size
- **Touch-friendly Interface** for mobile devices
- **Optimized Typography** for readability
- **Adaptive Navigation** for different screen sizes

## 🎨 Design Highlights

### Visual Design
- **Glassmorphism Effects** with backdrop blur and transparency
- **Gradient Backgrounds** using CSS linear gradients
- **Smooth Animations** with CSS transitions and transforms
- **Color Psychology** - calming blues and purples for productivity

### User Experience
- **Intuitive Icons** for quick recognition
- **Visual Feedback** for all user interactions
- **Loading States** to manage user expectations
- **Error Messages** that are helpful and actionable

### Accessibility
- **Keyboard Navigation** support
- **Screen Reader** friendly markup
- **High Contrast** color combinations
- **Focus Indicators** for interactive elements

## 🚀 Deployment Guide

### Backend Deployment (Railway/Heroku)
1. Create account on Railway or Heroku
2. Connect your GitHub repository
3. Set environment variables:
   ```
   NODE_ENV=production
   MONGO_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   CLIENT_URL=your_frontend_url
   ```
4. Deploy backend service
5. Note the backend URL for frontend configuration

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Create account on Netlify or Vercel
3. Deploy the `build` folder
4. Configure redirects for React Router:
   ```
   /* /index.html 200
   ```
5. Update API endpoints to use production backend URL

### Environment Configuration
- Update CORS settings in backend for production frontend URL
- Configure MongoDB Atlas IP whitelist for production
- Set up monitoring and logging for production environment

## 🔍 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Task creation, editing, and deletion
- [ ] Drag and drop functionality
- [ ] Real-time updates between users
- [ ] Smart assign feature
- [ ] Conflict resolution
- [ ] Activity logging
- [ ] Responsive design on different devices

### Automated Testing (Future Enhancement)
- Unit tests for backend controllers
- Integration tests for API endpoints
- Frontend component tests using Jest/React Testing Library
- End-to-end tests using Cypress

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Verify your changes work correctly
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style Guidelines
- Use ESLint and Prettier for code formatting
- Follow React best practices and hooks patterns
- Write meaningful commit messages
- Add comments for complex logic
- Maintain consistent naming conventions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Srivallabh Kakarala**
- GitHub: [@sreevallabh04](https://github.com/sreevallabh04)
- LinkedIn: [Srivallabh Kakarala](https://linkedin.com/in/srivallabhkakarala)
- Email: contact@taskflow.dev

## 🙏 Acknowledgments

- **React Team** for the amazing framework and ecosystem
- **MongoDB** for the flexible and scalable database solution
- **Socket.IO** for seamless real-time communication
- **Express.js** for the robust backend framework
- **Open Source Community** for the incredible tools and libraries

## 📈 Future Enhancements

### Planned Features
- [ ] **File Attachments** for tasks
- [ ] **Task Comments** and discussions
- [ ] **Team Management** with roles and permissions
- [ ] **Email Notifications** for task assignments
- [ ] **Task Templates** for common workflows
- [ ] **Advanced Analytics** and reporting
- [ ] **Mobile App** using React Native
- [ ] **Offline Support** with service workers

### Performance Optimizations
- [ ] **Caching** with Redis
- [ ] **Database Indexing** optimization
- [ ] **CDN Integration** for static assets
- [ ] **Code Splitting** for faster loading
- [ ] **Image Optimization** and lazy loading

---

⭐ **Star this repository if you found it helpful!**

🚀 **Perfect for showcasing full-stack development skills to recruiters!**

*Built with ❤️ and lots of ☕ by Sreevallabh Kakarala*