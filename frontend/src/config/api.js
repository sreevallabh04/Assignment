// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Development vs Production URL detection
const isDevelopment = process.env.NODE_ENV === 'development';
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Auto-detect API URL if not explicitly set
let finalApiUrl = API_BASE_URL;
let finalSocketUrl = SOCKET_URL;

if (!isDevelopment && !process.env.REACT_APP_API_URL) {
  // In production, if no API URL is set, try to use the same domain
  finalApiUrl = window.location.origin;
  finalSocketUrl = window.location.origin;
}

export const API_CONFIG = {
  BASE_URL: finalApiUrl,
  SOCKET_URL: finalSocketUrl,
  ENDPOINTS: {
    // Authentication
    LOGIN: `${finalApiUrl}/api/auth/login`,
    REGISTER: `${finalApiUrl}/api/auth/register`,
    PROFILE: `${finalApiUrl}/api/auth/profile`,
    
    // Tasks
    TASKS: `${finalApiUrl}/api/tasks`,
    TASK_BY_ID: (id) => `${finalApiUrl}/api/tasks/${id}`,
    SMART_ASSIGN: (id) => `${finalApiUrl}/api/tasks/${id}/smart-assign`,
    
    // Logs
    LOGS: `${finalApiUrl}/api/logs`,
  }
};

// Debug logging for development
if (isDevelopment) {
  console.log('API Configuration:', {
    BASE_URL: finalApiUrl,
    SOCKET_URL: finalSocketUrl,
    ENV: process.env.NODE_ENV,
    IS_LOCALHOST: isLocalhost
  });
}

export default API_CONFIG; 