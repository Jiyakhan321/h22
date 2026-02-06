'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { Mail, Lock, User, Loader2, Plus, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check if there's a redirect URL stored in sessionStorage
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
      sessionStorage.removeItem('redirectAfterLogin'); // Clean up

      // Redirect to the originally requested page, or default to dashboard
      const targetUrl = redirectUrl || '/dashboard';
      router.replace(targetUrl);
    }
  }, [isAuthenticated, router]);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Password validation function
  const isValidPassword = (password) => {
    return password.length >= 7;
  };

  const validateInputs = () => {
    let isValid = true;

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!isValidPassword(password)) {
      setPasswordError('Password must be at least 7 characters long');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before submitting
    if (!validateInputs()) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      console.log('Attempting registration with email:', email); // Debug log

      const result = await register(email, password, firstName, lastName);
      console.log('Registration result:', result); // Debug log

      if (result.success) {
        // Small delay to ensure auth state is fully updated in context
        await new Promise(resolve => setTimeout(resolve, 200));

        // Check if there's a redirect URL stored in sessionStorage
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        console.log('Redirect URL from sessionStorage:', redirectUrl); // Debug log
        sessionStorage.removeItem('redirectAfterLogin'); // Clean up

        // Redirect to the originally requested page, or default to dashboard
        const targetUrl = redirectUrl || '/dashboard';
        console.log('Redirecting to:', targetUrl); // Debug log

        // Use replace instead of push to avoid back button issues
        router.replace(targetUrl);
      } else {
        setError(result.error || 'Registration failed');
        console.log('Registration failed with error:', result.error); // Debug log
      }
    } catch (err) {
      console.error('Registration error:', err); // Debug log
      setError('An unexpected error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-200/60 dark:border-gray-700/60">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group">
              <Plus className="w-10 h-10 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent dark:from-red-400 dark:to-pink-400 mb-3">
              Create Account
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Join us today to get started</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 dark:bg-red-900/20 border border-red-200/60 dark:border-red-800/60 rounded-xl backdrop-blur-sm">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 dark:text-red-400 mr-2" />
                <span className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300/60 dark:border-gray-600/60 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white backdrop-blur-sm shadow-sm focus:shadow-md"
                    placeholder="First name"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <User className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300/60 dark:border-gray-600/60 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white backdrop-blur-sm shadow-sm focus:shadow-md"
                    placeholder="Last name"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border ${
                    emailError ? 'border-red-500/60' : 'border-gray-300/60 dark:border-gray-600/60'
                  } rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white backdrop-blur-sm shadow-sm focus:shadow-md`}
                  placeholder="Enter your email address"
                  disabled={loading}
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" />
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border ${
                    passwordError ? 'border-red-500/60' : 'border-gray-300/60 dark:border-gray-600/60'
                  } rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white/80 dark:bg-gray-700/80 text-gray-900 dark:text-white backdrop-blur-sm shadow-sm focus:shadow-md`}
                  placeholder="Create a strong password (at least 7 characters)"
                  disabled={loading}
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center shadow-lg hover:shadow-xl group"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                    Sign Up
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 underline decoration-red-600/50 hover:decoration-red-500"
              >
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            © 2026 TodoPro. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}