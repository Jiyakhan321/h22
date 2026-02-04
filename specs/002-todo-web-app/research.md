# Research: Full-Stack Multi-User Todo Web Application (Phase II)

**Created**: 2026-01-20
**Feature**: Full-Stack Multi-User Todo Web Application (Phase II)

## Architectural Decisions

### 1. JWT-based Authentication vs Session-based Auth

**Decision**: JWT-based authentication
**Rationale**:
- Aligns with the constitution requirement for stateless backend
- Enables easy cross-domain requests between frontend and backend
- Better scalability as no server-side session storage needed
- Frontend can verify token validity without backend call
- Better for microservices architecture if needed later

**Alternatives considered**:
- Session-based auth: Requires server-side storage, doesn't meet stateless requirement
- OAuth providers only: Less control over user management, not suitable for basic todo app
- Cookie-based JWT: Possible but header-based tokens preferred for API access

### 2. User ID Handling: URL Parameter vs JWT Payload Enforcement

**Decision**: Enforce user ID from JWT payload, not URL parameter
**Rationale**:
- Prevents user enumeration and cross-user access attempts
- Maintains security by ensuring users can only access their own data
- Matches constitution requirement that "User ID in URL must match user ID in decoded JWT"
- Backend filters all data by authenticated user from JWT

**Implementation**:
- API endpoints will be user-agnostic (e.g., `/api/tasks` not `/api/users/{id}/tasks`)
- Backend extracts user ID from JWT and filters data accordingly
- Any attempt to access another user's data will result in 403 Forbidden

### 3. Database Schema Design for Tasks and Ownership

**Decision**: Direct foreign key relationship between tasks and users
**Rationale**:
- Simple and efficient querying
- Clear ownership relationship
- Enforces data isolation at database level
- Follows SQLModel best practices

**Schema**:
- `users` table: id, email, password_hash, created_at
- `todo_tasks` table: id, title, description, completed, priority, owner_id (FK to users.id), created_at, updated_at

### 4. Separation of Frontend and Backend Responsibilities

**Decision**: Backend handles authentication, authorization, and business logic; Frontend handles UI and user interactions
**Rationale**:
- Maintains clear separation of concerns as required by constitution
- Backend enforces all security rules
- Frontend provides responsive UI experience
- Follows standard web application architecture

**Responsibilities**:
- Backend: JWT verification, data validation, user isolation, database operations
- Frontend: Form handling, UI rendering, JWT storage and attachment to requests

### 5. Error Handling Strategy (401 vs 403 vs 404)

**Decision**: Use appropriate HTTP status codes as specified in constitution
**Rationale**:
- 401 Unauthorized: Invalid or missing JWT token
- 403 Forbidden: Valid token but insufficient permissions (e.g., accessing another user's data)
- 404 Not Found: Resource doesn't exist or user doesn't have access to see it exists

**Implementation**:
- Authentication middleware handles 401 responses
- Authorization checks in service layer handle 403 responses
- Resource existence checks return 404 appropriately

### 6. Deployment Configuration for Neon Serverless PostgreSQL

**Decision**: Use environment variables for database connection with Neon's serverless driver
**Rationale**:
- Neon Serverless PostgreSQL supports connection pooling and scales to zero
- Environment variables ensure secure credential handling
- Serverless database matches modern cloud architecture

**Configuration**:
- Connection string via DATABASE_URL environment variable
- SQLModel with Neon's PostgreSQL adapter
- Connection pooling configured for optimal performance

### 7. Environment Variable Strategy for Shared Secrets

**Decision**: Separate environment files for frontend and backend with shared JWT secret
**Rationale**:
- Maintains security while enabling JWT validation across frontend and backend
- Follows constitution requirement for shared secret
- Proper separation of environment concerns

**Implementation**:
- Backend: JWT_SECRET_KEY for token signing/verification
- Frontend: Does not store secret, only receives and sends tokens
- Shared configuration via documentation for deployment

## Technology Integration Patterns

### Better Auth → JWT → FastAPI Flow

1. User registers/logins through Better Auth on frontend
2. Better Auth provides JWT token to frontend
3. Frontend stores token (securely in httpOnly cookie or secure localStorage)
4. Frontend attaches token to all backend API requests in Authorization header
5. FastAPI verifies JWT using same secret as Better Auth
6. FastAPI extracts user ID from JWT payload
7. Backend enforces user-specific data access based on JWT user ID

### API Contract Approach

- RESTful endpoints following standard conventions
- JWT required in Authorization header for all authenticated endpoints
- Consistent error response format
- Proper HTTP status codes for all scenarios