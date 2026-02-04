import apiClient from './api_client'; // Using the enhanced API client with better error handling

class AuthService {
  constructor() {
    this.tokenKey = 'access_token';
    this.userKey = 'user';
  }

  // Store token and user data
  setTokenAndUser(token, user) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }

  // Get token
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  // Get user data
  getUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.userKey);
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error parsing token:', error);
      return false;
    }
  }

  // Register a new user
  async register(email, password, firstName, lastName) {
    try {
      console.log('AuthService: Making registration request to /auth/register');
      console.log('AuthService: Request payload:', { email, first_name: firstName, last_name: lastName });

      const response = await apiClient.post('/auth/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName
      });

      console.log('AuthService: Registration response received:', response.status, response.data);

      // Check if response has the expected structure
      if (!response.data || !response.data.access_token) {
        console.error('AuthService: Invalid response structure from registration endpoint');
        console.error('AuthService: Expected access_token in response, got:', response.data);
        return {
          success: false,
          error: 'Invalid response from server. Please try again later.'
        };
      }

      const { access_token, user } = response.data;

      // Validate that we have the required data
      if (!access_token) {
        console.error('AuthService: No access_token in registration response');
        return {
          success: false,
          error: 'Authentication failed: No token received from server'
        };
      }

      // Store token and user data
      this.setTokenAndUser(access_token, user);

      console.log('AuthService: Registration successful, token and user stored');
      return { success: true, user };
    } catch (error) {
      console.error('AuthService: Registration error:', error);
      console.error('AuthService: Registration error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.status,
        url: error.config?.url,
        data: error.response?.data
      });

      // Handle different error types
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        return { success: false, error: 'Network error. Please check your internet connection and make sure the backend server is running.' };
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return { success: false, error: 'Request timed out. This may be due to a cold start on the Hugging Face backend. Please wait a moment and try again.' };
      } else if (error.response?.status === 0) {
        return { success: false, error: 'Unable to connect to the server. Please check if the backend is running and accessible.' };
      } else if (error.response?.status === 400) {
        return { success: false, error: error.response?.data?.detail || 'Invalid input. Please check your information and try again.' };
      } else if (error.response?.status === 409) {
        return { success: false, error: 'Email already exists. Please use a different email.' };
      } else if (error.response?.status === 404) {
        return { success: false, error: 'Server endpoint not found. Please check if the backend is running properly.' };
      } else if (error.response?.status === 500) {
        return { success: false, error: 'Server error. Please try again later or contact support.' };
      } else {
        return {
          success: false,
          error: error.response?.data?.detail || `Registration failed with status ${error.response?.status || 'unknown'}`
        };
      }
    }
  }

  // Login user
  async login(email, password) {
    try {
      console.log('AuthService: Making login request to /auth/login');
      console.log('AuthService: Request payload:', { email, password: '[HIDDEN]' });

      const response = await apiClient.post('/auth/login', {
        email,
        password
      });

      console.log('AuthService: Login response received:', response.status, response.data);

      // Check if response has the expected structure
      if (!response.data || !response.data.access_token) {
        console.error('AuthService: Invalid response structure from login endpoint');
        console.error('AuthService: Expected access_token in response, got:', response.data);
        return {
          success: false,
          error: 'Invalid response from server. Please try again later.'
        };
      }

      const { access_token, user } = response.data;

      // Validate that we have the required data
      if (!access_token) {
        console.error('AuthService: No access_token in login response');
        return {
          success: false,
          error: 'Authentication failed: No token received from server'
        };
      }

      // Store token and user data
      this.setTokenAndUser(access_token, user);

      console.log('AuthService: Login successful, token and user stored');
      return { success: true, user };
    } catch (error) {
      console.error('AuthService: Login error:', error);
      console.error('AuthService: Login error details:', {
        message: error.message,
        code: error.code,
        responseStatus: error.response?.status,
        responseURL: error.response?.config?.url,
        responseData: error.response?.data,
        errorConfig: error.config
      });

      // Handle different error types
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.error('AuthService: Network error detected - request likely never reached backend');
        return { success: false, error: 'Network error. The request may not have reached the server. Please check your internet connection and make sure the backend server is running.' };
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        return { success: false, error: 'Request timed out. This may be due to a cold start on the Hugging Face backend. Please wait a moment and try again.' };
      } else if (error.response?.status === 0) {
        console.error('AuthService: Status 0 error - likely CORS or network issue');
        return { success: false, error: 'Unable to connect to the server. This could be a CORS issue or the server is not accessible.' };
      } else if (error.response?.status === 400) {
        return { success: false, error: error.response?.data?.detail || 'Invalid input. Please check your email and password.' };
      } else if (error.response?.status === 401) {
        return { success: false, error: error.response?.data?.detail || 'Invalid credentials' };
      } else if (error.response?.status === 404) {
        return { success: false, error: 'Server endpoint not found. Please check if the backend is running properly.' };
      } else if (error.response?.status === 500) {
        return { success: false, error: 'Server error. Please try again later or contact support.' };
      } else {
        return {
          success: false,
          error: error.response?.data?.detail || `Login failed with status ${error.response?.status || 'unknown'}`
        };
      }
    }
  }

  // Logout user
  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  // Refresh token (if refresh token mechanism is implemented)
  async refreshToken() {
    // In a typical implementation, you'd use a refresh token to get a new access token
    // This is a simplified version - in a real app, you'd have a refresh endpoint
    const token = this.getToken();
    if (!token) {
      return null;
    }

    // Check if token is about to expire (within 5 minutes)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = payload.exp - currentTime;

      if (timeUntilExpiry < 5 * 60) { // 5 minutes in seconds
        // Token is expiring soon, would need to refresh
        // This would require a refresh token implementation
        return null;
      }

      return token;
    } catch (error) {
      console.error('Error checking token expiry:', error);
      return null;
    }
  }

  // Verify JWT token
  async verifyToken(token) {
    try {
      console.log('AuthService: Verifying token with /auth/verify');
      const response = await apiClient.post('/auth/verify', {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('AuthService: Token verification response:', response.data);

      if (response.data.valid) {
        return response.data.user;
      }
      return null;
    } catch (error) {
      console.error('AuthService: Token verification error:', error);
      // Only log network errors, not 401 errors which are expected when token expires
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.error('Network error when verifying token:', error.message);
      } else if (error.response?.status !== 401) {
        // Log other errors except 401 which is expected when token is invalid/expired
        console.error('Error verifying token:', error.message);
      }
      return null;
    }
  }

  // Get current user info
  async getCurrentUser() {
    try {
      console.log('AuthService: Fetching user info from /auth/me');
      const response = await apiClient.get('/auth/me');
      console.log('AuthService: User info fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('AuthService: Error fetching user info:', error);
      // Only log network errors, not 401 errors which are expected when token expires
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.error('Network error when fetching user info:', error.message);
      } else if (error.response?.status !== 401) {
        // Log other errors except 401 which is expected when token is invalid/expired
        console.error('Error fetching user info:', error.message);
      }
      return null;
    }
  }

  // Logout user
  async logout() {
    try {
      console.log('AuthService: Making logout request to /auth/logout');
      // Attempt to notify the backend about logout (optional since we're using JWT)
      // This call might fail if the backend is temporarily unavailable, but that's OK
      await apiClient.post('/auth/logout').catch(error => {
        console.warn('Logout notification to backend failed (this is OK for JWT-based auth):', error);
      });
      console.log('AuthService: Logout request completed');
    } catch (error) {
      // If logout notification fails, just log it and continue
      console.warn('Logout notification to backend failed (this is OK for JWT-based auth):', error);
    } finally {
      // Clear local storage regardless of backend response
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        console.log('AuthService: Local storage cleared after logout');
      }
      return { success: true };
    }
  }
}

export default new AuthService();