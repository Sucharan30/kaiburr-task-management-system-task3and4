# CI/CD Pipeline (GitHub Actions)

This project includes a GitHub Actions CI-CD workflow that:

- Installs dependencies for frontend and backend.
- Builds the React frontend.
- Installs backend production dependencies.
- Builds Docker images for the backend and frontend.
- Optionally pushes the Docker images to Docker Hub when secrets are set.

Files added:
- `.github/workflows/ci-cd.yml` - GitHub Actions workflow.
- `backend-js/Dockerfile` - Dockerfile for the Node backend.
- `frontend/Dockerfile` - Dockerfile for the React frontend (multi-stage build).

How it runs on GitHub Actions
1. On push or pull request to the `main` branch, the workflow runs on `ubuntu-latest`.
2. It checks out the code, sets up Node.js, builds the frontend and backend steps, and builds Docker images.
3. If you provide `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` as repository secrets, the workflow will log in to Docker Hub and push the images.

Local testing (without GitHub Actions)
- Build frontend locally:

```powershell
cd frontend
npm ci
npm run build
```

- Run backend locally:

```powershell
cd backend-js
npm ci
node index.js
```

Building Docker images locally (requires Docker installed):

```powershell
# from repo root
docker build -t myrepo/task-backend:latest ./backend-js
docker build -t myrepo/task-frontend:latest ./frontend
```

Configuring secrets for pushing images
- In your GitHub repository Settings -> Secrets -> Actions, add:
  - `DOCKERHUB_USERNAME` - your Docker Hub username
  - `DOCKERHUB_TOKEN` - a Docker Hub access token or password

Notes
- The workflow tags images as `${{ github.repository }}-backend:latest` and `${{ github.repository }}-frontend:latest` by default.
- If your app requires environment variables (like `MONGODB_URI`), configure them in your deployment environment or pass them into Docker containers when running.

If you want, I can also:
- Add GitHub Actions steps to run unit tests.
- Add a deployment step (e.g., to Azure Web App, AWS ECS, or Docker Compose) once you specify the target.

## Run locally with Docker Compose

If you have Docker Desktop installed you can build and run both services with the included `docker-compose.yml`:

```powershell
# from repo root
docker compose build
# Set MONGODB_URI if you want to use an external Atlas cluster; otherwise the backend will attempt local/in-memory fallback
$env:MONGODB_URI = 'your_mongodb_uri_here'
docker compose up
```

The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:8080`.

## GitHub Actions badge (placeholder)

Add this to your README once you enable the workflow and push to `main` (replace <OWNER> and <REPO>):

```
[![CI-CD Pipeline](https://github.com/<OWNER>/<REPO>/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/ci-cd.yml)
```

## Convenience scripts (Windows)

I added small scripts to make starting/stopping and viewing logs easier on Windows. These live in the project root:

- `start-compose.cmd` (CMD) — builds and starts compose in detached mode
- `start-compose.ps1` (PowerShell) — same as above for PowerShell
- `logs-compose.cmd` — follow compose logs (CMD)
- `stop-compose.cmd` — stop and remove compose containers (CMD)
- `.env.example` — example env file to copy to `.env` and edit

Usage (CMD):
```
start-compose.cmd
logs-compose.cmd
stop-compose.cmd
```

Usage (PowerShell):
```powershell
.
\start-compose.ps1
# then to follow logs
docker compose logs -f
```
