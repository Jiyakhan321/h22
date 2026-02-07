import { useState, useCallback } from 'react';
import { sendMessage } from '../services/chat_api';

const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessageHandler = useCallback(async (userId, content, conversationId = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const messageData = {
        message: content,
        ...(conversationId && { conversation_id: conversationId }),
      };

      const response = await sendMessage(userId, messageData);

      // Update messages with both user and agent response
      setMessages(prev => [
        ...prev,
        { 
          id: response.user_message.id, 
          content: response.user_message.content, 
          sender: response.user_message.sender, 
          timestamp: new Date(response.user_message.timestamp) 
        },
        { 
          id: response.agent_response.id, 
          content: response.agent_response.content, 
          sender: response.agent_response.sender, 
          timestamp: new Date(response.agent_response.timestamp) 
        }
      ]);

      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage: sendMessageHandler,
    clearChat,
  };
};

export default useChat;