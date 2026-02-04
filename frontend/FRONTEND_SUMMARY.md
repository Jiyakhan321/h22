# TodoPro Frontend Application Summary

## Overview
TodoPro is a modern, full-stack multi-user todo web application built with Next.js 16+ using the App Router. The frontend provides a responsive UI with JWT-based authentication, task management capabilities, and secure communication with the backend API.

## Tech Stack
- **Framework**: Next.js 16+ (App Router)
- **Runtime**: Node.js 18+
- **Styling**: Tailwind CSS
- **API Client**: Axios with automatic JWT attachment
- **State Management**: React Context API and custom hooks
- **Icons**: Lucide React
- **Authentication**: JWT-based with automatic token management

## Project Structure
```
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── dashboard/     # Dashboard page
│   │   ├── login/         # Login page
│   │   ├── signup/        # Signup page
│   │   ├── layout.js      # Root layout
│   │   └── page.js        # Home page
│   ├── components/        # Reusable UI components
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and authentication logic
│   ├── styles/            # Global styles
│   └── utils/             # Utility functions
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## Key Features

### Authentication System
- JWT-based authentication with automatic token management
- Login and registration forms with validation
- Automatic token refresh and expiration handling
- Protected routes using a custom ProtectedRoute component
- Session management using localStorage

### Task Management
- Create, read, update, and delete tasks
- Task prioritization (low, medium, high)
- Task completion toggling
- Task statistics and overview
- Responsive task list and form components

### UI/UX Features
- Responsive design for all screen sizes
- Dark/light mode toggle
- Modern gradient-based design with smooth animations
- Loading states and error handling
- Interactive elements with hover/focus effects
- Statistics dashboard with visual indicators

## Core Components

### Context Providers
- **AuthContext**: Manages authentication state, user session, and token handling
- **ThemeProvider**: Handles dark/light mode preferences (though not fully implemented)

### Services
- **AuthService**: Handles registration, login, logout, and token management
- **ApiClient**: Axios instance with base configuration, request/response interceptors, and automatic JWT attachment

### Hooks
- **useAuth**: Provides authentication state and methods
- **useTasks**: Manages task CRUD operations and state

### UI Components
- **Navigation**: Responsive navigation bar with auth-aware links
- **Login/Signup**: Forms with validation and error handling
- **TaskList/TaskItem**: Display and manage tasks
- **TaskForm**: Create new tasks with title, description, and priority
- **ProtectedRoute**: Ensures authentication for protected pages

## API Integration
- Communicates with backend API at `/api/v1/`
- Automatically attaches JWT tokens to authenticated requests
- Handles 401/403 responses with appropriate redirects
- Manages loading and error states
- Validates user permissions

## Environment Configuration
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the backend API (defaults to http://localhost:8000)

## Styling
- Tailwind CSS for utility-first styling
- Custom CSS gradients and animations
- Responsive design using Tailwind's responsive classes
- Dark mode support with seamless transitions

## Security Features
- JWT token stored in localStorage with expiration checks
- Automatic logout on token expiration
- Protected routes preventing unauthorized access
- Input validation on forms

## Development Setup
1. Install dependencies: `npm install`
2. Create environment file: `cp .env.example .env.local`
3. Set environment variables
4. Run development server: `npm run dev`

## Key Files

### Pages
- `src/app/page.js`: Landing/home page with auth-aware routing
- `src/app/dashboard/page.jsx`: Main dashboard with task management
- `src/app/login/page.jsx`: Login form with validation
- `src/app/signup/page.jsx`: Registration form with validation

### Context
- `src/context/AuthContext.js`: Authentication state management

### Services
- `src/services/auth_service.js`: Authentication logic
- `src/services/api_client.js`: API client with interceptors

### Components
- `src/components/Navigation.jsx`: Site navigation
- `src/components/ProtectedRoute.jsx`: Route protection
- `src/components/TaskList.jsx` and `TaskItem.jsx`: Task display
- `src/components/TaskForm.jsx`: Task creation form

This frontend application provides a complete, production-ready solution for managing personal tasks with secure authentication and a modern, responsive UI.