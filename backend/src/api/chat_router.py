from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session
from typing import Optional
import uuid
from src.database import get_session
from src.models.conversation_model import Conversation
from src.models.message_model import MessageCreate, MessageRead
from src.services.conversation_service import ConversationService
from src.agents.ai_agent import AIAgent
from src.middleware.auth_middleware import get_current_user_from_token

chat_router = APIRouter()
security = HTTPBearer()

@chat_router.post("/api/{user_id}/chat")
def chat_endpoint(
    user_id: str,
    message_data: dict,  # Contains 'message' and optional 'conversation_id'
    current_user: dict = Depends(get_current_user_from_token),
    db_session: Session = Depends(get_session)
):
    """
    Main chat endpoint that handles both new conversations and existing ones
    """
    # Verify that the requesting user matches the user_id in the path
    # This ensures user isolation - users can only access their own conversations
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only access your own conversations"
        )

    # Extract message and optional conversation_id from request
    user_message = message_data.get("message")
    conversation_id_str = message_data.get("conversation_id")

    if not user_message or not user_message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message content is required"
        )

    # Convert conversation_id to UUID if provided
    conversation_id = None
    if conversation_id_str:
        try:
            conversation_id = uuid.UUID(conversation_id_str)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid conversation_id format"
            )

    # Get or create conversation
    if conversation_id:
        # Try to get existing conversation for this user
        conversation = ConversationService.get_conversation_by_id(
            conversation_id, user_id, db_session
        )
        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Conversation not found or access denied"
            )
    else:
        # Create new conversation
        conversation = ConversationService.create_conversation(user_id, db_session)

    # Get conversation history for context
    conversation_history = ConversationService.get_messages_for_conversation(
        conversation.id, db_session
    )

    # Determine the next sequence number
    next_sequence_number = len(conversation_history)

    # Add user message to conversation
    user_message_obj = ConversationService.add_message_to_conversation(
        conversation.id,
        "user",
        user_message,
        next_sequence_number,
        db_session
    )

    # Generate agent response using the AI agent
    ai_agent = AIAgent()

    # Convert SQLModel objects to simple dictionaries for the AI agent
    history_for_agent = []
    for msg in conversation_history:
        try:
            # Create a simple dictionary representation of the message
            message_dict = {
                'id': str(msg.id),  # Convert UUID to string
                'conversation_id': str(msg.conversation_id),  # Convert UUID to string
                'sender_type': msg.sender_type,
                'content': msg.content,
                'sequence_number': msg.sequence_number,
                'timestamp': msg.timestamp.isoformat() if hasattr(msg.timestamp, 'isoformat') else str(msg.timestamp)
            }
            history_for_agent.append(message_dict)
        except Exception as e:
            print(f"Error converting message to dictionary: {str(e)}")
            # Skip this message if there's an error converting it
            continue

    # Process the user message with the AI agent
    agent_response_data = ai_agent.process_message(
        user_message=user_message,
        user_id=user_id,
        conversation_history=history_for_agent
    )

    # Extract the response and any tool calls
    agent_response = agent_response_data["response"]
    tool_calls = agent_response_data.get("tool_calls", [])

    # Add agent response to conversation
    agent_message_obj = ConversationService.add_message_to_conversation(
        conversation.id,
        "agent",
        agent_response,
        next_sequence_number + 1,
        db_session
    )

    # If this is the first message in the conversation, set the title based on the user's message
    if len(conversation_history) == 0:
        title = user_message[:50] + "..." if len(user_message) > 50 else user_message
        ConversationService.update_conversation_title(conversation.id, title, db_session)

    # Return response with conversation_id and messages
    return {
        "conversation_id": str(conversation.id),
        "message_id": str(agent_message_obj.id),
        "response": agent_response,
        "timestamp": agent_message_obj.timestamp.isoformat(),
        "tool_calls": tool_calls,
        "user_message": {
            "id": str(user_message_obj.id),
            "content": user_message,
            "sender": "user",
            "timestamp": user_message_obj.timestamp.isoformat()
        },
        "agent_response": {
            "id": str(agent_message_obj.id),
            "content": agent_response,
            "sender": "agent",
            "timestamp": agent_message_obj.timestamp.isoformat()
        }
    }


@chat_router.get("/api/{user_id}/conversations/{conversation_id}")
def get_conversation_history(
    user_id: str,
    conversation_id: str,
    current_user: dict = Depends(get_current_user_from_token),
    db_session: Session = Depends(get_session)
):
    """
    Get the history of a specific conversation
    """
    # Verify that the requesting user matches the user_id in the path
    if current_user["user_id"] != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You can only access your own conversations"
        )

    try:
        conv_id = uuid.UUID(conversation_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid conversation_id format"
        )

    # Get conversation for this user
    conversation = ConversationService.get_conversation_by_id(conv_id, user_id, db_session)
    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or access denied"
        )

    # Get messages for this conversation
    messages = ConversationService.get_messages_for_conversation(conv_id, db_session)

    return {
        "conversation_id": str(conversation.id),
        "title": conversation.title,
        "created_at": conversation.created_at.isoformat(),
        "updated_at": conversation.updated_at.isoformat(),
        "messages": [
            {
                "id": str(msg.id),
                "conversation_id": str(msg.conversation_id),
                "sender": msg.sender_type,
                "content": msg.content,
                "sequence_number": msg.sequence_number,
                "timestamp": msg.timestamp.isoformat()
            } for msg in messages
        ]
    }