# TodoPro Frontend Deployment Guide

This guide explains how to deploy your TodoPro frontend application to production.

## Prerequisites

- Node.js 18+ installed
- Access to a hosting platform (Vercel, Netlify, GitHub Pages, etc.)

## Environment Configuration

Make sure your `.env.local` file contains the correct backend URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://jiyamughal-todo-backend.hf.space
```

## Build Process

1. Install dependencies:
```bash
npm install
```

2. Build the application:
```bash
npm run build
```

3. If deploying to a static hosting service (like GitHub Pages):
```bash
npm run export
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

### Option 2: Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

### Option 3: GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
{
  "homepage": "https://yourusername.github.io/repository-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Build and deploy:
```bash
npm run export
npm run deploy
```

## Configuration Notes

- The application is configured to connect to the Hugging Face deployed backend at `https://jiyamughal-todo-backend.hf.space`
- JWT tokens are stored in localStorage for authentication
- The application handles CORS appropriately for cross-origin requests
- Network timeouts are set to 30 seconds to accommodate potential latency

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend allows requests from your frontend domain
2. **API Connection Issues**: Verify the `NEXT_PUBLIC_API_BASE_URL` is correctly set
3. **Authentication Problems**: Check that JWT tokens are being properly stored and sent with requests

### Verification Steps

1. Test the health endpoint: `https://jiyamughal-todo-backend.hf.space/health`
2. Verify authentication flow works properly
3. Test task creation, reading, updating, and deletion
4. Confirm protected routes are working as expected

## Production Checklist

- [ ] Environment variables are properly configured
- [ ] Backend URL points to production backend
- [ ] All API endpoints are accessible
- [ ] Authentication flow works correctly
- [ ] Error handling is robust
- [ ] Performance is acceptable
- [ ] Security measures are in place