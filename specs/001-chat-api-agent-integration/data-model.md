# Data Model: Chat API, Conversation Persistence & Agent Backend Integration

## Entity: Conversation
- **Fields**:
  - id (UUID/string): Unique identifier for the conversation
  - user_id (string): Reference to the authenticated user who owns this conversation
  - created_at (timestamp): When the conversation was started
  - updated_at (timestamp): When the conversation was last updated
  - title (string, optional): Auto-generated title based on first user message or topic

- **Relationships**:
  - One-to-many with Message (one conversation contains many messages)

- **Validation rules**:
  - user_id must match authenticated user in JWT
  - created_at and updated_at automatically managed by system

## Entity: Message
- **Fields**:
  - id (UUID/string): Unique identifier for the message
  - conversation_id (string): Reference to the parent conversation
  - sender_type (enum: "user" | "agent"): Identifies the message source
  - content (text): The actual message content
  - timestamp (timestamp): When the message was created
  - sequence_number (integer): Order of message in conversation (starting from 0)

- **Relationships**:
  - Many-to-one with Conversation (many messages belong to one conversation)

- **Validation rules**:
  - conversation_id must exist and belong to authenticated user
  - sender_type restricted to allowed values
  - content must not be empty
  - sequence_number must be consistent with other messages in conversation

## Entity: User (existing from auth system)
- **Fields**:
  - id (string): Unique identifier from JWT authentication
  - created_at (timestamp): Account creation time
  - updated_at (timestamp): Last account update time

- **Validation rules**:
  - User must be authenticated via JWT for all chat operations
  - User ID in JWT must match the user ID in the operation

## State Transitions
- Conversation: Created when first user message is sent without conversation_id
- Message: Created when user sends a message or agent generates a response
- Both entities are immutable once created (updates only to updated_at timestamp)

## Indexes
- Conversation: index on user_id for efficient user-specific queries
- Message: composite index on (conversation_id, sequence_number) for ordered retrieval
- Message: index on conversation_id for efficient conversation message retrieval