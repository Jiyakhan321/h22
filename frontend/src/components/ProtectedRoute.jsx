'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('ProtectedRoute useEffect - loading:', loading, 'isAuthenticated:', isAuthenticated, 'pathname:', pathname); // Debug log
    console.log('ProtectedRoute - Current token in localStorage:', !!localStorage.getItem('access_token')); // Debug log
    console.log('ProtectedRoute - Current user in context:', user); // Debug log

    if (!loading && !isAuthenticated) {
      console.log('ProtectedRoute - User is not authenticated, checking path:', pathname); // Debug log
      // Only store redirect URL if current path is not login page to avoid circular redirect
      if (pathname !== '/login' && pathname !== '/') {
        // Store the attempted route for redirect after login
        sessionStorage.setItem('redirectAfterLogin', pathname);
        console.log('ProtectedRoute - Stored redirect URL:', pathname); // Debug log
      }
      console.log('ProtectedRoute - Redirecting to login from ProtectedRoute, path was:', pathname); // Debug log
      // Redirect to login if not authenticated
      router.replace('/login');
    } else if (isAuthenticated) {
      console.log('ProtectedRoute - User is authenticated, allowing access to protected route'); // Debug log
    } else {
      console.log('ProtectedRoute - Still loading or authentication status uncertain'); // Debug log
    }
  }, [isAuthenticated, loading, router, pathname]);

  // Show loading spinner while checking authentication status
  if (loading) {
    console.log('ProtectedRoute - Loading, showing spinner'); // Debug log
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute - Finished loading, isAuthenticated:', isAuthenticated); // Debug log

  // If authenticated, render the protected content
  if (isAuthenticated) {
    console.log('ProtectedRoute - User is authenticated, rendering children'); // Debug log
    return children;
  } else {
    // If not authenticated and not loading, redirect to login
    console.log('ProtectedRoute - User not authenticated, redirecting to login'); // Debug log
    // The useEffect handles the redirect, so we can return null here
    // But we'll also add a fallback redirect in case the effect doesn't fire fast enough
    if (typeof window !== 'undefined') {
      // Only redirect on client side
      window.location.href = '/login';
    }
    return null;
  }
};

export default ProtectedRoute;