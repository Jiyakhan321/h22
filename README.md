# Full-Stack Multi-User Todo Web Application (Phase II)

This is a production-grade web application that transforms a CLI Todo app into a full web application with multi-user task management, JWT-secured REST API, and frontend-backend separation.

## Features

- **Multi-user support**: Each user has their own private task list
- **Secure authentication**: JWT-based authentication with registration and login
- **Task management**: Create, read, update, and delete tasks
- **Data isolation**: Users can only access their own tasks
- **Responsive UI**: Works across different devices
- **Persistent storage**: Data stored in Neon Serverless PostgreSQL

## Tech Stack

- **Frontend**: Next.js 16+ with App Router
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT tokens with bcrypt password hashing

## Architecture

The application follows a clear separation of concerns:

- **Frontend**: Next.js application with React components
- **Backend**: FastAPI REST API with JWT authentication
- **Database**: PostgreSQL with SQLModel ORM

## Setup Instructions

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL-compatible database (Neon Serverless recommended)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and JWT secret
   ```

5. Run the application:
   ```bash
   uvicorn src.main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env.local file with:
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user and get JWT
- `POST /auth/logout` - Logout user

### Tasks

- `GET /tasks` - Get user's tasks
- `POST /tasks` - Create new task
- `GET /tasks/{id}` - Get specific task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

## Security Features

- JWT tokens with configurable expiration
- User isolation - users can only access their own tasks
- Passwords stored with bcrypt hashing
- Input validation on all endpoints
- Proper HTTP status codes (401, 403, 404) for unauthorized access

## Development

### Running Tests

Backend tests (to be implemented):
```bash
cd backend
pytest
```

Frontend tests (to be implemented):
```bash
cd frontend
npm run test
```

## Deployment

The application is designed to be deployed with:

- Backend: Hosted on a cloud provider supporting Python/FastAPI (e.g., Render.com, Railway.app)
- Frontend: Deployed on Vercel, Netlify, GitHub Pages, or similar platform
- Database: Neon Serverless PostgreSQL

### GitHub Pages Deployment (Static Export)

To deploy the frontend to GitHub Pages:

1. The project is configured with GitHub Actions workflow for automated deployment
2. The workflow is located at `.github/workflows/github-pages.yml`
3. The Next.js app is configured for static export in `frontend/next.config.js`
4. Environment variables are managed through GitHub Secrets

#### Setup GitHub Pages:

1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. Go to Settings → Secrets and variables → Actions
4. Add a new secret:
   - Name: `NEXT_PUBLIC_API_BASE_URL`
   - Value: Your backend API URL (e.g., `https://your-backend.onrender.com`)

5. The workflow will automatically build and deploy when you push to `main` branch

#### Manual GitHub Pages Deployment:

1. Build the static site:
   ```bash
   cd frontend
   npm run build
   ```

2. The static files will be in the `out/` directory
3. These will be automatically deployed via GitHub Actions

Environment variables need to be configured for the deployment environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.