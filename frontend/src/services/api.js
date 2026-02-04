import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://jiyamughal-todo-backend.hf.space',
  timeout: 30000, // Increased timeout for potential network delays
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Important: Allow cross-origin requests for Hugging Face deployment
  withCredentials: false, // Explicitly set to false for external API
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add timestamp to prevent caching issues
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';

    // Remove Origin header as it can cause CORS issues with some deployments
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth tokens if unauthorized
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      // Optionally redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } else if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      // Handle network errors
      console.error('Network error:', error.message);
      // Show a more user-friendly error message
      if (error.message.includes('timeout')) {
        console.error('Request timed out. Please check your internet connection and try again.');
      } else if (error.message.includes('aborted')) {
        console.error('Request was aborted. Please check your internet connection and try again.');
      } else {
        console.error('Network error occurred. Please check your internet connection and try again.');
      }
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error occurred. Please try again later.');
    } else if (error.response?.status === 0) {
      // Network error or CORS issue
      console.error('Network error or CORS issue. Please check your internet connection and the backend is running.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;