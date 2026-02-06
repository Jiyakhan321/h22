'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import TaskList from '../../components/TaskList';
import TaskForm from '../../components/TaskForm';
import ProtectedRoute from '../../components/ProtectedRoute';
import useTasks from '../../hooks/useTasks';
import { Calendar, CheckCircle, Clock, AlertTriangle, Plus } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, toggleTaskCompletion } = useTasks();

  // Load tasks when component mounts and only if authenticated
  useEffect(() => {
    if (user) {  // Only fetch tasks if user is authenticated
      fetchTasks();
    }
  }, [user]); // Only re-run when user authentication status changes - removed fetchTasks to prevent infinite loop

  const handleTaskCreated = async (taskData) => {
    try {
      await createTask(taskData);
      // Tasks are automatically updated via the hook
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleTaskUpdated = async (taskIdOrTaskData, taskData) => {
    try {
      if (typeof taskIdOrTaskData === 'object' && taskIdOrTaskData.id) {
        // Called with a single task object containing id (from TaskItem edit/save)
        const { id, ...taskDataWithoutId } = taskIdOrTaskData;
        await updateTask(id, taskDataWithoutId);
      } else if (typeof taskIdOrTaskData === 'string' || typeof taskIdOrTaskData === 'number') {
        // Called with separate taskId and taskData (original intention)
        await updateTask(taskIdOrTaskData, taskData);
      } else {
        throw new Error('Invalid parameters for updateTask');
      }
      // Tasks are automatically updated via the hook
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const handleTaskDeleted = async (taskId) => {
    try {
      await deleteTask(taskId);
      // Tasks are automatically updated via the hook
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleToggleTaskCompletion = async (taskId) => {
    try {
      await toggleTaskCompletion(taskId);
      // Tasks are automatically updated via the hook
    } catch (err) {
      console.error('Error toggling task completion:', err);
    }
  };

  // Calculate task statistics
  const totalTasks = tasks.length;
 const completedTasks = tasks.filter(
  task => task && task.completed
).length;

  const pendingTasks = totalTasks - completedTasks;
 const highPriorityTasks = tasks.filter(
  task => task && task.priority === 'high'
).length;


  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-accent to-primary-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Welcome back, {user?.firstName || user?.email}!</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-300">{user?.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">Authenticated</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-accent to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-200">
                  {(user?.firstName?.charAt(0) || user?.email?.charAt(0) || '').toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-7 h-7 text-red-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTasks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedTasks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingTasks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="flex items-center">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-7 h-7 text-red-accent" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{highPriorityTasks}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Task Section */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-red-accent" />
                  Create New Task
                </h2>
                <TaskForm onTaskCreated={handleTaskCreated} />
              </div>
            </div>

            {/* Tasks List Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-red-accent" />
                      Your Tasks
                      <span className="ml-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs font-medium px-3 py-1 rounded-full">
                        {tasks.length}
                      </span>
                    </h2>
                  </div>
                </div>

                <div className="p-6">
                  {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-red-700 dark:text-red-300 text-sm font-medium">Error: {error}</span>
                      </div>
                    </div>
                  )}

                  {loading ? (
                    <div className="flex justify-center items-center py-12">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-accent mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading your tasks...</p>
                      </div>
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No tasks</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new task.</p>
                    </div>
                  ) : (
                    <TaskList
                      tasks={tasks}
                      onTaskUpdate={handleTaskUpdated}
                      onTaskDelete={handleTaskDeleted}
                      onToggleTaskCompletion={handleToggleTaskCompletion}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;