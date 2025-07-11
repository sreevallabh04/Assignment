const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ActivityLog = require('../models/ActivityLog');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  // Check MongoDB connection status
  if (!global.isMongoDBConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database service unavailable. Please try again later.',
      isDbConnected: false
    });
  }

  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or username already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      // Log the registration activity
      try {
        await ActivityLog.logActivity({
          user: user._id,
          action: 'register',
          details: {
            message: `User ${username} registered`
          }
        });
      } catch (logError) {
        // Don't fail registration if logging fails
        console.warn('Failed to log registration activity:', logError.message);
      }

      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  // Check MongoDB connection status
  if (!global.isMongoDBConnected) {
    return res.status(503).json({
      success: false,
      message: 'Database service unavailable. Please try again later.',
      isDbConnected: false
    });
  }

  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Log the login activity
      try {
        await ActivityLog.logActivity({
          user: user._id,
          action: 'login',
          details: {
            message: `User ${user.username} logged in`
          }
        });
      } catch (logError) {
        // Don't fail login if logging fails
        console.warn('Failed to log login activity:', logError.message);
      }

      res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all users (for task assignment)
 * @route   GET /api/auth/users
 * @access  Private
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('username email createdAt')
      .sort({ username: 1 });

    res.json({
      success: true,
      users,
      count: users.length
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users',
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
};