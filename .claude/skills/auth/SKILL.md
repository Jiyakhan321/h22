# Authentication Specialist Skill

## Purpose
Implement JWT authentication with Better Auth and FastAPI

## When to Use
- User authentication
- JWT token handling
- Protected routes
- User isolation

## Capabilities
- Better Auth setup (Frontend)
- JWT verification (Backend)
- Login/Signup flows
- Token storage
- Auth guard

## JWT Flow
```
1. User logs in → Better Auth creates JWT
2. Frontend stores token in localStorage
3. Frontend sends token with every API request
4. Backend verifies token and extracts user_id
5. Backend filters data by user_id
```

## Usage
```
Use @auth skill to implement JWT authentication
```

## Commands
- "Setup Better Auth"
- "Create JWT middleware"
- "Implement login flow"
- "Add auth guard"

## Security
- JWT verification on all routes
- user_id matching (token vs URL)
- Token expiry handling
- CORS configuration
