# Quickstart Guide: Chat API, Conversation Persistence & Agent Backend Integration

## Prerequisites
- Python 3.11+ installed
- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- OpenAI API key
- Better Auth configured for JWT authentication

## Setup Steps

### 1. Environment Configuration
```bash
# Backend
cp backend/.env.example backend/.env
# Add OPENAI_API_KEY and database connection details
```

### 2. Install Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### 3. Database Setup
```bash
# Run database migrations to create conversation and message tables
python backend/src/database.py migrate
```

### 4. Running the Services
```bash
# Backend (separate terminal)
cd backend
python -m uvicorn main:app --reload

# Frontend (separate terminal)
cd frontend
npm run dev
```

## Key Endpoints
- **POST /api/{user_id}/chat**: Main chat endpoint
- **Authentication**: JWT via Authorization header
- **Request**: `{"message": "...", "conversation_id": "..."}`
- **Response**: `{"conversation_id": "...", "response": "..."}`

## Testing the Feature
1. Authenticate to get JWT token
2. Send POST request to `/api/{your_user_id}/chat`
3. Verify conversation persists in database
4. Include conversation_id to resume conversation
5. Verify user isolation by testing cross-user access (should fail)

## Troubleshooting
- Ensure OPENAI_API_KEY is set correctly
- Verify database connection details
- Check JWT token validity and user_id matching
- Confirm agent service is reachable