# Quickstart Guide: Authentication & Frontend–Backend Integration

**Created**: 2026-01-21
**Feature**: Authentication & Frontend–Backend Integration

## Overview

This guide provides a rapid setup and integration process for the authentication system with JWT token management between frontend and backend systems. The implementation includes Better Auth integration, secure token storage, and automatic token attachment to API requests.

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Git

## Setup Instructions

### 1. Clone and Navigate

```bash
git clone [repository-url]
cd auth-integration-feature
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi python-jose[cryptography] passlib[bcrypt] uvicorn

# Set environment variables
export JWT_SECRET_KEY="your-super-secret-jwt-key-here"
export JWT_ALGORITHM="HS256"
export JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
export BETTER_AUTH_SECRET="your-better-auth-secret"
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install next react react-dom @types/react @types/node axios

# Set environment variables
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:8000"
```

### 4. Running the Applications

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

## Authentication API Endpoints

- POST `/auth/register` - Register new user and get JWT token
- POST `/auth/login` - Login user and get JWT token
- POST `/auth/logout` - Logout user and invalidate session
- POST `/auth/refresh` - Refresh JWT access token
- GET `/auth/me` - Get current user information
- POST `/auth/verify` - Verify JWT token validity

## Frontend Authentication Flow

The authentication system implements the following flow:

1. **Signup**: Users can register with email and password
2. **Signin**: Users can login with email and password to receive JWT token
3. **Token Issuance**: JWT tokens are securely stored in memory/httpOnly cookies
4. **Automatic Attachment**: Tokens are automatically attached to API requests via axios interceptors
5. **Token Lifecycle**: Monitor expiration and refresh tokens automatically
6. **Logout**: Clear authentication state and redirect to login

## Testing the Authentication

### 1. Register a new user:
```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123", "firstName":"Test", "lastName":"User"}'
```

### 2. Login to get JWT tokens:
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"password123"}'
```

### 3. Access protected resource with JWT token:
```bash
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer YOUR_JWT_ACCESS_TOKEN_HERE"
```

### 4. Verify token validity:
```bash
curl -X POST http://localhost:8000/auth/verify \
  -H "Authorization: Bearer YOUR_JWT_ACCESS_TOKEN_HERE"
```

## Security Features

- JWT tokens with configurable expiration (default 30 minutes)
- Secure password hashing with bcrypt
- Input validation on all authentication endpoints
- Proper HTTP status codes (401 for unauthorized, 403 for forbidden access)
- Token refresh mechanism for seamless user experience
- Frontend stores tokens securely in memory to prevent XSS
- User identity validation from JWT payload, not client input
- Cross-user access prevention with proper authorization checks

## Architecture Diagram

```
[Frontend (Next.js)]
├── Better Auth Integration
├── Auth Context (in-memory storage)
├── API Client (axios with interceptors)
└── Authentication Components
    ├── Login
    ├── Signup
    └── Protected Routes

[Communication Layer]
├── JWT Token in Authorization Header
└── HTTPS Encrypted Channel

[Backend (FastAPI)]
├── JWT Validation Middleware
├── Auth Service
├── User Management
└── Authentication Endpoints
    ├── /auth/register
    ├── /auth/login
    ├── /auth/logout
    ├── /auth/refresh
    ├── /auth/me
    └── /auth/verify
```

## Troubleshooting

- **JWT validation errors**: Check that JWT_SECRET_KEY matches between frontend and backend
- **CORS issues**: Ensure frontend and backend URLs are properly configured
- **Token expiration**: Use refresh endpoints to obtain new access tokens
- **Cross-user access**: Verify that backend validates user ID in JWT against requested resources
- **Better Auth integration**: Ensure BETTER_AUTH_SECRET is consistent across environments
- **Token storage**: Verify tokens are stored securely in memory and cleared on logout
- **Axios interceptors**: Check that automatic token attachment is working correctly