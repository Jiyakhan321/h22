# Data Model: Authentication & Frontend–Backend Integration

**Created**: 2026-01-21
**Feature**: Authentication & Frontend–Backend Integration

## Entity Definitions

### JWT Token Claims (Virtual Entity - From JWT)

**Standard Claims**:
- `sub`: String - Subject (user identifier)
- `exp`: Integer - Expiration time (Unix timestamp)
- `iat`: Integer - Issued at time (Unix timestamp)
- `jti`: String (Optional) - JWT ID for unique identification

**Custom Claims**:
- `user_id`: UUID - Unique identifier for the user
- `email`: String - User's email address
- `roles`: Array<String> (Optional) - User roles/permissions

**Validation Rules**:
- `user_id` must be a valid UUID
- `email` must be a valid email format
- `exp` must be in the future when validated
- `iat` must be in the past when validated
- `sub` must match a valid user identifier

### Authentication Session (Conceptual)

**Frontend Storage**:
- `access_token`: String - JWT access token
- `refresh_token`: String (Optional) - JWT refresh token
- `user`: Object - User profile information
- `isAuthenticated`: Boolean - Authentication status
- `expiresAt`: Date - Token expiration time

**Validation Rules**:
- `access_token` must be stored securely in memory (avoid localStorage for access tokens)
- `refresh_token` should be stored in httpOnly cookies if used
- Session data must be cleared on logout
- `expiresAt` must be monitored for automatic refresh

### Authentication Request/Response Objects

**User Registration**:
- `email`: String - User's email address (required)
- `password`: String - User's password (required, min length 8)
- `firstName`: String (Optional) - User's first name
- `lastName`: String (Optional) - User's last name

**User Login**:
- `email`: String - User's email address (required)
- `password`: String - User's password (required)

**Auth Response**:
- `accessToken`: String - JWT access token
- `refreshToken`: String (Optional) - JWT refresh token
- `user`: Object - User profile information
  - `id`: UUID - User identifier
  - `email`: String - User's email address
  - `firstName`: String (Optional) - User's first name
  - `lastName`: String (Optional) - User's last name

## State Transitions

### Frontend Authentication State Transitions

- **Unauthenticated**: Initial state when user is not logged in
  - `isAuthenticated` = false
  - User can access public pages
  - User is redirected to login for protected resources

- **Authenticating**: When user submits login/registration
  - `isAuthenticated` = false
  - Loading state is active
  - Credentials are sent to backend

- **Authenticated**: When user has valid JWT token
  - `isAuthenticated` = true
  - `access_token` is stored securely
  - User can access protected resources
  - All API requests include JWT token

- **Token Refreshing**: When JWT token is nearing expiration
  - Background refresh is initiated
  - User session continues uninterrupted
  - New token is stored

- **Token Expired**: When JWT token has expired
  - `isAuthenticated` = false
  - User is redirected to login page
  - Session data is cleared

- **Logged Out**: When user initiates logout
  - `isAuthenticated` = false
  - JWT tokens are cleared from storage
  - User is redirected to login page

### Backend Authentication State Transitions

- **Token Validation**: When receiving a request with JWT
  - Token signature is verified
  - Token expiration is checked
  - User identity is extracted from claims

- **Authorized**: When token is valid and user has permissions
  - Request is processed normally
  - User ID is available for resource validation

- **Unauthorized**: When token is invalid, expired, or missing
  - HTTP 401 Unauthorized is returned
  - Request is not processed

- **Forbidden**: When token is valid but user lacks permissions
  - HTTP 403 Forbidden is returned
  - Request is not processed

## Security Constraints

- JWT tokens must be signed with a strong secret (256-bit minimum)
- Token expiration must be enforced on both frontend and backend
- Access tokens should have short expiration (15-30 minutes)
- Refresh tokens (if used) should have longer expiration but be invalidated on logout
- All authentication-related API endpoints must use HTTPS
- Sensitive user information should not be stored in JWT claims beyond essential identifiers
- Algorithm for JWT signing should be validated to prevent "none" algorithm attacks

## Access Control Rules

- Backend validates JWT on all protected endpoints
- User ID from JWT is used for authorization decisions
- Resource ownership is validated against JWT user ID
- Cross-user access attempts result in HTTP 403 Forbidden responses
- Missing or invalid tokens result in HTTP 401 Unauthorized responses