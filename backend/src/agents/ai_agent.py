import json
import re
from typing import Dict, Any, List
from src.mcp_tools.task_tools import TaskTools


class AIAgent:
    """AI agent that processes natural language and uses MCP tools to manage tasks"""
    
    def __init__(self):
        self.tools = {
            "add_task": TaskTools.add_task,
            "list_tasks": TaskTools.list_tasks,
            "complete_task": TaskTools.complete_task,
            "delete_task": TaskTools.delete_task,
            "update_task": TaskTools.update_task
        }
    
    def extract_task_id(self, text: str) -> str:
        """
        Extract task ID from text using various patterns.
        This is a simplified implementation - in a real system, you might use more sophisticated NLP.
        """
        # Look for UUID patterns in the text
        uuid_pattern = r'[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}'
        matches = re.findall(uuid_pattern, text, re.IGNORECASE)
        if matches:
            return matches[0]
        
        # If no UUID found, return None
        return None
    
    def detect_intent(self, user_message: str) -> Dict[str, Any]:
        """
        Detect user intent and extract relevant parameters from the message.
        
        Args:
            user_message: The user's natural language message
            
        Returns:
            Dictionary with detected intent and parameters
        """
        user_message_lower = user_message.lower().strip()
        
        # Intent detection patterns
        if any(keyword in user_message_lower for keyword in ["add", "create", "new", "remember", "remind"]):
            # Extract title and description
            # Simple extraction - in a real system, use NLP
            title_match = re.search(r'"([^"]+)"|\'([^\']+)\'|([^.!?]+)', user_message)
            title = ""
            if title_match:
                title = title_match.group(1) or title_match.group(2) or title_match.group(3)
                title = title.strip()
            
            # If title is too long or contains multiple sentences, just take the first part
            if ". " in title:
                title = title.split(". ")[0]
            
            return {
                "tool_name": "add_task",
                "params": {
                    "title": title if title else "New task",
                    "description": user_message
                }
            }
        
        elif any(keyword in user_message_lower for keyword in ["list", "show", "see", "view", "my tasks", "what"]):
            # Determine status filter
            status = "all"
            if "pending" in user_message_lower or "incomplete" in user_message_lower:
                status = "pending"
            elif "done" in user_message_lower or "completed" in user_message_lower:
                status = "completed"
            
            return {
                "tool_name": "list_tasks",
                "params": {
                    "status": status
                }
            }
        
        elif any(keyword in user_message_lower for keyword in ["complete", "done", "finish", "finished", "mark done"]):
            task_id = self.extract_task_id(user_message)
            if not task_id:
                # Ask for clarification
                return {
                    "tool_name": None,
                    "params": {},
                    "clarification_needed": "Which task would you like to mark as completed? Please provide the task ID or more details."
                }
            
            return {
                "tool_name": "complete_task",
                "params": {
                    "task_id": task_id
                }
            }
        
        elif any(keyword in user_message_lower for keyword in ["delete", "remove", "kill", "erase"]):
            task_id = self.extract_task_id(user_message)
            if not task_id:
                # Ask for clarification
                return {
                    "tool_name": None,
                    "params": {},
                    "clarification_needed": "Which task would you like to delete? Please provide the task ID or more details."
                }
            
            return {
                "tool_name": "delete_task",
                "params": {
                    "task_id": task_id
                }
            }
        
        elif any(keyword in user_message_lower for keyword in ["update", "change", "modify", "edit"]):
            task_id = self.extract_task_id(user_message)
            if not task_id:
                # Ask for clarification
                return {
                    "tool_name": None,
                    "params": {},
                    "clarification_needed": "Which task would you like to update? Please provide the task ID or more details."
                }
            
            # Extract new title or description
            title_match = re.search(r'as "(.*?)"|to "(.*?)"|"(.*?)"', user_message)
            new_title = None
            if title_match:
                new_title = title_match.group(1) or title_match.group(2) or title_match.group(3)
            
            return {
                "tool_name": "update_task",
                "params": {
                    "task_id": task_id,
                    "title": new_title
                }
            }
        
        else:
            # Unknown intent
            return {
                "tool_name": None,
                "params": {},
                "clarification_needed": "I'm not sure what you'd like to do. You can ask me to add, list, complete, update, or delete tasks."
            }
    
    def process_message(self, user_message: str, user_id: str, conversation_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Process a user message and return an appropriate response.
        
        Args:
            user_message: The user's natural language message
            user_id: The ID of the user
            conversation_history: History of previous messages in the conversation
            
        Returns:
            Dictionary with response and any tool calls
        """
        # Detect intent from the user message
        intent_result = self.detect_intent(user_message)
        
        if intent_result.get("clarification_needed"):
            return {
                "response": intent_result["clarification_needed"],
                "tool_calls": [],
                "needs_clarification": True
            }
        
        tool_name = intent_result["tool_name"]
        params = intent_result["params"]
        
        if not tool_name:
            return {
                "response": "I'm not sure what you'd like to do. You can ask me to add, list, complete, update, or delete tasks.",
                "tool_calls": [],
                "needs_clarification": False
            }
        
        # Add user_id to params for all operations
        params["user_id"] = user_id
        
        # Execute the tool
        try:
            tool_func = self.tools[tool_name]
            result = tool_func(**params)
            
            # Format the response based on the tool result
            if result["success"]:
                response = result["message"]
            else:
                response = f"Sorry, I couldn't perform that action: {result['message']}"
            
            return {
                "response": response,
                "tool_calls": [{
                    "tool_name": tool_name,
                    "params": params,
                    "result": result
                }],
                "needs_clarification": False
            }
        except Exception as e:
            return {
                "response": f"Sorry, I encountered an error: {str(e)}",
                "tool_calls": [],
                "needs_clarification": False
            }