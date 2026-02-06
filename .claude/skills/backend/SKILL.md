# Backend Developer Skill

## Purpose
Implement FastAPI backend with SQLModel and PostgreSQL

## When to Use
- Building REST API
- Database integration
- JWT middleware
- CRUD operations

## Capabilities
- FastAPI app setup
- SQLModel ORM
- JWT verification
- CRUD endpoints
- Error handling
- CORS configuration

## Project Structure
```
backend/
├── app/
│   ├── main.py
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── db/
├── requirements.txt
└── .env
```

## Dependencies
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlmodel==0.0.14
psycopg2-binary==2.9.9
pyjwt==2.8.0
python-dotenv==1.0.0
```

## Usage
```
Use @backend skill to implement FastAPI REST API with 6 endpoints
```

## Commands
- "Create FastAPI app"
- "Implement JWT middleware"
- "Create CRUD routes"
- "Setup database connection"

## Running
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```
