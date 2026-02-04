import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://jiyamughal-todo-backend.hf.space',
  timeout: 120000, // Increased timeout for Hugging Face Spaces cold starts (120 seconds)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Important: Allow cross-origin requests for Hugging Face deployment
  withCredentials: false, // Explicitly set to false for external API
  // Add additional configuration to handle potential CORS issues
  xsrfCookieName: undefined, // Disable CSRF cookie handling
  xsrfHeaderName: undefined, // Disable CSRF header
  // Prevent axios from adding its own headers that might trigger preflight requests
  validateStatus: function (status) {
    return status >= 200 && status < 300; // Default validation
  }
});

// Add a request interceptor to check if the backend is available before making requests
let backendAvailable = null; // null = unknown, true/false = known status
let lastCheckTime = 0;
const CHECK_INTERVAL = 30000; // 30 seconds

// Function to check backend availability
const checkBackendAvailability = async () => {
  const now = Date.now();
  // Only check if it's been more than 30 seconds since the last check
  if (now - lastCheckTime < CHECK_INTERVAL && backendAvailable !== null) {
    return backendAvailable;
  }

  try {
    const response = await apiClient.get('/health', {
      timeout: 20000 // Increase timeout for Hugging Face Spaces health check
    });
    backendAvailable = response.status === 200;
    lastCheckTime = now;
    console.log('Backend health check: AVAILABLE');
  } catch (error) {
    backendAvailable = false;
    lastCheckTime = now;
    console.log('Backend health check: UNAVAILABLE', error.message);
  }

  return backendAvailable;
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Log the request for debugging
    console.log(`Making request to: ${config.baseURL}${config.url}`);
    console.log('Request method:', config.method);
    console.log('Request headers:', config.headers);

    // Log request data for POST/PUT requests (but hide sensitive data)
    if (config.data) {
      if (config.url.includes('/auth/login') || config.url.includes('/auth/register')) {
        console.log('Request payload (sensitive data hidden):', {
          ...config.data,
          password: '[HIDDEN]'
        });
      } else {
        console.log('Request payload:', config.data);
      }
    }

    // TEMPORARILY DISABLED: Skip health check for health endpoint itself to avoid infinite loop
    // if (!config.url.includes('/health')) {
    //   const isAvailable = await checkBackendAvailability();
    //   if (!isAvailable) {
    //     // If backend is not available, we can still proceed but warn
    //     console.warn('Backend may not be available. Proceeding with request...');
    //   }
    // }

    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('JWT token attached to request');
    } else {
      console.log('No JWT token found for request');
    }

    // Add timestamp to prevent caching issues
    config.headers['Cache-Control'] = 'no-cache';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';

    // Ensure proper content-type for all requests
    config.headers['Content-Type'] = 'application/json';

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received: ${response.config.url} - Status: ${response.status}`);
    console.log('Response data:', response.data);
    // Update backend availability on successful response
    if (response.status >= 200 && response.status < 300) {
      backendAvailable = true;
      lastCheckTime = Date.now();
    }
    return response;
  },
  (error) => {
    console.log(`Response error: ${error.config?.url} - Error:`, error.message);
    console.log('Error details:', {
      code: error.code,
      responseStatus: error.response?.status,
      responseData: error.response?.data,
      message: error.message
    });

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
      // Update backend availability on network error
      backendAvailable = false;
      lastCheckTime = Date.now();
      // Show a more user-friendly error message
      if (error.message.includes('timeout')) {
        console.error('Request timed out. This is common with Hugging Face Spaces due to cold starts. The backend may be waking up. Please wait a moment and try again.');
      } else if (error.message.includes('aborted')) {
        console.error('Request was aborted. This may happen with Hugging Face Spaces during cold starts. Please wait a moment and try again.');
      } else {
        console.error('Network error occurred. This could be due to Hugging Face Spaces cold starts. Please wait a moment and try again.');
      }
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error occurred. This may be due to Hugging Face Spaces cold starts. Please try again in a moment.');
      // Update backend availability on server error
      backendAvailable = false;
      lastCheckTime = Date.now();
    } else if (error.response?.status === 0) {
      // Network error or CORS issue
      console.error('Network error or CORS issue. This is often due to Hugging Face Spaces cold starts. The backend may be waking up. Please wait a moment and try again.');
      // Update backend availability on network error
      backendAvailable = false;
      lastCheckTime = Date.now();
    }

    return Promise.reject(error);
  }
);

// Add a helper function to check if the backend is reachable
apiClient.checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('Backend health check failed:', error.message);
    return false;
  }
};

export default apiClient;