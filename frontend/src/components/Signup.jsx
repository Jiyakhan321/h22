'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Mail, Lock, UserPlus, Loader2, Wifi, AlertCircle } from 'lucide-react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await register(email, password, firstName, lastName);
      if (result.success) {
        router.push('/dashboard'); // Redirect to dashboard after registration
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Determine icon based on error type
  const getErrorIcon = () => {
    if (error && (error.includes('timeout') || error.includes('network') || error.includes('connection'))) {
      return <Wifi className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />;
    } else if (error && (error.includes('server') || error.includes('500'))) {
      return <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" />;
    } else {
      return (
        <svg className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-dark-bg rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-red-accent to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-red-accent to-primary-600 bg-clip-text text-transparent">Create Account</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-center">
            {getErrorIcon()}
            <span className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <User className="w-4 h-4 mr-2 text-red-accent" />
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-accent focus:border-red-accent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:shadow-md"
              placeholder="John"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <User className="w-4 h-4 mr-2 text-red-accent" />
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-accent focus:border-red-accent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:shadow-md"
              placeholder="Doe"
              disabled={loading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-red-accent" />
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-accent focus:border-red-accent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:shadow-md"
            placeholder="your@email.com"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Lock className="w-4 h-4 mr-2 text-red-accent" />
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-accent focus:border-red-accent transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:shadow-md"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-red-accent to-primary-600 hover:from-red-600 hover:to-primary-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-lg hover:shadow-xl group"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
              Sign Up
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-red-accent hover:text-primary-700 font-medium hover:underline transition-colors duration-200">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;