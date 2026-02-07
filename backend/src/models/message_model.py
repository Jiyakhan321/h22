from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional
import uuid


class MessageBase(SQLModel):
    conversation_id: uuid.UUID = Field(nullable=False)
    sender_type: str = Field(regex="^(user|agent)$", nullable=False)  # "user" or "agent"
    content: str = Field(nullable=False, min_length=1)
    sequence_number: int = Field(nullable=False)


class Message(MessageBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class MessageCreate(MessageBase):
    pass


class MessageRead(MessageBase):
    id: uuid.UUID
    timestamp: datetime