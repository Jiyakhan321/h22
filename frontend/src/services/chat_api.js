// Chat API service for interacting with the backend chat endpoint

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * Get the JWT token from localStorage
 * @returns {string|null} The JWT token or null if not found
 */
const getAuthToken = () => {
  return localStorage.getItem('access_token'); // Updated to match the actual token key used in auth
};

/**
 * Send a message to the chat endpoint
 * @param {string} userId - The user ID
 * @param {Object} messageData - The message data containing content and optional conversation_id
 * @returns {Promise<Object>} The response from the chat endpoint
 */
export const sendMessage = async (userId, messageData) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/${userId}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(messageData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear auth tokens if unauthorized
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Get conversation history
 * @param {string} userId - The user ID
 * @param {string} conversationId - The conversation ID
 * @returns {Promise<Object>} The conversation history
 */
export const getConversationHistory = async (userId, conversationId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/${userId}/conversations/${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Clear auth tokens if unauthorized
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting conversation history:', error);
    throw error;
  }
};