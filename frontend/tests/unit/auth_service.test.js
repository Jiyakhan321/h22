import AuthService from '../../src/services/auth_service';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setTokenAndUser', () => {
    test('should store token and user data in localStorage', () => {
      const token = 'test-token';
      const user = { id: '1', email: 'test@example.com' };

      AuthService.setTokenAndUser(token, user);

      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', token);
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(user));
    });
  });

  describe('getToken', () => {
    test('should return token from localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce('test-token');

      const token = AuthService.getToken();

      expect(token).toBe('test-token');
      expect(localStorage.getItem).toHaveBeenCalledWith('access_token');
    });

    test('should return null if no token in localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);

      const token = AuthService.getToken();

      expect(token).toBeNull();
    });
  });

  describe('getUser', () => {
    test('should return parsed user data from localStorage', () => {
      const userData = { id: '1', email: 'test@example.com' };
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(userData));

      const user = AuthService.getUser();

      expect(user).toEqual(userData);
    });

    test('should return null if no user data in localStorage', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);

      const user = AuthService.getUser();

      expect(user).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    test('should return false if no token', () => {
      localStorageMock.getItem.mockReturnValueOnce(null);

      const result = AuthService.isAuthenticated();

      expect(result).toBe(false);
    });

    test('should return false if token is expired', () => {
      // Create a token with expired payload (exp time in the past)
      const expiredPayload = {
        sub: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
      };
      const token = `header.${btoa(JSON.stringify(expiredPayload))}.signature`;
      localStorageMock.getItem.mockReturnValueOnce(token);

      const result = AuthService.isAuthenticated();

      expect(result).toBe(false);
    });

    test('should return true if token is valid and not expired', () => {
      // Create a token with valid payload (exp time in the future)
      const validPayload = {
        sub: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      };
      const token = `header.${btoa(JSON.stringify(validPayload))}.signature`;
      localStorageMock.getItem.mockReturnValueOnce(token);

      const result = AuthService.isAuthenticated();

      expect(result).toBe(true);
    });
  });

  describe('logout', () => {
    test('should remove token and user data from localStorage', () => {
      AuthService.logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });
});