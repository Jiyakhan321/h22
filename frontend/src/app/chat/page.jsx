'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import ChatInterface from '../../components/ChatInterface';
import useChat from '../../hooks/useChat';
import { MessageCircle, Sparkles } from 'lucide-react';

const ChatPage = () => {
  const { user } = useAuth();
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const [activeConversationId, setActiveConversationId] = useState(null);

  const handleSendMessage = async (content) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const response = await sendMessage(user.id, content, activeConversationId);
      
      // Update the active conversation ID if a new one was created
      if (response.conversation_id && !activeConversationId) {
        setActiveConversationId(response.conversation_id);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Reset conversation when user changes
  useEffect(() => {
    if (user) {
      clearChat();
      setActiveConversationId(null);
    }
  }, [user, clearChat]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-200">
        {/* Header */}
        <header className="bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-red-accent to-primary-600 bg-clip-text text-transparent flex items-center">
                  <MessageCircle className="w-8 h-8 mr-3" />
                  AI Chat Assistant
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
                  {activeConversationId 
                    ? `Active conversation: ${activeConversationId.substring(0, 8)}...` 
                    : 'Start a new conversation'}
                </p>
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

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 h-[600px] flex flex-col">
            {error && (
              <div className="m-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 dark:text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 dark:text-red-300 text-sm font-medium">Error: {error}</span>
                </div>
              </div>
            )}
            
            <ChatInterface 
              messages={messages} 
              onSendMessage={(content) => handleSendMessage(content)} 
              isLoading={isLoading} 
            />
          </div>
          
          <div className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
            <p className="flex items-center justify-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by AI - Your conversations are securely stored and private to your account
            </p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default ChatPage;