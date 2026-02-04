# Database Designer Skill

## Purpose
Design PostgreSQL database schema with proper indexes and constraints

## When to Use
- Designing database schema
- Creating indexes
- Foreign key relationships
- Query optimization

## Capabilities
- Table design
- Index creation
- Constraint definition
- SQLModel implementation
- Migration scripts

## Schema
```sql
-- Users table
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

## Usage
```
Use @database skill to design PostgreSQL schema with indexes
```

## Commands
- "Design database schema"
- "Create indexes"
- "Define constraints"
- "Implement SQLModel"
