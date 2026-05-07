# Cat Breeders Hub

A full-stack web application for cat breeders to manage their cats and communicate via real-time chat.

## Stack

- **Backend**: Django 4.2 + Django REST Framework + Django Channels + PostgreSQL + Redis
- **Frontend**: Angular 15 (module-based) + Angular Material
- **Infrastructure**: Docker + docker-compose

## Features

- JWT authentication (register, login, token refresh)
- Cat management (CRUD) with ownership enforcement
- Real-time group chat via WebSockets (Django Channels + Redis)
- REST API for messages (history)
- Angular Material UI

## Quick Start (Docker)

1. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

2. Adjust `.env` values if needed (especially `DJANGO_SECRET_KEY`)

3. Build and start all services:
   ```bash
   docker-compose up --build
   ```

4. Access the app:
   - Frontend: http://localhost
   - Backend API: http://localhost:8000/api/
   - Django Admin: http://localhost:8000/admin/

## Local Development

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Create a local .env file in backend/ with local DATABASE_URL
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register/` | Register new user |
| POST | `/api/login/` | Login (returns JWT tokens) |
| POST | `/api/token/refresh/` | Refresh JWT access token |
| GET | `/api/user/me/` | Current user info |
| GET | `/api/users/` | List all breeders |
| GET/POST | `/api/cats/` | List own cats / Create cat |
| GET/PUT/PATCH/DELETE | `/api/cats/<id>/` | Cat detail (owner only) |
| GET/POST | `/api/messages/` | Messages for general room |

## WebSocket

- URL: `ws://localhost:8000/ws/chat/<room_name>/?token=<jwt_token>`
- Message format: `{"sender": "username", "text": "...", "timestamp": "..."}`

## Project Structure

```
Cat001/
├── backend/          # Django project
│   ├── cat_breeders/ # Django project package
│   ├── users/        # CustomUser app
│   ├── cats/         # Cat model & API
│   └── chat/         # WebSocket consumer & messages API
├── frontend/         # Angular 15 app
│   └── src/app/
│       ├── core/     # Services, guards, interceptors
│       ├── auth/     # Login & Register
│       ├── cats/     # Cat CRUD
│       └── messages/ # Real-time chat
├── docker-compose.yml
└── .env
```
