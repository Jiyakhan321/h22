from sqlmodel import Session, select
from typing import List, Optional
from datetime import datetime, timezone
import uuid
from src.models.conversation_model import Conversation, ConversationCreate
from src.models.message_model import Message, MessageCreate


class ConversationService:
    @staticmethod
    def create_conversation(user_id: str, db_session: Session) -> Conversation:
        """Create a new conversation for a user"""
        conversation = Conversation(
            user_id=user_id
        )
        
        db_session.add(conversation)
        db_session.commit()
        db_session.refresh(conversation)
        
        return conversation

    @staticmethod
    def get_conversation_by_id(conversation_id: uuid.UUID, user_id: str, db_session: Session) -> Optional[Conversation]:
        """Get a conversation by ID for a specific user (ensures user isolation)"""
        statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        return db_session.exec(statement).first()

    @staticmethod
    def get_messages_for_conversation(conversation_id: uuid.UUID, db_session: Session) -> List[Message]:
        """Get all messages for a conversation ordered by sequence number"""
        statement = select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(Message.sequence_number)
        return db_session.exec(statement).all()

    @staticmethod
    def add_message_to_conversation(
        conversation_id: uuid.UUID,
        sender_type: str,
        content: str,
        sequence_number: int,
        db_session: Session
    ) -> Message:
        """Add a message to a conversation"""
        message = Message(
            conversation_id=conversation_id,
            sender_type=sender_type,
            content=content,
            sequence_number=sequence_number
        )
        
        db_session.add(message)
        db_session.commit()
        db_session.refresh(message)
        
        return message

    @staticmethod
    def update_conversation_title(conversation_id: uuid.UUID, title: str, db_session: Session) -> Conversation:
        """Update the title of a conversation"""
        conversation = db_session.get(Conversation, conversation_id)
        if conversation:
            conversation.title = title
            conversation.updated_at = datetime.now(timezone.utc)
            db_session.add(conversation)
            db_session.commit()
            db_session.refresh(conversation)
        
        return conversation