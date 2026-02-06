<!-- SYNC IMPACT REPORT:
Version change: N/A → 1.0.0
Modified principles: None (new constitution)
Added sections: All principles and sections (new constitution)
Removed sections: None (new constitution)
Templates requiring updates: ⚠ pending - .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md
Follow-up TODOs: None
-->

# Full-Stack Multi-User Todo Web Application (Phase II) Constitution

## Core Principles

### Spec-Driven Development
No manual coding allowed; all output must be generated via agents following the spec-driven development approach. All functionality must trace directly to an explicit spec requirement.

### Security-First Architecture
JWT-based authentication and user isolation must be enforced at all levels. All API routes require a valid JWT token, unauthorized requests return HTTP 401, and cross-user access attempts return HTTP 403.

### Deterministic Behavior
Same spec must produce the same system behavior consistently. Backend must be stateless (no session-based auth) and frontend must never trust client-side user IDs without JWT verification.

### Separation of Concerns
Frontend, backend, and authentication layers must be clearly isolated. Technology stack follows strict separation: Next.js 16+ (App Router only) for frontend, Python FastAPI for backend, SQLModel ORM, Neon Serverless PostgreSQL database, and Better Auth (JWT enabled) for authentication.

### Production Realism
Must use cloud database, real authentication, and RESTful API. No mock auth, no in-memory storage, no shortcuts. REST conventions must be strictly followed with proper status codes and methods.

### Agentic Dev Stack Compliance
Follow Agentic Dev Stack strictly: Write spec → Generate implementation plan → Break plan into tasks → Implement via Claude Code. Each spec must be completed and validated before moving to the next.

## Technology Constraints

Frontend: Next.js 16+ (App Router only), Backend: Python FastAPI, ORM: SQLModel, Database: Neon Serverless PostgreSQL, Authentication: Better Auth (JWT enabled), Spec engine: Claude Code + Spec-Kit Plus, Environment secrets handled via environment variables only. SQLModel schemas must reflect persistent, normalized data design.

## API and Security Constraints

API endpoints must match the defined contract exactly. Endpoints remain stable after authentication is added. User ID in URL must match user ID in decoded JWT. Backend filters all data by authenticated user. JWT verification must use a shared secret across frontend and backend. Task ownership must be enforced at query level. JWT expiration must be respected. No sensitive data exposed in API responses.

## Governance
All functionality must trace directly to an explicit spec requirement. Every API route must enforce authentication and user ownership. All PRs/reviews must verify compliance with security-first architecture. Complexity must be justified with explicit spec requirements.

**Version**: 1.0.0 | **Ratified**: 2026-01-20 | **Last Amended**: 2026-01-20