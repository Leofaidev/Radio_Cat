Create a full educational/demo web application from scratch with the following stack:

- Backend:
  - Django (Python)
  - Django REST Framework
  - PostgreSQL
  - Django users and a custom user model if needed
- Frontend:
  - Angular 8+ (TypeScript)
  - Angular CLI
  - Angular Material or any other UI framework may be used
- Infrastructure:
  - the project must be packed into Docker containers (Dockerfile + docker-compose.yml)
  - it should be easy to deploy on any Ubuntu Server or on a service like Heroku / Render / Railway
- Communication:
  - frontend and backend communicate only through REST API
  - chat between breeders is implemented via WebSocket connection using Django Channels or a suitable equivalent stack

General concept:

Build an application called “Cat Breeders Hub” — a service for cat breeders.

Features:
- A user registers in the system as a cat breeder.
- A breeder can:
  - create a cat,
  - edit a cat,
  - delete a cat.
- A breeder can see and edit only their own cats, not cats belonging to other breeders.
- There is a “Messages” section where breeders communicate with each other over WebSocket.

Base data model (Django):

Create a minimal but well-thought-out model structure:

1. User
   - Use Django’s built-in auth.User or define a custom AbstractUser if needed.
   - Add a field such as is_breeder = BooleanField(default=True) to indicate that the user is a breeder.
   - Optional: add a short profile section (name, city, photo).

2. Cat
   Minimum fields:
   - name (CharField)
   - age (IntegerField or PositiveIntegerField)
   - breed (CharField)
   - is_hairy (BooleanField)
   - color (CharField, optional)
   - created_at (DateTimeField, auto timestamp)
   - updated_at (DateTimeField, auto timestamp)
   - owner (ForeignKey to User / CustomUser) — this is the key field for permission control.

   Important:
   - Each cat is always linked to exactly one breeder owner.
   - A breeder cannot edit another breeder’s cats.

3. Message
   For chat between breeders:
   - sender (ForeignKey to User)
   - recipient (ForeignKey to User)
   - text (TextField)
   - timestamp (DateTimeField, auto_now_add=True)
   - room_name (CharField, optional)
   - You may implement:
     - direct messages (1:1)
     - or a public chat for all breeders.

   Decide one approach:
   - either a shared chat for all breeders,
   - or a 1:1 chat with message history.

REST API (Django REST Framework):

Create a REST interface used only by the Angular client.

1. Authentication and authorization
   - Use JWT (for example, djangorestframework-simplejwt) or Django Session Authentication if needed.
   - Include:
     - /api/register/ — register a new user (breeder).
     - /api/login/ — log in and return a token.
     - /api/logout/ — logout if applicable.
   - All other API routes must be protected: @api_view + @permission_classes([IsAuthenticated]) or equivalent.

2. Cat CRUD endpoints
   - GET /api/cats/ — list cats belonging only to the current user.
   - GET /api/cats/<id>/ — retrieve a single cat.
   - POST /api/cats/ — create a new cat (owner = request.user).
   - PUT/PATCH /api/cats/<id>/ — update a cat; verify request.user == cat.owner.
   - DELETE /api/cats/<id>/ — delete a cat; again verify ownership.

   Important:
   - If a user tries to access or edit someone else’s cat, the API should return 403 Forbidden or 404 Not Found to avoid exposing that the cat exists.

3. User endpoints (optional but useful)
   - GET /api/user/me/ — current user.
   - GET /api/users/ — list all breeders, if needed for the chat UI.

4. Message endpoints
   - GET /api/messages/ — list messages filtered by sender/recipient or by room.
   - POST /api/messages/ — send a message (REST fallback if WebSocket is unavailable).
   - WebSockets may be used additionally so the chat is not dependent only on REST requests.

WebSocket (chat between breeders):

Implement a WebSocket chat between breeders:

- Option: Django Channels
  - Add channels to Django.
  - Create routing.py and consumers.py.
  - Implement a consumer that:
    - accepts a message from one breeder,
    - broadcasts it to the correct room/group (for example, all breeders or a specific user).
  - In Angular use WebSocketSubject from rxjs/webSocket to connect to ws://backend/ws/...

Specify:
- the WebSocket URL pattern (for example, ws://localhost:8000/ws/chat/).
- the JSON message format: { "sender": "user1", "recipient": "user2", "text": "..." }.

Frontend: Angular 8+

Create an Angular application with the following requirements:

1. Project structure
   - Use ng new cat-breeders (or any name you prefer).
   - Create modules:
     - AuthModule (registration, login)
     - CatsModule (cat CRUD)
     - MessagesModule (WebSocket chat)
     - CoreModule (services, shared)
     - AppModule (root)

2. Services
   - AuthService — works with /api/register/ and /api/login/
   - CatService — methods: getMyCats(), createCat(), updateCat(), deleteCat()
   - MessageService — REST variant (if available) and WebSocket connection
   - WebSocketService — wrapper around WebSocketSubject that:
     - connects to the server
     - subscribes to incoming messages
     - sends new messages

3. Components
   - RegisterComponent — breeder registration form.
   - LoginComponent — login form.
   - CatsListComponent — list of own cats (table or cards).
   - CatCreateComponent / CatEditComponent — create and edit cat forms.
   - ChatComponent — chat UI:
     - top: message list
     - bottom: message input and send button
   - Angular Material may be used (mat-table, mat-form-field, mat-button, mat-card).

4. Route protection
   - Use Angular routing + AuthGuard so that:
     - /cats and /messages are available only to authenticated users.
     - /register and /login are public.

5. UI structure
   - Home page: short description + “Log in” / “Register” buttons.
   - Personal area:
     - tab “My Cats”
     - tab “Messages”
   - Top bar with navigation and “Logout” button.

Permission rules for cats:

The main rule:

- Each breeder can see and edit only their own cats.
- The Django backend must guarantee this at the logic level:
  - when listing cats: Cat.objects.filter(owner=request.user)
  - when updating/deleting: verify instance.owner == request.user
- The Angular client may additionally hide buttons/access to other people’s cats, but the main permission logic must stay on the server.

Docker packaging:

Create a working Docker stack:

1. Dockerfile for Django
   - Use the official Python image.
   - Install dependencies (pip install -r requirements.txt).
   - Create migrations and collect static files if needed.
   - Expose port 8000.
   - Start command: gunicorn or python manage.py runserver 0.0.0.0:8000.

2. Dockerfile for Angular
   - Use Node.js.
   - Build the project: ng build --prod.
   - Serve static files via Nginx or directly via a Node server.
   - Expose port 4200 or 80.

3. docker-compose.yml
   Example structure:
   - db (PostgreSQL)
   - backend (Django)
   - frontend (Angular)
   - nginx (optional, as reverse proxy)
   - channels-redis (if using Django Channels)

   Make sure that:
   - the Angular client talks to http://backend:8000 inside the Docker network.
   - the external user opens http://host:80 or http://host:4200 and sees one complete application.

4. Environment variables
   - Move key settings into .env:
     - DJANGO_SECRET_KEY
     - DATABASE_URL
     - ALLOWED_HOSTS
     - FRONTEND_URL
   - Example: ALLOWED_HOSTS=127.0.0.1,localhost,backend.

Deployment on Ubuntu Server / Heroku:

Add instructions inside the project (as comments or in README):

1. Ubuntu Server
   - Install Docker.
   - Upload the repository to the server.
   - Run docker-compose up -d
   - Configure Nginx as a reverse proxy if needed.

2. Heroku / Render / Railway
   - Use Docker images or a plain Django app.
   - Set environment variables in the service settings.
   - If needed, host Angular static files:
     - either bundled into Django static/
     - or separately via Nginx in Docker.

Additional code requirements:

- The entire codebase must include:
  - types in TypeScript (Angular)
  - docstrings and comments in key places
  - a README.md in the root describing:
    - how to run the project locally
    - how to run it via Docker
    - which URLs to use
    - example API requests
- Do not use external paid services unless required; everything can be done with local Postgres and Docker.

What I want from you:

Analyze the assignment and create a step-by-step project:

1. Django and Angular folder structure.
2. Ready-made models, serializers, views, urls, and permissions in Django.
3. Ready-made Angular code: services, components, routing, WebSocket.
4. Working Dockerfile and docker-compose.yml.
5. A minimal README with instructions.
