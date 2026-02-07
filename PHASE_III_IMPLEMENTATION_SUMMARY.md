# Phase III: AI Chatbot Integration

## Overview
This document describes the implementation of the AI Chatbot integration for the Full-Stack Todo Application. The AI chatbot enables users to manage their todos using natural language through MCP tools.

## Architecture

### Components
1. **AI Agent** (`src/agents/ai_agent.py`)
   - Processes natural language requests
   - Detects user intent
   - Selects appropriate MCP tools
   - Generates human-readable responses

2. **MCP Tools** (`src/mcp_tools/task_tools.py`)
   - `add_task`: Add new tasks
   - `list_tasks`: List tasks with filtering options
   - `complete_task`: Mark tasks as completed
   - `delete_task`: Remove tasks
   - `update_task`: Modify task details

3. **Chat Router** (`src/api/chat_router.py`)
   - Handles chat endpoint requests
   - Manages conversation persistence
   - Integrates AI agent with MCP tools

## Implementation Details

### AI Agent Behavior
- Detects user intent from natural language
- Selects the correct MCP tool based on intent
- Handles missing task IDs with clarification questions
- Confirms successful actions in plain language
- Gracefully handles errors (task not found, invalid ID)
- Never hallucinates task lists or IDs

### MCP Tools
Each tool follows the same pattern:
- Accepts user_id to enforce user isolation
- Validates permissions before performing operations
- Returns structured responses with success/error status
- Updates database through existing TaskService layer

### Conversation Handling
- Conversation state is stored only in the database
- Each request reconstructs context from stored messages
- The system works correctly after server restart
- User identity comes only from verified JWT

### Security
- All operations are validated against user identity from JWT
- User isolation is enforced at the database level
- No direct database access from AI agent
- All task operations go through MCP tools

## API Endpoints

### POST /api/{user_id}/chat
- Accepts user messages and optional conversation_id
- Returns AI response and any tool calls executed
- Persists conversation in database

### GET /api/{user_id}/conversations/{conversation_id}
- Retrieves conversation history
- Validates user access to conversation

## MCP Tools Specification

### add_task
- Parameters: user_id, title, description (optional)
- Use when user wants to add/remember/create something

### list_tasks
- Parameters: user_id, status (all | pending | completed)
- Use when user asks to see tasks

### complete_task
- Parameters: user_id, task_id
- Use when user says done/completed

### delete_task
- Parameters: user_id, task_id
- Use when user wants to remove a task

### update_task
- Parameters: user_id, task_id, title/description
- Use when user wants to change a task

## Statelessness
The server is completely stateless:
- All conversation context is loaded from the database per request
- No in-memory state is maintained between requests
- Conversation history is reconstructed from stored messages
- System works correctly after restart

## Validation
- All database operations go through existing TaskService
- User isolation is enforced at database level
- JWT authentication validates user identity
- No direct database access from AI components