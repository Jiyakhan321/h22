'use client';

import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, LogIn, UserPlus } from 'lucide-react';

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // Redirect authenticated users to dashboard
        router.push('/dashboard');
      }
      // Unauthenticated users stay on home page
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-accent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] bg-white dark:bg-dark-bg transition-colors duration-200">
      <div className="text-center max-w-2xl px-4">
        <div className="w-20 h-20 bg-gradient-to-r from-red-accent to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <LayoutDashboard className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-accent to-primary-600 bg-clip-text text-transparent mb-6">Welcome to TodoPro</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          A modern, secure task management application that helps you organize your life.
          Sign in to manage your personal tasks or create an account to get started.
        </p>

        {!isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="flex items-center justify-center bg-gradient-to-r from-red-accent to-primary-600 hover:from-red-600 hover:to-primary-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex-1 max-w-xs"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </a>
            <a
              href="/signup"
              className="flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex-1 max-w-xs"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Sign Up
            </a>
          </div>
        )}

        {isAuthenticated && (
          <div className="text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">You are logged in as {user?.email}</p>
            <a
              href="/dashboard"
              className="inline-flex items-center bg-gradient-to-r from-red-accent to-primary-600 hover:from-red-600 hover:to-primary-700 text-white font-bold py-3 px-6 rounded-xl transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Go to Dashboard
            </a>
          </div>
        )}
      </div>
    </div>
  );
}