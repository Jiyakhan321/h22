import axios from 'axios';

// Test if we can reach the backend from the frontend environment
const testBackendConnection = async () => {
  try {
    // Use the environment variable for the backend URL
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://jiyamughal-backend-deploy.hf.space';
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