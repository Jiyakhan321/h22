<!-- SYNC IMPACT REPORT:
Version change: 1.0.0 → 2.0.0
Modified principles: Spec-Driven Development, Security-First Architecture, Deterministic Behavior, Separation of Concerns, Production Realism, Agentic Dev Stack Compliance (adapted for AI chatbot)
Added sections: MCP Integration Principle, AI Agent Constraints
Removed sections: None
Templates requiring updates: ⚠ pending - .specify/templates/plan-template.md, .specify/templates/spec-template.md, .specify/templates/tasks-template.md
Follow-up TODOs: None
-->

# AI-Powered Todo Chatbot (Phase III) Constitution

## Core Principles

### Spec-Driven Development
No manual coding allowed; all output must be generated via agents following the spec-driven development approach. All functionality must trace directly to an explicit spec requirement.

### Security-First Architecture
JWT-based authentication and user isolation must be enforced at all levels. All API routes require a valid JWT token, unauthorized requests return HTTP 401, and cross-user access attempts return HTTP 403. User data must be completely isolated in chat conversations.

### Deterministic Behavior
Same spec must produce the same system behavior consistently. Backend must be stateless (no session-based auth) and frontend must never trust client-side user IDs without JWT verification. Chat requests must be stateless with conversation history loaded from DB every request.

### Separation of Concerns
Frontend, backend, agent reasoning, and MCP tools must be clearly isolated. Technology stack follows strict separation: OpenAI ChatKit for frontend, Python FastAPI for backend, OpenAI Agents SDK for AI reasoning, MCP SDK for task tools, SQLModel ORM, Neon PostgreSQL database, and Better Auth (JWT enabled) for authentication.

### Production Realism
Must use cloud database, real authentication, and stateless API. No mock auth, no in-memory storage, no shortcuts. REST conventions must be strictly followed with proper status codes and methods. AI integration must be production-ready with proper error handling.

### Agentic Dev Stack Compliance
Follow Agentic Dev Stack strictly: Write spec → Generate implementation plan → Break plan into tasks → Implement via Claude Code. Each spec must be completed and validated before moving to the next. Phase III split into: Spec 4: Chat API & Conversations, Spec 5: MCP Task Tools, Spec 6: AI Agent & Chat UI.

### MCP Integration Principle
MCP tools must be stateless and enforce user ownership. AI agents may act only via MCP tools. MCP tools enforce user ownership and JWT verification. No direct DB access from agents - all data operations must go through MCP tools.

### AI Agent Constraints
AI agents must operate within defined MCP tool boundaries. All agent reasoning must be stateless with conversation context loaded from database each request. Agents must respect user identity as verified by JWT tokens and enforce user data isolation.

## Technology Constraints

Frontend: OpenAI ChatKit, Backend: Python FastAPI, AI: OpenAI Agents SDK, MCP: Official MCP SDK, ORM: SQLModel, Database: Neon PostgreSQL, Authentication: Better Auth (JWT enabled), Spec engine: Claude Code + Spec-Kit Plus, Environment secrets handled via environment variables only. SQLModel schemas must reflect persistent, normalized data design with conversation history support.

## API and Security Constraints

API endpoints must match the defined contract exactly. Endpoints remain stable after authentication is added. User ID in URL must match user ID in decoded JWT. Backend filters all data by authenticated user. JWT verification must use a shared secret across frontend and backend. Task ownership must be enforced at query level. JWT expiration must be respected. No sensitive data exposed in API responses. Chat endpoints must be stateless with all conversation history loaded from DB every request. MCP tools must enforce user ownership and authentication.

## Governance
All functionality must trace directly to an explicit spec requirement. Every API route must enforce authentication and user ownership. All PRs/reviews must verify compliance with security-first architecture. Complexity must be justified with explicit spec requirements. AI agents must only operate through approved MCP tools. User data isolation must be maintained in all chat interactions.

**Version**: 2.0.0 | **Ratified**: 2026-01-20 | **Last Amended**: 2026-02-07