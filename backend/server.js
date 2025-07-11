const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.warn('Continuing without MongoDB connection - some features may not work properly');
  // Don't exit the process, allow the server to continue running
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Handle task updates
  socket.on('taskUpdate', (updatedTask) => {
    // Broadcast to all clients except the sender
    socket.broadcast.emit('taskUpdated', updatedTask);
  });
  
  // Handle task creation
  socket.on('taskCreate', (newTask) => {
    socket.broadcast.emit('taskCreated', newTask);
  });
  
  // Handle task deletion
  socket.on('taskDelete', (taskId) => {
    socket.broadcast.emit('taskDeleted', taskId);
  });
  
  // Handle task assignment
  socket.on('taskAssign', (data) => {
    socket.broadcast.emit('taskAssigned', data);
  });
  
  // Handle status change (column move)
  socket.on('statusChange', (data) => {
    socket.broadcast.emit('statusChanged', data);
  });
  
  // Handle conflict detection
  socket.on('taskEditing', (taskId) => {
    socket.broadcast.emit('taskBeingEdited', taskId);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const logRoutes = require('./routes/logs');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/logs', logRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Collaborative To-Do Board API');
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for testing
module.exports = { app, server, io };