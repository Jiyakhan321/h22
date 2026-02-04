// Integration tests for authentication flow
// These tests would simulate the full authentication flow including API calls

// Mock the apiClient to avoid making real network requests
jest.mock('../../src/services/api_client', () => ({
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

import apiClient from '../../src/services/api_client';
import AuthService from '../../src/services/auth_service';

describe('Authentication Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Registration Flow', () => {
    test('should register user and store token on successful registration', async () => {
      // Mock successful API response
      const mockApiResponse = {
        data: {
          access_token: 'mocked-jwt-token',
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User'
          }
        }
      };
      apiClient.post.mockResolvedValue(mockApiResponse);

      const result = await AuthService.register(
        'test@example.com',
        'password123',
        'Test',
        'User'
      );

      // Verify API call
      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User'
      });

      // Verify successful response
      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockApiResponse.data.user);

      // Verify token and user data were stored
      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'mocked-jwt-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockApiResponse.data.user));
    });

    test('should return error on failed registration', async () => {
      // Mock failed API response
      const mockError = {
        response: {
          data: {
            detail: 'Email already registered'
          }
        }
      };
      apiClient.post.mockRejectedValue(mockError);

      const result = await AuthService.register(
        'existing@example.com',
        'password123',
        'Test',
        'User'
      );

      // Verify error response
      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already registered');
    });
  });

  describe('Login Flow', () => {
    test('should login user and store token on successful login', async () => {
      // Mock successful API response
      const mockApiResponse = {
        data: {
          access_token: 'mocked-jwt-token',
          user: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            email: 'test@example.com',
            firstName: 'Test',
            lastName: 'User'
          }
        }
      };
      apiClient.post.mockResolvedValue(mockApiResponse);

      const result = await AuthService.login('test@example.com', 'password123');

      // Verify API call
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });

      // Verify successful response
      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockApiResponse.data.user);

      // Verify token and user data were stored
      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'mocked-jwt-token');
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockApiResponse.data.user));
    });

    test('should return error on failed login', async () => {
      // Mock failed API response
      const mockError = {
        response: {
          data: {
            detail: 'Invalid credentials'
          }
        }
      };
      apiClient.post.mockRejectedValue(mockError);

      const result = await AuthService.login('test@example.com', 'wrongpassword');

      // Verify error response
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('Logout Flow', () => {
    test('should clear token and user data on logout', () => {
      // Set some initial data
      localStorage.setItem('access_token', 'some-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', email: 'test@example.com' }));

      // Perform logout
      AuthService.logout();

      // Verify data was cleared
      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  describe('Token Validation Flow', () => {
    test('should correctly identify authenticated state', () => {
      // Set a valid token
      const validPayload = {
        sub: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      };
      const token = `header.${btoa(JSON.stringify(validPayload))}.signature`;
      localStorage.setItem('access_token', token);

      const isAuthenticated = AuthService.isAuthenticated();

      expect(isAuthenticated).toBe(true);
    });

    test('should correctly identify unauthenticated state with expired token', () => {
      // Set an expired token
      const expiredPayload = {
        sub: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
      };
      const token = `header.${btoa(JSON.stringify(expiredPayload))}.signature`;
      localStorage.setItem('access_token', token);

      const isAuthenticated = AuthService.isAuthenticated();

      expect(isAuthenticated).toBe(false);
    });
  });
});