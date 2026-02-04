# Testing & Deployment Skill

## Purpose
Test application and deploy to production

## When to Use
- Running tests
- Deploying to cloud
- CI/CD setup
- Manual testing

## Capabilities
- Backend API testing (pytest)
- Frontend testing
- Integration testing
- Vercel deployment
- Railway deployment

## Testing
```bash
# Backend tests
cd backend
pytest tests/ -v --cov=app

# Frontend tests
cd frontend
npm test
```

## Deployment
```bash
# Frontend to Vercel
cd frontend
vercel

# Backend to Railway
cd backend
railway init
railway up
```

## Usage
```
Use @testing skill to test and deploy application
```

## Commands
- "Run backend tests"
- "Deploy to Vercel"
- "Deploy to Railway"
- "Create test suite"
