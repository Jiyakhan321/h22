# Todo Web Application Frontend

This is the frontend component of the Full-Stack Multi-User Todo Web Application, built with Next.js 16+ using the App Router.

## Features

- Modern, responsive UI using Next.js App Router
- JWT-based authentication with automatic token management
- Task management interface (create, read, update, delete tasks)
- Secure communication with backend API
- Cross-user data isolation
- Loading and error state handling

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Styling**: Tailwind CSS
- **API Client**: Axios with automatic JWT attachment
- **State Management**: React Context API
- **Runtime**: Node.js 18+

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Set environment variables:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Architecture

The frontend follows a component-based architecture with:

- **Pages**: Located in `src/app/` using Next.js App Router
- **Components**: Reusable UI components in `src/components/`
- **Services**: API and authentication logic in `src/services/`
- **Context**: Global state management in `src/context/`
- **Hooks**: Custom React hooks in `src/hooks/`

## Key Components

- **AuthContext**: Manages authentication state and user session
- **api_client**: Handles API communication with automatic JWT attachment
- **TaskList**: Displays user's tasks with filtering and sorting
- **TaskForm**: Handles task creation and editing
- **ProtectedRoute**: Ensures authentication for protected pages

## API Integration

The frontend communicates with the backend API at `/api/v1/` and automatically:

- Attaches JWT tokens to all authenticated requests
- Handles 401/403 responses with appropriate redirects
- Manages loading and error states
- Validates user permissions

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the backend API