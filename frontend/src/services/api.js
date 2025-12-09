import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session cookies
});

// Store CSRF token
let csrfToken = null;

// Fetch CSRF token on app load
export const initializeCsrfToken = async () => {
  try {
    const response = await api.get('/api/csrf-token');
    csrfToken = response.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    return null;
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add CSRF token to all non-GET requests
    if (csrfToken && !['GET', 'HEAD', 'OPTIONS'].includes(config.method?.toUpperCase())) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If CSRF token is invalid, refresh it and retry
    if (error.response?.status === 403 && error.response?.data?.error?.includes('CSRF')) {
      await initializeCsrfToken();
      const originalRequest = error.config;
      originalRequest.headers['X-CSRF-Token'] = csrfToken;
      return api.request(originalRequest);
    }
    
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access');
    }
    
    // Handle rate limiting
    if (error.response?.status === 429) {
      console.error('Rate limit exceeded:', error.response.data.error);
    }
    
    return Promise.reject(error);
  }
);

// File API calls
export const fileAPI = {
  // Save a file
  saveFile: async (slideId, file, fileData) => {
    const response = await api.post('/api/files', {
      slideId,
      name: file.name,
      size: file.size,
      type: file.type,
      data: fileData,
    });
    return response.data;
  },

  // Get all files for current user
  getFiles: async () => {
    const response = await api.get('/api/files');
    return response.data;
  },

  // Delete a file
  deleteFile: async (fileId) => {
    const response = await api.delete(`/api/files/${fileId}`);
    return response.data;
  },
};

// User API calls
export const userAPI = {
  // Register a new user
  register: async (userData) => {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  },

  // Login a user
  login: async (email, password) => {
    const response = await api.post('/api/users/login', { email, password });
    return response.data;
  },
};

export default api;
