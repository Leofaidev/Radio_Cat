# Cat Breeders Hub

Eine Full-Stack-Webanwendung für Katzenzüchter zur Verwaltung ihrer Katzen und zur Kommunikation über Echtzeit-Chat.

## Technologie-Stack

- **Backend**: Django 4.2 + Django REST Framework + Django Channels + PostgreSQL + Redis
- **Frontend**: Angular 15 (modulbasiert) + Angular Material
- **Infrastruktur**: Docker + docker-compose

## Funktionen

- JWT-Authentifizierung (Registrierung, Anmeldung, Token-Aktualisierung)
- Katzenverwaltung (CRUD) mit Eigentumsüberprüfung
- Echtzeit-Gruppenchat über WebSockets (Django Channels + Redis)
- REST-API für Nachrichten (Verlauf)
- Angular Material Benutzeroberfläche

## Schnellstart (Docker)

1. Umgebungsdatei kopieren:
   ```bash
   cp .env.example .env
   ```

2. `.env`-Werte bei Bedarf anpassen (insbesondere `DJANGO_SECRET_KEY`)

3. Alle Dienste bauen und starten:
   ```bash
   docker-compose up --build
   ```

4. Auf die Anwendung zugreifen:
   - Frontend: http://localhost
   - Backend-API: http://localhost:8000/api/
   - Django-Verwaltung: http://localhost:8000/admin/

## Lokale Entwicklung

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Lokale .env-Datei in backend/ mit lokaler DATABASE_URL erstellen
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

## API-Endpunkte

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| POST | `/api/register/` | Neuen Benutzer registrieren |
| POST | `/api/login/` | Anmelden (gibt JWT-Tokens zurück) |
| POST | `/api/token/refresh/` | JWT-Zugriffstoken erneuern |
| GET | `/api/user/me/` | Informationen zum aktuellen Benutzer |
| GET | `/api/users/` | Alle Züchter auflisten |
| GET/POST | `/api/cats/` | Eigene Katzen auflisten / Katze erstellen |
| GET/PUT/PATCH/DELETE | `/api/cats/<id>/` | Katzendetails (nur Eigentümer) |
| GET/POST | `/api/messages/` | Nachrichten im allgemeinen Raum |

## WebSocket

- URL: `ws://localhost:8000/ws/chat/<raumname>/?token=<jwt_token>`
- Nachrichtenformat: `{"sender": "benutzername", "text": "...", "timestamp": "..."}`

## Projektstruktur

```
Cat001/
├── backend/          # Django-Projekt
│   ├── cat_breeders/ # Django-Projektpaket
│   ├── users/        # CustomUser-App
│   ├── cats/         # Katzenmodell & API
│   └── chat/         # WebSocket-Consumer & Nachrichten-API
├── frontend/         # Angular-15-App
│   └── src/app/
│       ├── core/     # Dienste, Guards, Interceptoren
│       ├── auth/     # Anmeldung & Registrierung
│       ├── cats/     # Katzen-CRUD
│       └── messages/ # Echtzeit-Chat
├── docker-compose.yml
└── .env
```
