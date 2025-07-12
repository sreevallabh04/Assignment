# 📋 TaskFlow - Collaborative To-Do Board

> A modern, real-time collaborative task management application built with the MERN stack

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)

## ✨ Features

### 🔐 **Authentication & Security**
- **Secure Registration & Login** with JWT authentication
- **Password hashing** using bcryptjs
- **Protected routes** and middleware
- **Session management** with automatic token validation

### 🎯 **Task Management**
- **Create, Edit, Delete** tasks with rich details
- **Drag & Drop** functionality between columns (Todo, In Progress, Done)
- **Priority levels** (Low, Medium, High) with visual indicators
- **Task assignment** to team members
- **Unique task titles** with validation

### 🤖 **Smart Features**
- **Smart Assign** - Automatically assigns tasks to users with the lowest workload
- **Real-time Sync** - See changes instantly across all connected users
- **Conflict Detection** - Handles simultaneous edits gracefully
- **Activity Logging** - Track all actions with detailed timestamps

### 🎨 **Modern UI/UX**
- **Beautiful gradient design** with glassmorphism effects
- **Responsive layout** that works on desktop and mobile
- **Smooth animations** and hover effects
- **Custom CSS** - No third-party UI frameworks
- **Intuitive drag-and-drop** interface

### 🔄 **Real-time Collaboration**
- **WebSocket integration** using Socket.IO
- **Live updates** for all connected users
- **Instant notifications** for task changes
- **Collaborative editing** with conflict resolution

## 🚀 Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database and ODM
- **Socket.IO** - Real-time communication
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **React DnD** - Drag and drop functionality
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates
- **Custom CSS** - Styling and animations

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/taskflow-collaborative-board.git
cd taskflow-collaborative-board
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

### 4. Access the Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## 🎮 Usage Guide

### Getting Started
1. **Register** a new account or **login** with existing credentials
2. **Create tasks** using the "✨ New Task" button
3. **Drag and drop** tasks between columns
4. **Edit tasks** by clicking the edit button (✏️)
5. **Use Smart Assign** (🎯) to automatically assign tasks
6. **Monitor activity** in the real-time activity log

### Smart Assign Logic
The Smart Assign feature analyzes all users and assigns the task to the user with the fewest active tasks (Todo + In Progress), ensuring balanced workload distribution across the team.

### Conflict Resolution
When multiple users attempt to edit the same task simultaneously:
1. The system detects the conflict
2. Users are presented with both versions
3. Options to merge changes or overwrite are provided
4. Resolution is applied and synced across all users

## 🏗️ Project Structure

```
taskflow-collaborative-board/
├── backend/
│   ├── controllers/          # Route handlers
│   ├── middleware/           # Authentication middleware
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   └── server.js            # Express server setup
├── frontend/
│   ├── public/              # Static assets
│   └── src/
│       ├── components/      # React components
│       │   ├── auth/        # Authentication components
│       │   ├── board/       # Board and task components
│       │   └── common/      # Shared components
│       ├── context/         # React context
│       └── App.js           # Main app component
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PUT /api/tasks/:id/smart-assign` - Smart assign task

### Activity Logs
- `GET /api/logs` - Get recent activity logs

## 🎯 Key Features Demo

### Real-time Collaboration
- Open multiple browser windows
- Create/edit tasks in one window
- Watch changes appear instantly in other windows

### Smart Assignment
- Create multiple users
- Assign tasks to different users
- Use Smart Assign to see automatic workload balancing

### Drag & Drop
- Drag tasks between Todo, In Progress, and Done columns
- Smooth animations and visual feedback
- Real-time updates across all connected users

## 🔒 Security Features

- **JWT Authentication** with secure token generation
- **Password hashing** using bcryptjs with salt
- **Input validation** and sanitization
- **CORS configuration** for secure cross-origin requests
- **Protected API routes** with authentication middleware

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🎨 Design Highlights

- **Glassmorphism effects** with backdrop blur
- **Gradient backgrounds** and smooth transitions
- **Custom animations** for enhanced user experience
- **Intuitive icons** and visual feedback
- **Consistent color scheme** throughout the application

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Deploy the backend folder
3. Update CORS settings for production URL

### Frontend Deployment (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the build folder
3. Configure redirects for React Router

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the flexible database
- Socket.IO for real-time capabilities
- All the open-source contributors

---

⭐ **Star this repository if you found it helpful!**

*Built with ❤️ and lots of ☕*