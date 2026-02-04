# Quickstart Guide: Frontend UI & User Experience

**Created**: 2026-01-22
**Feature**: Frontend UI & User Experience

## Overview

This guide provides a rapid setup and development process for the modern, responsive Todo web interface that consumes authenticated REST APIs from the FastAPI backend.

## Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Access to the backend API (FastAPI server running)

## Setup Instructions

### 1. Clone and Navigate

```bash
git clone [repository-url]
cd frontend
```

### 2. Install Dependencies

```bash
npm install next react react-dom @types/react @types/node @types/react-dom
npm install axios tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configure Environment Variables

```bash
# Create .env.local file with:
NEXT_PUBLIC_API_BASE_URL="http://localhost:8000/api"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Configure Tailwind CSS

Update `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add Tailwind directives to `src/styles/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 5. Running the Application

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

## Architecture Overview

### Frontend Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.js          # Root layout with authentication context
│   │   ├── page.js            # Home page (redirects to dashboard if authenticated)
│   │   ├── dashboard/         # Main task management page
│   │   │   ├── page.jsx       # Task list and form
│   │   │   └── loading.jsx    # Loading state for dashboard
│   │   ├── login/             # Authentication page
│   │   │   └── page.jsx       # Login form
│   │   └── signup/            # Registration page
│   │       └── page.jsx       # Signup form
│   ├── components/
│   │   ├── TaskList.jsx       # Displays user's tasks with filtering
│   │   ├── TaskForm.jsx       # Form for creating/updating tasks
│   │   ├── TaskItem.jsx       # Individual task display with action buttons
│   │   ├── LoginForm.jsx      # User login form with validation
│   │   ├── SignupForm.jsx     # User registration form with validation
│   │   ├── Navigation.jsx     # App navigation with auth status
│   │   └── ProtectedRoute.jsx # Wrapper for authenticated routes
│   ├── services/
│   │   ├── api.js             # API client with JWT token handling
│   │   └── auth.js            # Authentication service
│   ├── context/
│   │   └── AuthContext.js     # Authentication state management
│   ├── hooks/
│   │   ├── useAuth.js         # Authentication state hook
│   │   └── useTasks.js        # Task management hook
│   └── styles/
│       └── globals.css        # Global styles and Tailwind directives
├── public/                    # Static assets
├── package.json               # Project dependencies and scripts
└── tailwind.config.js         # Tailwind CSS configuration
```

## UI Components

### Core Components

- **TaskList**: Displays user's tasks with filtering and sorting capabilities
- **TaskForm**: Handles creation and editing of tasks with validation
- **TaskItem**: Individual task display with completion toggle and delete button
- **Navigation**: Responsive navigation bar with user authentication status
- **LoginForm/SignupForm**: Authentication forms with validation and error handling
- **ProtectedRoute**: Higher-order component for authentication-gated routes

### Responsive Design

The UI is designed to be fully responsive:

- **Mobile (320px-768px)**: Single column layout with touch-friendly controls
- **Tablet (768px-1024px)**: Adaptable grid layout with optimized touch targets
- **Desktop (1024px+)**: Multi-column layout with enhanced features and productivity tools

## API Integration

### Authentication Flow

1. **Protected Routes**: Unauthenticated users are redirected to login
2. **JWT Handling**: All API calls automatically include JWT tokens via axios interceptors
3. **Token Validation**: Frontend validates token expiration and refreshes when needed
4. **Session Management**: Proper logout functionality with token clearing

### Task Management Flow

1. **Fetch Tasks**: Load user's tasks from backend on dashboard access
2. **Create Task**: Send new task data to backend, update UI optimistically
3. **Update Task**: Send updates to backend, reflect changes in UI
4. **Delete Task**: Remove from backend, update UI immediately
5. **Status Updates**: Toggle completion status with instant UI feedback

## State Management

### Global State (Context API)

- **Authentication State**: User session information and authentication status
- **Task State**: Current task list, loading states, and error states
- **UI State**: Notifications, modals, and other transient UI elements

### Local State (Component Hooks)

- **Form State**: Individual form field values and validation errors
- **Component State**: Temporary UI states like loading indicators or edit modes

## Error Handling

### Loading States

- **Initial Load**: Skeleton screens while data loads
- **API Operations**: Loading indicators during create/update/delete operations
- **Background Sync**: Discrete indicators for background operations

### Error Messages

- **User-Friendly**: Clear, actionable error messages
- **Contextual**: Errors appear near the relevant UI element
- **Recovery Options**: Suggestions for resolving issues
- **Non-Technical**: Avoid exposing technical details to users

## Development Workflow

### Running Locally

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test
```

### Component Development

Each component follows the pattern:

```jsx
// components/ComponentName.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ComponentName({ props }) {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState(initialState);

  // Effects and event handlers

  return (
    // JSX with Tailwind classes
  );
}
```

## Testing the UI

### Authentication Flow

1. Visit the dashboard page while unauthenticated → Redirect to login
2. Login with valid credentials → Redirect to dashboard
3. Visit dashboard again → Tasks load successfully
4. Logout → Return to login page

### Task Management Flow

1. Create a new task → Task appears in list with loading state
2. Update task status → Change reflected immediately with backend sync
3. Edit task details → Changes saved to backend with optimistic update
4. Delete task → Task removed from list and backend with undo option

## Troubleshooting

- **API calls not including JWT**: Check that axios interceptors are properly configured in `services/api.js`
- **Redirects not working**: Verify that ProtectedRoute component is properly implemented
- **Responsive design issues**: Test on multiple screen sizes using browser dev tools
- **State inconsistencies**: Check that UI correctly reflects backend state after operations
- **Authentication failures**: Verify backend API is running and accessible at configured URL
- **CORS issues**: Ensure backend allows requests from frontend origin