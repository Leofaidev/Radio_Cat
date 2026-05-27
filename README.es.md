**🌐 Idioma:** [English](README.md) · Español · [Deutsch](README.de.md) · [Suomi](README.fi.md) · [Русский](README.ru.md) · [中文](README.zh.md)

---

# Cat Breeders Hub

Una aplicación web full-stack para criadores de gatos que permite gestionar sus gatos y comunicarse mediante chat en tiempo real.

## Tecnologías

- **Backend**: Django 4.2 + Django REST Framework + Django Channels + PostgreSQL + Redis
- **Frontend**: Angular 15 (basado en módulos) + Angular Material
- **Infraestructura**: Docker + docker-compose

## Funcionalidades

- Autenticación JWT (registro, inicio de sesión, renovación de token)
- Gestión de gatos (CRUD) con control de propiedad
- Chat grupal en tiempo real mediante WebSockets (Django Channels + Redis)
- API REST para mensajes (historial)
- Interfaz con Angular Material

## Inicio rápido (Docker)

1. Copia el archivo de entorno:
   ```bash
   cp .env.example .env
   ```

2. Ajusta los valores de `.env` si es necesario (especialmente `DJANGO_SECRET_KEY`)

3. Construye e inicia todos los servicios:
   ```bash
   docker-compose up --build
   ```

4. Accede a la aplicación:
   - Frontend: http://localhost
   - API Backend: http://localhost:8000/api/
   - Panel de administración Django: http://localhost:8000/admin/

## Desarrollo local

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Crea un archivo .env local en backend/ con la variable DATABASE_URL local
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

## Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/register/` | Registrar nuevo usuario |
| POST | `/api/login/` | Iniciar sesión (devuelve tokens JWT) |
| POST | `/api/token/refresh/` | Renovar token de acceso JWT |
| GET | `/api/user/me/` | Información del usuario actual |
| GET | `/api/users/` | Listar todos los criadores |
| GET/POST | `/api/cats/` | Listar gatos propios / Crear gato |
| GET/PUT/PATCH/DELETE | `/api/cats/<id>/` | Detalle del gato (solo propietario) |
| GET/POST | `/api/messages/` | Mensajes de la sala general |

## WebSocket

- URL: `ws://localhost:8000/ws/chat/<nombre_sala>/?token=<jwt_token>`
- Formato de mensaje: `{"sender": "usuario", "text": "...", "timestamp": "..."}`

## Estructura del proyecto

```
Cat001/
├── backend/          # Proyecto Django
│   ├── cat_breeders/ # Paquete del proyecto Django
│   ├── users/        # App CustomUser
│   ├── cats/         # Modelo Cat y API
│   └── chat/         # Consumidor WebSocket y API de mensajes
├── frontend/         # App Angular 15
│   └── src/app/
│       ├── core/     # Servicios, guardias, interceptores
│       ├── auth/     # Login y Registro
│       ├── cats/     # CRUD de gatos
│       └── messages/ # Chat en tiempo real
├── docker-compose.yml
└── .env
```
