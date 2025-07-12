// API Configuration for TaskFlow Frontend
// This file centralizes API configuration and handles environment variables

const config = {
  // API Base URL - defaults to localhost for development
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // Socket.IO URL - defaults to API URL
  socketUrl: process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000',
  
  // Application settings
  appTitle: process.env.REACT_APP_TITLE || 'TaskFlow',
  environment: process.env.REACT_APP_ENV || 'development',
  
  // Feature flags
  enableSocket: process.env.REACT_APP_ENABLE_SOCKET !== 'false',
  enableRealTime: process.env.REACT_APP_ENABLE_REAL_TIME !== 'false',
  
  // API endpoints
  endpoints: {
    auth: {
      register: '/api/auth/register',
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      verify: '/api/auth/verify'
    },
    tasks: {
      list: '/api/tasks',
      create: '/api/tasks',
      update: (id) => `/api/tasks/${id}`,
      delete: (id) => `/api/tasks/${id}`,
      assign: (id) => `/api/tasks/${id}/assign`
    },
    logs: {
      list: '/api/logs',
      create: '/api/logs'
    }
  },
  
  // Request configuration
  requestConfig: {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
  },
  
  // Socket.IO configuration
  socketConfig: {
    transports: ['websocket', 'polling'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  const baseUrl = config.apiUrl.replace(/\/$/, ''); // Remove trailing slash
  const cleanEndpoint = endpoint.replace(/^\//, ''); // Remove leading slash
  return `${baseUrl}/${cleanEndpoint}`;
};

// Helper function to get full Socket URL
export const getSocketUrl = () => {
  return config.socketUrl.replace(/\/$/, ''); // Remove trailing slash
};

// Export configuration
export default config; 