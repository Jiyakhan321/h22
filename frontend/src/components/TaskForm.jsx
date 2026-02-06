import { useState } from 'react';
import { Plus, FileText, MessageSquare, AlertTriangle, Loader2 } from 'lucide-react';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare task data for API call
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        completed: false,
        priority
      };

      // Call the parent function which will handle the API call
      await onTaskCreated(taskData);

      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (err) {
      setError(err.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />
            <span className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <FileText className="w-4 h-4 mr-2 text-red-accent" />
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-accent focus:border-red-accent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:shadow-md"
          placeholder="What needs to be done?"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <MessageSquare className="w-4 h-4 mr-2 text-red-accent" />
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-accent focus:border-red-accent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:shadow-md"
          placeholder="Add more details about this task..."
          rows="3"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-red-accent" />
          Priority Level
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-accent focus:border-red-accent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:shadow-md"
          disabled={loading}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-red-accent to-primary-600 hover:from-red-600 hover:to-primary-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-lg hover:shadow-xl group"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
            Creating Task...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
            Create Task
          </>
        )}
      </button>
    </form>
  );
};

export default TaskForm;