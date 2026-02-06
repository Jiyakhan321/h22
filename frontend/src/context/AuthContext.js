'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth_service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthContext: Initializing authentication state'); // Debug log

    const initAuth = async () => {
      // Check if user is logged in on initial load
      const token = localStorage.getItem('access_token');
      console.log('AuthContext: Token found:', !!token); // Debug log

      if (token) {
        // Check if token is expired by decoding the JWT payload
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const payload = JSON.parse(atob(base64));
          const currentTime = Math.floor(Date.now() / 1000);

          console.log('AuthContext: Token exp:', payload.exp, 'Current time:', currentTime); // Debug log

          // If token is expired, remove it
          if (payload.exp && payload.exp < currentTime) {
            console.log('AuthContext: Token is expired, removing'); // Debug log
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
          } else {
            console.log('AuthContext: Token is valid, retrieving user data'); // Debug log
            // Token is valid, get user data
            const userData = localStorage.getItem('user');
            if (userData) {
              try {
                const parsedUser = JSON.parse(userData);
                console.log('AuthContext: Setting user:', parsedUser); // Debug log
                setUser(parsedUser);
              } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
              }
            } else {
              console.log('AuthContext: No user data found despite having token'); // Debug log

              // Try to fetch user data from the API if it's not in localStorage
              try {
                const userFromApi = await authService.getCurrentUser();
                if (userFromApi) {
                  localStorage.setItem('user', JSON.stringify(userFromApi));
                  setUser(userFromApi);
                } else {
                  // If we can't get user data from API, remove the token
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('user');
                }
              } catch (apiError) {
                console.error('Error fetching user from API:', apiError);
                // If there's a network error, keep the token but don't set the user
                // This allows the app to try again later when network is available
                if (apiError.code !== 'ERR_NETWORK' && !apiError.message.includes('Network Error')) {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('user');
                } else {
                  // For network errors, keep the token and set user to null for now
                  // The user will be fetched again when network is available
                  setUser(null);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      } else {
        console.log('AuthContext: No token found'); // Debug log
      }
      console.log('AuthContext: Setting loading to false'); // Debug log
      setLoading(false);
    };

    // Use a small delay to ensure DOM is ready
    const timer = setTimeout(initAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Starting login process'); // Debug log
      console.log('AuthContext: Attempting login to backend...'); // Debug log
      const response = await authService.login(email, password);
      console.log('AuthContext: Login response:', response); // Debug log

      if (response.success) {
        // The authService.login already stores the token and user data
        const userData = localStorage.getItem('user');
        console.log('AuthContext: Retrieved user data after login:', !!userData); // Debug log

        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('AuthContext: Setting user after login:', parsedUser); // Debug log
          setUser(parsedUser); // Update local state to reflect logged-in user
        } else {
          // If no user data in localStorage, try to get it from the response
          if (response.user) {
            console.log('AuthContext: Setting user from response:', response.user);
            setUser(response.user);
          }
        }
        console.log('AuthContext: Login successful, user set in context'); // Debug log
        return { success: true, user: userData ? JSON.parse(userData) : response.user };
      } else {
        console.log('AuthContext: Login failed with error:', response.error); // Debug log
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error); // Debug log
      console.error('AuthContext: Login error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.status,
        url: error.config?.url
      }); // Debug log

      // Provide more specific error messages
      let errorMessage = 'Login failed';
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid credentials. Please check your email and password.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Login endpoint not found. Please check if the backend is running properly.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const register = async (email, password, firstName, lastName) => {
    try {
      console.log('AuthContext: Starting registration process'); // Debug log
      console.log('AuthContext: Attempting registration to backend...'); // Debug log
      const response = await authService.register(email, password, firstName, lastName);
      console.log('AuthContext: Registration response:', response); // Debug log

      if (response.success) {
        // The authService.register already stores the token and user data
        const userData = localStorage.getItem('user');
        console.log('AuthContext: Retrieved user data after registration:', !!userData); // Debug log

        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('AuthContext: Setting user after registration:', parsedUser); // Debug log
          setUser(parsedUser); // Update local state to reflect logged-in user
        } else {
          // If no user data in localStorage, try to get it from the response
          if (response.user) {
            console.log('AuthContext: Setting user from response:', response.user);
            setUser(response.user);
          }
        }
        console.log('AuthContext: Registration successful, user set in context'); // Debug log
        return { success: true, user: userData ? JSON.parse(userData) : response.user };
      } else {
        console.log('AuthContext: Registration failed with error:', response.error); // Debug log
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('AuthContext: Registration error:', error); // Debug log
      console.error('AuthContext: Registration error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.status,
        url: error.config?.url
      }); // Debug log

      // Provide more specific error messages
      let errorMessage = 'Registration failed';
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your internet connection and try again.';
      } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid input. Please check your information and try again.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Email already exists. Please use a different email.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Registration endpoint not found. Please check if the backend is running properly.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout(); // Call the API logout and clear local storage
    } catch (error) {
      // Even if the API logout fails, clear local storage anyway
      console.error('Logout error (but continuing with local cleanup):', error);
    }
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!localStorage.getItem('access_token')
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};