import { useState, useEffect } from 'react';
import apiClient from '../services/api_client'; // Using the enhanced API client

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to safely extract array from response
  const getTasksArray = (data) => {
    if (!data) return [];
    
    // If data is already an array, return it
    if (Array.isArray(data)) {
      return data;
    }
    
    // If data is an object, try to extract array from common properties
    if (data && typeof data === 'object') {
      return data.tasks || 
             data.data || 
             data.items || 
             data.results || 
             Object.values(data).filter(item => Array.isArray(item)).flat() ||
             [];
    }
    
    // If data is string, try to parse it as JSON
    if (typeof data === 'string') {
      try {
        const parsedData = JSON.parse(data);
        return getTasksArray(parsedData);
      } catch (e) {
        console.error('Failed to parse string data:', e);
        return [];
      }
    }
    
    return [];
  };

  // Fetch tasks from the API
  const fetchTasks = async () => {
    // Don't fetch tasks if there's no token (user not authenticated)
    const token = localStorage.getItem('access_token');
    if (!token) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Retry mechanism for Hugging Face Spaces cold starts
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        console.log(`Fetching tasks from backend (attempt ${retries + 1}/${maxRetries})...`);
        const response = await apiClient.get('/tasks/');
        console.log('Full response:', response);
        console.log('Response data:', response.data);
        console.log('Type of response.data:', typeof response.data);

        // Safely extract tasks array from response
        const tasksArray = getTasksArray(response.data);
        console.log('Extracted tasks array:', tasksArray);

        // Remove duplicates by ID to ensure unique keys
        const uniqueTasks = tasksArray.filter((task, index, self) => {
          // Ensure task has an id property
          if (!task || typeof task !== 'object') return false;
          return index === self.findIndex(t => t.id === task.id);
        });

        console.log('Unique tasks:', uniqueTasks);
        setTasks(uniqueTasks);
        break; // Success, exit the retry loop
      } catch (err) {
        console.error(`Error fetching tasks (attempt ${retries + 1}):`, err);
        console.error('Error details:', {
          message: err.message,
          code: err.code,
          response: err.response?.status,
          url: err.config?.url
        });

        // Check if this is a network error that might benefit from retry
        const isRetryableError = err.code === 'ERR_NETWORK' ||
                                err.code === 'ECONNABORTED' ||
                                err.message.includes('timeout') ||
                                err.response?.status === 0 ||
                                err.response?.status >= 500;

        if (isRetryableError && retries < maxRetries - 1) {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, retries) * 1000; // 1s, 2s, 4s
          console.log(`Retrying in ${delay}ms due to network error...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
        } else {
          // Provide more specific error messages
          let errorMessage = 'Failed to fetch tasks';
          if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
            errorMessage = 'Network error. This is often due to Hugging Face Spaces cold starts. The backend may be waking up. Please wait a moment and try again.';
          } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
            errorMessage = 'Request timed out. This is common with Hugging Face Spaces due to cold starts. The backend may be waking up. Please wait a moment and try again.';
          } else if (err.response?.status === 0) {
            errorMessage = 'Unable to connect to the server. This is often due to Hugging Face Spaces cold starts. The backend may be waking up. Please wait a moment and try again.';
          } else if (err.response?.status >= 500) {
            errorMessage = 'Server error. This may be due to Hugging Face Spaces cold starts. Please try again in a moment.';
          } else if (err.response?.status === 401) {
            errorMessage = 'Unauthorized. Please log in again.';
            // Optionally redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          } else if (err.response?.status === 403) {
            errorMessage = 'Access denied. Please contact support.';
          } else if (err.response?.status === 404) {
            errorMessage = 'Server endpoint not found. Please check if the backend is running properly.';
          } else if (err.message) {
            errorMessage = err.message;
          }

          setError(errorMessage);
          break; // Non-retryable error, exit the loop
        }
      }
    }

    // Always set loading to false to prevent infinite loading state
    setLoading(false);
  };

  // Create a new task
  const createTask = async (taskData) => {
    setLoading(true);
    setError(null);

    // Retry mechanism for Hugging Face Spaces cold starts
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        console.log(`Creating task (attempt ${retries + 1}/${maxRetries})...`);
        const response = await apiClient.post('/tasks/', taskData);
        const newTask = response.data;

        // Update the UI with the new task, ensuring no duplicates
      setTasks(prev => {
  const safePrev = Array.isArray(prev) ? prev : [];

  // Agar backend se proper task nahi aaya to crash mat karo
  if (!newTask || !newTask.id) {
    console.error("Invalid newTask received:", newTask);
    return safePrev;
  }

  const filteredTasks = safePrev.filter(
    task => task && task.id !== newTask.id
  );

  return [...filteredTasks, newTask];
});

        return newTask;
      } catch (err) {
        console.error(`Error creating task (attempt ${retries + 1}):`, err);

        // Check if this is a network error that might benefit from retry
        const isRetryableError = err.code === 'ERR_NETWORK' ||
                                err.code === 'ECONNABORTED' ||
                                err.message.includes('timeout') ||
                                err.response?.status === 0 ||
                                err.response?.status >= 500;

        if (isRetryableError && retries < maxRetries - 1) {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, retries) * 1000; // 1s, 2s, 4s
          console.log(`Retrying in ${delay}ms due to network error...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
        } else {
          // Provide more specific error messages
          let errorMessage = 'Failed to create task';
          if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
            errorMessage = 'Network error. This is often due to Hugging Face Spaces cold starts. The backend may be waking up. Please wait a moment and try again.';
          } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
            errorMessage = 'Request timed out. This is common with Hugging Face Spaces due to cold starts. The backend may be waking up. Please wait a moment and try again.';
          } else if (err.response?.status === 0) {
            errorMessage = 'Unable to connect to the server. This is often due to Hugging Face Spaces cold starts. The backend may be waking up. Please wait a moment and try again.';
          } else if (err.response?.status >= 500) {
            errorMessage = 'Server error. This may be due to Hugging Face Spaces cold starts. Please try again in a moment.';
          } else if (err.response?.status === 401) {
            errorMessage = 'Unauthorized. Please log in again.';
            // Optionally redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          } else if (err.response?.status === 403) {
            errorMessage = 'Access denied. Please contact support.';
          } else if (err.response?.status === 404) {
            errorMessage = 'Server endpoint not found. Please check if the backend is running properly.';
          } else if (err.message) {
            errorMessage = err.message;
          }

          setError(errorMessage);
          throw new Error(errorMessage);
        }
      }
    }

    // This line should not be reached, but included for completeness
    setLoading(false);
  };

  // Update an existing task
  const updateTask = async (taskId, taskData) => {
    setLoading(true);
    setError(null);

    // Retry mechanism for Hugging Face Spaces cold starts
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        console.log(`Updating task ${taskId} (attempt ${retries + 1}/${maxRetries})...`);
        const response = await apiClient.put(`/tasks/${taskId}`, taskData);
        const updatedTask = response.data;

        // Update the task in the UI, ensuring no duplicates
        setTasks(prev => {
          // Filter out the old task with the same ID and add the updated one
          const filteredTasks = prev.filter(task => task.id !== taskId);
          return [...filteredTasks, updatedTask];
        });

        return updatedTask;
      } catch (err) {
        console.error(`Error updating task ${taskId} (attempt ${retries + 1}):`, err);

        // Check if this is a network error that might benefit from retry
        const isRetryableError = err.code === 'ERR_NETWORK' ||
                                err.code === 'ECONNABORTED' ||
                                err.message.includes('timeout') ||
                                err.response?.status === 0 ||
                                err.response?.status >= 500;

        if (isRetryableError && retries < maxRetries - 1) {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, retries) * 1000; // 1s, 2s, 4s
          console.log(`Retrying in ${delay}ms due to network error...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
        } else {
          // Provide more specific error messages
          let errorMessage = 'Failed to update task';
          if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
            errorMessage = 'Network error. This is often due to Hugging Face Spaces cold starts. The backend may be waking up. Please wait a moment and try again.';
          } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
            errorMessage = 'Request timed out. This is common with Hugging Face Spaces due to cold starts. The backend may be waking up. Please wait a moment and try again.';
          } else if (err.response?.status === 0) {
            errorMessage = 'Unable to connect to the server. This is often due to Hugging Face Spaces cold starts. The backend may be waking up. Please wait a moment and try again.';
          } else if (err.response?.status >= 500) {
            errorMessage = 'Server error. This may be due to Hugging Face Spaces cold starts. Please try again in a moment.';
          } else if (err.response?.status === 401) {
            errorMessage = 'Unauthorized. Please log in again.';
            // Optionally redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          } else if (err.response?.status === 403) {
            errorMessage = 'Access denied. Please contact support.';
          } else if (err.response?.status === 404) {
            errorMessage = 'Server endpoint not found. Please check if the backend is running properly.';
          } else if (err.message) {
            errorMessage = err.message;
          }

          setError(errorMessage);
          throw new Error(errorMessage);
        }
      }
    }

    // This line should not be reached, but included for completeness
    setLoading(false);
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    setLoading(true);
    setError(null);

    // Retry mechanism for Hugging Face Spaces cold starts
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        console.log(`Deleting task ${taskId} (attempt ${retries + 1}/${maxRetries})...`);
        await apiClient.delete(`/tasks/${taskId}`);

        // Remove the task from the UI
        setTasks(prev => prev.filter(task => task.id !== taskId));
        break; // Success, exit the retry loop
      } catch (err) {
        console.error(`Error deleting task ${taskId} (attempt ${retries + 1}):`, err);

        // Check if this is a network error that might benefit from retry
        const isRetryableError = err.code === 'ERR_NETWORK' ||
                                err.code === 'ECONNABORTED' ||
                                err.message.includes('timeout') ||
                                err.response?.status === 0 ||
                                err.response?.status >= 500;

        if (isRetryableError && retries < maxRetries - 1) {
          // Wait before retrying (exponential backoff)
          const delay = Math.pow(2, retries) * 1000; // 1s, 2s, 4s
          console.log(`Retrying in ${delay}ms due to network error...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
        } else {
          // Provide more specific error messages
          let errorMessage = 'Failed to delete task';
          if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
            errorMessage = 'Network error. This is often due to Hugging Face Spaces cold starts. The backend may be waking up. Please wait a moment and try again.';
          } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
            errorMessage = 'Request timed out. This is common with Hugging Face Spaces due to cold starts. The backend may be waking up. Please wait a moment and try again.';
          } else if (err.response?.status === 0) {
            errorMessage = 'Unable to connect to the server. This is often due to Hugging Face Spaces cold starts. The backend may be waking up. Please wait a moment and try again.';
          } else if (err.response?.status >= 500) {
            errorMessage = 'Server error. This may be due to Hugging Face Spaces cold starts. Please try again in a moment.';
          } else if (err.response?.status === 401) {
            errorMessage = 'Unauthorized. Please log in again.';
            // Optionally redirect to login
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          } else if (err.response?.status === 403) {
            errorMessage = 'Access denied. Please contact support.';
          } else if (err.response?.status === 404) {
            errorMessage = 'Server endpoint not found. Please check if the backend is running properly.';
          } else if (err.message) {
            errorMessage = err.message;
          }

          setError(errorMessage);
          throw new Error(errorMessage);
        }
      }
    }

    // This line should not be reached, but included for completeness
    setLoading(false);
  };

  // Toggle task completion status
  const toggleTaskCompletion = async (taskId) => {
    try {
      // Find the current task
      const currentTask = tasks.find(task => task.id === taskId);
      if (!currentTask) {
        throw new Error('Task not found');
      }

      // Optimistically update the UI
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));

      // Update the task on the backend - exclude the id from the data being sent
      const { id, ...taskDataWithoutId } = currentTask;
      await updateTask(taskId, { ...taskDataWithoutId, completed: !currentTask.completed });
    } catch (err) {
      console.error('Error toggling task completion:', err);

      // Provide more specific error messages
      let errorMessage = err.message || 'Failed to toggle task completion';
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        errorMessage = 'Network error. This is often due to Hugging Face Spaces cold starts. The backend may be waking up. Please wait a moment and try again.';
      } else if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = 'Request timed out. This is common with Hugging Face Spaces due to cold starts. The backend may be waking up. Please wait a moment and try again.';
      } else if (err.response?.status === 0) {
        errorMessage = 'Unable to connect to the server. This is often due to Hugging Face Spaces cold starts. The backend may be waking up. Please wait a moment and try again.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. This may be due to Hugging Face Spaces cold starts. Please try again in a moment.';
      } else if (err.response?.status === 401) {
        errorMessage = 'Unauthorized. Please log in again.';
        // Optionally redirect to login
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Please contact support.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Server endpoint not found. Please check if the backend is running properly.';
      }

      setError(errorMessage);
      // Revert optimistic update on error
      fetchTasks(); // Refresh from backend
      throw new Error(errorMessage);
    }
  };

  // Initialize tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion
  };
};

export default useTasks;