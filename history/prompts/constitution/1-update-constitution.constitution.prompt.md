---
id: 1
title: "Update Constitution for AI Chatbot"
stage: constitution
date_iso: 2026-02-07
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: user
command: "/sp.constitution"
labels: ["constitution", "phase3", "ai-chatbot"]
spec: null
ticket: null
adr: null
pr: null
files_yaml:
 - ".specify/memory/constitution.md"
tests_yaml: []
---

# Prompt Text

```text
Project: Phase III – AI-Powered Todo Chatbot

Core principles:
- Spec-driven, agentic development only
- Stateless backend with persistent database state
- Clear separation: agent reasoning vs MCP tools vs storage
- Security-first user isolation
- Production-real AI integration

Key standards:
- All chat requests are stateless
- Conversation history loaded from DB every request
- AI agents may act only via MCP tools
- MCP tools are stateless and enforce user ownership
- JWT is the single source of user identity
- No direct DB access from agents

Technology constraints:
- Frontend: OpenAI ChatKit
- Backend: FastAPI
- AI: OpenAI Agents SDK
- MCP: Official MCP SDK
- ORM: SQLModel
- DB: Neon PostgreSQL
- Auth: Better Auth (JWT)

Development workflow:
- Follow Agentic Dev Stack strictly
- Phase III split into:
  Spec 4: Chat API & Conversations
  Spec 5: MCP Task Tools
  Spec 6: AI Agent & Chat UI
- Complete one spec before moving to next

Success criteria:
- Users manage todos via natural language
- AI correc
```

# Response Text

Updated the constitution file to reflect the AI-Powered Todo Chatbot project requirements for Phase III. The new constitution includes:

- Updated project name to "AI-Powered Todo Chatbot (Phase III)"
- Modified existing principles to account for AI/MCP integration
- Added new principles: MCP Integration Principle and AI Agent Constraints
- Updated technology constraints to reflect the new stack (OpenAI ChatKit, OpenAI Agents SDK, MCP SDK)
- Enhanced API and Security Constraints to include chat-specific requirements
- Updated governance to include AI agent operational guidelines
- Version incremented from 1.0.0 to 2.0.0 to reflect major changes
- Included a sync impact report documenting all changes made