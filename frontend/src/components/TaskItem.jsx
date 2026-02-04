import { useState } from 'react';
import { Check, Square, Edit, Trash2, Calendar, AlertTriangle, Clock } from 'lucide-react';

const TaskItem = ({ task, onTaskUpdate, onTaskDelete, onToggleTaskCompletion }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority || 'medium');
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    if (onToggleTaskCompletion) {
      setLoading(true);
      try {
        await onToggleTaskCompletion(task.id);
      } catch (error) {
        console.error('Error toggling task completion:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Fallback to update function if toggle function not provided
      setLoading(true);
      try {
        const updatedTask = {
          ...task,
          completed: !task.completed
        };
        // Call the onTaskUpdate with the full task object (it will handle extraction)
        await onTaskUpdate(updatedTask);
      } catch (error) {
        console.error('Error updating task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      const updatedTask = {
        ...task,
        title: editTitle,
        description: editDescription,
        priority: editPriority
      };
      await onTaskUpdate(updatedTask);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'medium');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await onTaskDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Priority badge color classes with red gradient for high priority
  const priorityBadgeColor = {
    low: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
    medium: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
    high: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200 dark:from-red-900/30 dark:to-pink-900/30 dark:text-red-300 dark:border-red-800'
  }[task.priority] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';

  return (
    <div className={`border border-gray-200 dark:border-gray-700 rounded-2xl p-5 mb-4 transition-all duration-300 hover:shadow-lg group ${task.completed ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-800'}`}>
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-accent focus:border-red-accent text-lg font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={loading}
            placeholder="Task title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-accent focus:border-red-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            rows="2"
            disabled={loading}
            placeholder="Task description (optional)"
          />
          <div className="flex items-center justify-between pt-2">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-accent focus:border-red-accent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              disabled={loading}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <div className="space-x-2">
              <button
                onClick={handleSaveEdit}
                disabled={loading}
                className="bg-gradient-to-r from-red-accent to-primary-600 hover:from-red-600 hover:to-primary-700 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-grow">
            <button
              onClick={handleToggleComplete}
              disabled={loading}
              className={`flex-shrink-0 w-5 h-5 mt-1 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                task.completed
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-red-accent dark:hover:border-red-accent'
              } group-hover:scale-110`}
              title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {task.completed ? (
                <Check className="w-3 h-3" />
              ) : (
                <Square className="w-3 h-3" />
              )}
            </button>
            <div className="flex-grow min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className={`text-base font-medium ${task.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                  {task.title}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityBadgeColor}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>
              {task.description && (
                <p className={`text-sm mb-2 ${task.completed ? 'line-through text-gray-500 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                  {task.description}
                </p>
              )}
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  Created: {new Date(task.created_at || task.createdAt).toLocaleDateString()}
                  {(task.updated_at || task.updatedAt) && (task.updated_at || task.updatedAt) !== (task.created_at || task.createdAt) && (
                    <span>, Updated: {new Date(task.updated_at || task.updatedAt).toLocaleDateString()}</span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="text-gray-400 hover:text-red-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Edit task"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-gray-400 hover:text-red-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete task"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;