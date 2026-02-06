# Data Model: Full-Stack Multi-User Todo Web Application (Phase II)

**Created**: 2026-01-20
**Feature**: Full-Stack Multi-User Todo Web Application (Phase II)

## Entity Definitions

### User Entity

**Fields**:
- `id`: UUID (Primary Key) - Unique identifier for the user
- `email`: String (Unique) - User's email address for login
- `hashed_password`: String - BCrypt hashed password
- `first_name`: String (Optional) - User's first name
- `last_name`: String (Optional) - User's last name
- `created_at`: DateTime - Timestamp when user account was created
- `updated_at`: DateTime - Timestamp when user account was last updated
- `is_active`: Boolean - Whether the account is active (default: True)

**Relationships**:
- One-to-Many: User → TodoTask (via owner_id foreign key)

**Validation Rules**:
- Email must be a valid email format
- Email must be unique across all users
- Password must meet minimum strength requirements (handled by Better Auth)
- First and last names must be 1-50 characters if provided

### TodoTask Entity

**Fields**:
- `id`: UUID (Primary Key) - Unique identifier for the task
- `title`: String - Task title (required, max 200 characters)
- `description`: Text (Optional) - Detailed task description
- `completed`: Boolean - Whether the task is completed (default: False)
- `priority`: String - Priority level (values: "low", "medium", "high", default: "medium")
- `owner_id`: UUID (Foreign Key) - References the User who owns this task
- `created_at`: DateTime - Timestamp when task was created
- `updated_at`: DateTime - Timestamp when task was last updated

**Relationships**:
- Many-to-One: TodoTask → User (via owner_id foreign key)

**Validation Rules**:
- Title must be 1-200 characters
- Description must be 0-1000 characters if provided
- Priority must be one of "low", "medium", "high"
- Owner ID must reference an existing User
- Only the owner can modify or delete the task

## Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Todo tasks table
CREATE TABLE todo_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority VARCHAR(10) DEFAULT 'medium',
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_todo_tasks_owner_id ON todo_tasks(owner_id);
CREATE INDEX idx_todo_tasks_completed ON todo_tasks(completed);
CREATE INDEX idx_todo_tasks_priority ON todo_tasks(priority);
CREATE INDEX idx_users_email ON users(email);
```

## State Transitions

### TodoTask State Transitions

- **Created**: When a new task is added by a user
  - `completed` = False (default)
  - `created_at` and `updated_at` set to current timestamp

- **Updated**: When a user modifies task details
  - `title`, `description`, `priority` can be changed
  - `updated_at` updated to current timestamp

- **Completed**: When a user marks a task as complete
  - `completed` = True
  - `updated_at` updated to current timestamp

- **Deleted**: When a user deletes a task
  - Record removed from database (CASCADE deletion handled by foreign key)

## Data Integrity Constraints

- Foreign key constraint ensures every task has a valid owner
- Cascade delete removes all tasks when a user account is deleted
- Unique constraint on email prevents duplicate user accounts
- Not-null constraints ensure required fields are always populated

## Access Control Rules

- Users can only access tasks where `owner_id` matches their user ID
- Backend enforces ownership check on all task operations
- Attempt to access another user's tasks results in 403 Forbidden response