# TodoPro Frontend

This is the frontend for the TodoPro application, built with Next.js.

## GitHub Pages Deployment

This project is configured to deploy to GitHub Pages using GitHub Actions.

### Deployment Process

1. The GitHub Action workflow in `.github/workflows/github-pages.yml` automatically builds and deploys the site when changes are pushed to the `main` branch.

2. The site is built as a static export using `next export`, which creates static HTML/CSS/JS files.

3. Environment variables are managed through GitHub Secrets.

### Environment Variables

The application requires the following environment variable to connect to the backend API:

- `NEXT_PUBLIC_API_BASE_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com`)

### Setting Up GitHub Pages Deployment

1. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Select "GitHub Actions" as the source

2. Add the required environment variable in GitHub Secrets:
   - Go to Settings → Secrets and variables → Actions
   - Add a new secret named `NEXT_PUBLIC_API_BASE_URL` with your backend URL

3. The workflow will automatically build and deploy your site when you push to the `main` branch.

### Local Development

To run the development server locally:

```bash
npm install
npm run dev
```

### Building Locally

To build the static site locally:

```bash
npm install
npm run build
```

The static files will be generated in the `out/` directory.
