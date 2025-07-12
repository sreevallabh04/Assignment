// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  SOCKET_URL: SOCKET_URL,
  ENDPOINTS: {
    // Authentication
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
    
    // Tasks
    TASKS: `${API_BASE_URL}/api/tasks`,
    TASK_BY_ID: (id) => `${API_BASE_URL}/api/tasks/${id}`,
    SMART_ASSIGN: (id) => `${API_BASE_URL}/api/tasks/${id}/smart-assign`,
    
    // Logs
    LOGS: `${API_BASE_URL}/api/logs`,
  }
};

export default API_CONFIG; 