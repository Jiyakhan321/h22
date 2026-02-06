# Full-Stack Todo Application

This is a full-stack multi-user todo web application with authentication and task management capabilities.

## Architecture

- **Frontend**: Next.js 16+ application deployed on Vercel
- **Backend**: FastAPI application deployed on Hugging Face Spaces
- **Database**: PostgreSQL with SQLModel ORM
- **Authentication**: JWT-based with bcrypt password hashing

## Deployment URLs

- **Frontend**: https://h22-nlqwdpwgq-jaweria.vercel.app
- **Backend**: https://jiyamughal-backend-deploy.hf.space

## Project Structure

```
├── backend/          # FastAPI backend application
│   ├── src/
│   │   ├── api/      # API routes
│   │   ├── models/   # Database models
│   │   └── database.py
│   ├── requirements.txt
│   └── .env
├── frontend/         # Next.js frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── public/
│   ├── package.json
│   └── .env.local
└── docs/             # Documentation
```

## Environment Variables

### Backend (.env)
```env
# Database Configuration
DATABASE_URL=postgresql://...

# JWT Configuration
JWT_SECRET_KEY=...
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend URL (for CORS)
FRONTEND_URL=https://h22-nlqwdpwgq-jaweria.vercel.app

# Backend URL (for Hugging Face deployment)
BACKEND_URL=https://jiyamughal-backend-deploy.hf.space

# Other configurations
DEBUG=true
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=https://jiyamughal-backend-deploy.hf.space
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user and get JWT
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

### Tasks
- `GET /tasks` - Get user's tasks
- `POST /tasks` - Create new task
- `GET /tasks/{id}` - Get specific task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## Development Setup

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Deployment Instructions

### Backend Deployment (Hugging Face Spaces)
1. Create a Hugging Face Space with Docker or Gradio SDK
2. Add environment variables in Space settings
3. Push code to the Space repository

### Frontend Deployment (Vercel)
1. Link your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_BASE_URL=https://jiyamughal-backend-deploy.hf.space`
3. Deploy automatically on push to main branch

## Security Features

- JWT tokens with configurable expiration
- User isolation - users can only access their own tasks
- Passwords stored with bcrypt hashing
- Input validation on all endpoints
- Proper HTTP status codes for unauthorized access

## Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure FRONTEND_URL in backend .env matches your frontend URL
2. **Connection Timeout**: Hugging Face Spaces may have cold starts; retry after a moment
3. **Authentication Failures**: Check JWT token validity and expiration

### Health Check
- Backend health endpoint: `GET /health`
- Returns: `{"status": "healthy"}`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.