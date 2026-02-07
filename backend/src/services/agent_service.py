# This file is deprecated. The new AI agent implementation is in src/agents/ai_agent.py
# This service is no longer used but kept for reference if needed.

import os
from typing import Dict, Any, List
from src.models.message_model import MessageRead
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class AgentService:
    def __init__(self):
        # Initialize OpenAI client with API key from environment
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("WARNING: OPENAI_API_KEY environment variable is not set. Using mock responses.")
            self.api_key = None
        else:
            self.api_key = api_key
            self.client = OpenAI(api_key=api_key)

    def get_agent_response(self, user_message: str, conversation_history: List[dict]) -> str:
        """
        Generate a response from the agent based on user message and conversation history
        """
        # If no API key is configured, return a mock response
        if not self.api_key:
            # Provide a more realistic mock response that simulates an AI assistant
            mock_responses = {
                "hello": "Hello! I'm your AI assistant. To enable full AI capabilities, please configure the OPENAI_API_KEY environment variable.",
                "hi": "Hi there! I'm your AI assistant. To enable full AI capabilities, please configure the OPENAI_API_KEY environment variable.",
                "how are you": "I'm doing well, thank you for asking! I'm your AI assistant. To enable full AI capabilities, please configure the OPENAI_API_KEY environment variable.",
                "help": "I'd be happy to help! I'm your AI assistant. To enable full AI capabilities, please configure the OPENAI_API_KEY environment variable.",
                "default": f"I received your message: '{user_message}'. I'm your AI assistant. To enable full AI capabilities, please configure the OPENAI_API_KEY environment variable."
            }

            lower_msg = user_message.lower().strip()
            if lower_msg in mock_responses:
                return mock_responses[lower_msg]
            elif any(word in lower_msg for word in ["hello", "hi", "hey"]):
                return mock_responses["hello"]
            elif any(word in lower_msg for word in ["help", "assist"]):
                return mock_responses["help"]
            else:
                return mock_responses["default"]

        try:
            # Prepare messages for the OpenAI API
            messages = []

            # Add conversation history
            for msg in conversation_history:
                # Handle both dictionary and MessageRead objects
                if isinstance(msg, dict):
                    sender_type = msg.get('sender_type', 'user')
                    content = msg.get('content', '')
                else:
                    # Assume it's a MessageRead object
                    sender_type = getattr(msg, 'sender_type', 'user')
                    content = getattr(msg, 'content', '')

                role = "user" if sender_type == "user" else "assistant"
                messages.append({
                    "role": role,
                    "content": content
                })

            # Add the current user message
            messages.append({
                "role": "user",
                "content": user_message
            })

            # Call the OpenAI API
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",  # You can change this to gpt-4 if preferred
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )

            # Extract and return the agent's response
            return response.choices[0].message.content.strip()

        except Exception as e:
            # In case of any error, return a generic response
            import traceback
            print(f"Error calling agent service: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")
            return "I'm sorry, I encountered an error processing your request. Please try again."