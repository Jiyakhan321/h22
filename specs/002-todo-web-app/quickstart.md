# Quickstart Guide: Full-Stack Multi-User Todo Web Application

**Created**: 2026-01-20
**Feature**: Full-Stack Multi-User Todo Web Application (Phase II)

## Overview

This guide provides a rapid setup and deployment process for the Full-Stack Multi-User Todo Web Application featuring:
- Next.js 16+ frontend with App Router
- Python FastAPI backend
- JWT-based authentication with Better Auth
- Neon Serverless PostgreSQL database
- Complete user isolation and task management

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL-compatible database (Neon Serverless recommended)
- Git

## Setup Instructions

### 1. Clone and Navigate

```bash
git clone [repository-url]
cd todo-web-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi sqlmodel python-multipart python-jose[cryptography] passlib[bcrypt] uvicorn psycopg[binary]

# Set environment variables
export DATABASE_URL="postgresql://username:password@localhost:5432/todo_app"
export JWT_SECRET_KEY="your-super-secret-jwt-key-here"
export JWT_ALGORITHM="HS256"
export JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install next react react-dom @types/react @types/node

# Set environment variables
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### 4. Database Setup

```bash
# Using Neon Console or CLI, create a new project
# Get the connection string and update DATABASE_URL

# Run database migrations (using SQLModel's migration system)
cd backend
python -c "
from sqlmodel import SQLModel
from database import engine
from models.user import User
from models.todo_task import TodoTask

SQLModel.metadata.create_all(engine)
"
```

### 5. Running the Application

#### Backend:
```bash
cd backend
uvicorn main:app --reload --port 8000
```

#### Frontend:
```bash
cd frontend
npm run dev
```

## API Endpoints

### Authentication
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user and get JWT
- POST `/auth/logout` - Logout user

### Tasks
- GET `/tasks` - Get user's tasks
- POST `/tasks` - Create new task
- GET `/tasks/{id}` - Get specific task
- PUT `/tasks/{id}` - Update task
- DELETE `/tasks/{id}` - Delete task

## Testing the Application

### 1. Register a new user:
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123", "firstName":"Test", "lastName":"User"}'
```

### 2. Login to get JWT token:
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123"}'
```

### 3. Create a task:
```bash
curl -X POST http://localhost:8000/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title":"Sample task", "description":"This is a sample task", "priority":"medium"}'
```

## Security Features

- JWT tokens with configurable expiration
- User isolation - users can only access their own tasks
- Passwords stored with bcrypt hashing
- Input validation on all endpoints
- Proper HTTP status codes (401, 403, 404) for unauthorized access

## Troubleshooting

- **Database connection errors**: Verify DATABASE_URL is correct
- **JWT validation errors**: Check JWT_SECRET_KEY matches between frontend and backend
- **CORS issues**: Ensure frontend and backend URLs are properly configured
- **User isolation not working**: Verify that authentication middleware is properly checking user ownership