# Stream Nest

A full-stack streaming app built with Django REST Framework for the backend and Next.js for the frontend.

## Repository Structure

- `backend/` - Django application and API
  - `apps/videos/` - video models, serializers, views
  - `apps/favorites/` - favorites/watch history features
  - `StreamNest/` - Django project settings and URLs
- `frontend/` - Next.js frontend UI
- `docker-compose.yml` - Docker Compose configuration for local services

## Features

- Django REST API for videos, favorites, ratings, and watch history
- Next.js frontend for browsing, searching, and managing a watch list
- CORS configuration for local frontend/backend development

## Prerequisites

- Python 3.11+ (or compatible)
- Node.js 20+ and npm
- Git
- Optional: Docker / Docker Compose if you want to run services in containers

## Setup

### Backend

1. Open a terminal and go to the backend folder:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Apply migrations:
   ```bash
   python manage.py migrate
   ```
4. Start the backend server:
   ```bash
   python manage.py runserver
   ```

The backend will run by default at `http://127.0.0.1:8000/`.

### Frontend

1. Open another terminal and go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js app:
   ```bash
   npm run dev
   ```

The frontend will run at `http://localhost:3000/`.

## Notes

- The backend currently uses SQLite (`backend/db.sqlite3`) by default.
- `docker-compose.yml` includes a PostgreSQL service if you want to add containerized database support later.
- CORS is configured for `http://localhost:3000` so the frontend can access the Django API during local development.

## Recommended Workflow

1. Run the Django backend
2. Run the Next.js frontend
3. Open `http://localhost:3000` in your browser

