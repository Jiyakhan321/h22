# Research: Authentication & Frontend–Backend Integration

**Created**: 2026-01-21
**Feature**: Authentication & Frontend–Backend Integration

## Architectural Decisions

### 1. JWT-based Authentication vs Session-based Auth

**Decision**: JWT-based authentication
**Rationale**:
- Aligns with stateless backend architecture
- Enables easy cross-domain requests between frontend and backend
- Better scalability as no server-side session storage needed
- Frontend can verify token validity without backend call
- Better for microservices architecture if needed later

**Alternatives considered**:
- Session-based auth: Requires server-side storage, doesn't meet stateless requirement
- OAuth providers only: Less control over user management
- Cookie-based JWT: Possible but header-based tokens preferred for API access

### 2. JWT Storage Strategy on Frontend

**Decision**: Store tokens in memory/state for maximum security, with option for httpOnly cookies for refresh tokens
**Rationale**:
- Memory storage prevents XSS attacks that could steal tokens from localStorage
- httpOnly cookies prevent JavaScript access to refresh tokens
- Tokens are not persisted across browser sessions unless using refresh tokens
- Additional security layer for sensitive applications

**Alternatives considered**:
- Better Auth session: Would couple implementation to Better Auth specifically
- LocalStorage: Vulnerable to XSS attacks
- SessionStorage: Similar vulnerability to localStorage

**Implementation**:
- Access tokens stored in application state/memory
- Refresh tokens in httpOnly cookies (optional)
- Tokens cleared on logout or browser close

### 3. Token Attachment Approach

**Decision**: Central fetch wrapper/axios interceptor for automatic token attachment
**Rationale**:
- Consistent token attachment across all API requests
- Eliminates need to remember to add tokens to each request
- Centralized error handling for authentication failures
- Cleaner code with reduced duplication

**Alternatives considered**:
- Per-call attachment: Would require manual token addition to each request
- Component-level handling: Would duplicate logic across components
- Service-level wrappers: Would still require manual implementation for each service

**Implementation**:
- Axios interceptor that automatically adds Authorization header
- Automatic token refresh on 401 responses
- Centralized error handling for authentication failures

### 4. User Identity Source of Truth

**Decision**: JWT payload claims as the source of truth for user identity
**Rationale**:
- Ensures backend relies solely on validated JWT for user identity
- Prevents client-side manipulation of user identity
- Maintains security by validating against server-side secret
- Aligns with stateless authentication principles

**Alternatives considered**:
- URL parameter: Would allow user impersonation
- Request body parameter: Would allow user impersonation
- Client-side provided ID: Would allow user impersonation

**Implementation**:
- Extract user ID from JWT payload on backend
- Validate user ID against requested resource ownership
- Reject requests where JWT user ID doesn't match resource owner

### 5. Error Handling Strategy for Auth Failures

**Decision**: Automatic redirect to login page on 401 responses with error messaging
**Rationale**:
- Provides clear feedback to user when authentication fails
- Maintains security by requiring re-authentication
- Consistent user experience across the application
- Prevents unauthorized access to protected resources

**Alternatives considered**:
- Silent 401 responses: Would confuse users without feedback
- Stay on page with error overlay: Might expose sensitive information
- Modal login: Would interrupt user flow

**Implementation**:
- Global error handler for 401 responses
- Automatic redirect to login page
- Preserved intended destination for post-login redirect
- Clear error messaging to user

### 6. Token Expiration Handling

**Decision**: Automatic token refresh before expiration with fallback to login
**Rationale**:
- Provides seamless user experience without interruption
- Maintains security by using short-lived access tokens
- Handles edge cases where automatic refresh fails
- Balances security with usability

**Alternatives considered**:
- Silent failure: Would break user experience without notice
- Forced re-login: Would interrupt user workflow frequently
- Manual refresh: Would burden users with token management

**Implementation**:
- Monitor token expiration time in frontend
- Auto-refresh tokens before expiration
- Fallback to login page if refresh fails
- Background refresh for seamless experience

### 7. Environment Variable Sharing Strategy for BETTER_AUTH_SECRET

**Decision**: Shared secret via environment variables with consistent naming
**Rationale**:
- Ensures both frontend and backend use same secret for JWT validation
- Maintains security through environment-based configuration
- Simplifies deployment across different environments
- Follows security best practices for secret management

**Implementation**:
- JWT_SECRET_KEY environment variable for both frontend and backend
- Consistent naming convention across environments
- Secure deployment configuration

## Integration Patterns

### Frontend-Backend Communication

1. User authenticates through frontend interface
2. Backend verifies credentials and issues JWT token
3. Frontend stores token securely (memory/httpOnly cookie)
4. Frontend attaches token to all authenticated API requests in Authorization header
5. Backend verifies JWT and extracts user identity
6. Backend authorizes request based on user identity
7. Backend returns response or appropriate error code

### Error Handling Strategy

- 401 Unauthorized: Invalid or missing JWT token
- 403 Forbidden: Valid token but insufficient permissions
- Automatic redirect to login page on authentication failures
- Token refresh on 401 responses before redirect

## Security Considerations

### JWT Security Best Practices

- Use strong secret keys for signing
- Implement proper token expiration
- Validate token issuer and audience (if applicable)
- Use HTTPS for all authentication-related communication
- Consider implementing token blacklisting for forced logout
- Validate algorithm to prevent "none" algorithm attacks