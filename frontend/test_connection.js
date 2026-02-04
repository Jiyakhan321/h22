import axios from 'axios';

// Test if we can reach the backend from the frontend environment
const testBackendConnection = async () => {
  try {
    // Use the Hugging Face deployed backend URL directly for testing
    const baseUrl = 'https://jiyamughal-todo-backend.hf.space';
    console.log('Testing connection to backend...');
    console.log('Base URL:', baseUrl);

    const response = await axios.get(`${baseUrl}/health`);
    console.log('Backend health check response:', response.data);
    console.log('Successfully connected to backend!');
  } catch (error) {
    console.error('Failed to connect to backend:', error.message);
    console.error('Error details:', error);
  }
};

testBackendConnection();