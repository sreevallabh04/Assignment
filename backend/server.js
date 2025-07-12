const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Global state to track MongoDB connection status
global.isMongoDBConnected = false;

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

// Connect to MongoDB with retry mechanism
const connectMongoDB = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    
    const startTime = Date.now();
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout for Atlas
      heartbeatFrequencyMS: 10000, // Keep connection alive
    });
    const connectionTime = Date.now() - startTime;
    console.log(`✅ MongoDB Atlas connected successfully in ${connectionTime}ms`);
    console.log(`📚 Database: ${mongoose.connection.db?.databaseName}`);
    global.isMongoDBConnected = true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.warn('Continuing without MongoDB connection - some features may not work properly');
    global.isMongoDBConnected = false;
    
    // Try to reconnect after 30 seconds
    setTimeout(connectMongoDB, 30000);
  }
};

// Initial MongoDB connection attempt
connectMongoDB();

// Set up MongoDB connection event listeners
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
  global.isMongoDBConnected = true;
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
  global.isMongoDBConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected from MongoDB');
  global.isMongoDBConnected = false;
});

// Handle process termination events
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access your application at: http://localhost:${PORT}`);
});

// Enhanced error handling for port conflicts
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.error('💡 Try using a different port or stop the conflicting process');
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});

// Export for testing
module.exports = { app, server, io };