# Task Management System

This project is a full-stack application built with Node.js/Express (backend) and React with TypeScript (frontend) that provides a REST API for managing and executing tasks with MongoDB storage.

## 📋 **Task Completion Status**

This project combines and completes **Tasks 3, and 4** from the Kaiburr Assessment:

- **Task 3: Web UI Forms** ✅ (React 19 + TypeScript + Material-UI)
- **Task 4: CI/CD Pipeline** ✅ (GitHub Actions + Docker)

## Project Structure

```
task-management-system/
├── backend/                 # Node.js/Express backend
│   ├── index.js
│   ├── mongo-connector.js
│   ├── package.json
│   └── Dockerfile
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── TaskList.tsx
│   │   ├── App.tsx
│   │   └── App.css
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 14 or higher
- MongoDB
- Docker (optional, for containerized deployment)

## Setup Instructions

### Backend Setup

1. Start MongoDB:
   ```sh
   mongod
   ```

2. Navigate to the backend directory:
   ```sh
   cd backend
   ```

3. Install dependencies and run the Node.js application:
   ```sh
   npm install
   npm start
   ```

The backend server will start on http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```

The frontend application will start on http://localhost:3000

## API Endpoints

The following REST endpoints are available:

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get a task by ID
- `PUT /api/tasks` - Create a new task
- `DELETE /api/tasks/{id}` - Delete a task
- `GET /api/tasks/search?name={name}` - Search tasks by name
- `PUT /api/tasks/{id}/execute` - Execute a task and store its output



## Technologies Used

- Backend:
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - CORS, Helmet for security

- Frontend:
  - React 18
  - TypeScript
  - Axios for API calls

- Database:
  - MongoDB

- DevOps:
  - Docker & Docker Compose
  - GitHub Actions CI/CD

## Features

- Create, read, update, and delete tasks
- Search tasks by name
- Execute shell commands and store their output
- Validation for unsafe commands
- Responsive user interface
- Real-time task execution feedback