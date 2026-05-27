**🌐 Kieli:** [English](README.md) · [Español](README.es.md) · [Deutsch](README.de.md) · Suomi · [Русский](README.ru.md) · [中文](README.zh.md)

---

# Cat Breeders Hub

Full-stack-verkkosovellus kissankasvattajille kissojen hallintaan ja reaaliaikaiseen viestintään chatin kautta.

## Teknologiat

- **Backend**: Django 4.2 + Django REST Framework + Django Channels + PostgreSQL + Redis
- **Frontend**: Angular 15 (moduulipohjainen) + Angular Material
- **Infrastruktuuri**: Docker + docker-compose

## Ominaisuudet

- JWT-todennus (rekisteröinti, kirjautuminen, tokenin päivitys)
- Kissojen hallinta (CRUD) omistajuuden tarkistuksella
- Reaaliaikainen ryhmäkeskustelu WebSocketien kautta (Django Channels + Redis)
- REST-rajapinta viesteille (historia)
- Angular Material -käyttöliittymä

## Pikaopas (Docker)

1. Kopioi ympäristötiedosto:
   ```bash
   cp .env.example .env
   ```

2. Muuta `.env`-arvoja tarvittaessa (erityisesti `DJANGO_SECRET_KEY`)

3. Rakenna ja käynnistä kaikki palvelut:
   ```bash
   docker-compose up --build
   ```

4. Käytä sovellusta:
   - Frontend: http://localhost
   - Backend-rajapinta: http://localhost:8000/api/
   - Django-hallintapaneeli: http://localhost:8000/admin/

## Paikallinen kehitys

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Luo paikallinen .env-tiedosto hakemistoon backend/ paikallisella DATABASE_URL-arvolla
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

## API-päätepisteet

| Metodi | Päätepiste | Kuvaus |
|--------|------------|--------|
| POST | `/api/register/` | Rekisteröi uusi käyttäjä |
| POST | `/api/login/` | Kirjaudu sisään (palauttaa JWT-tokenit) |
| POST | `/api/token/refresh/` | Päivitä JWT-käyttötoken |
| GET | `/api/user/me/` | Nykyisen käyttäjän tiedot |
| GET | `/api/users/` | Listaa kaikki kasvattajat |
| GET/POST | `/api/cats/` | Listaa omat kissat / Luo kissa |
| GET/PUT/PATCH/DELETE | `/api/cats/<id>/` | Kissan tiedot (vain omistaja) |
| GET/POST | `/api/messages/` | Yleisen huoneen viestit |

## WebSocket

- URL: `ws://localhost:8000/ws/chat/<huoneen_nimi>/?token=<jwt_token>`
- Viestimuoto: `{"sender": "käyttäjänimi", "text": "...", "timestamp": "..."}`

## Projektin rakenne

```
Cat001/
├── backend/          # Django-projekti
│   ├── cat_breeders/ # Django-projektipaketti
│   ├── users/        # CustomUser-sovellus
│   ├── cats/         # Kissa-malli ja rajapinta
│   └── chat/         # WebSocket-kuluttaja ja viestien rajapinta
├── frontend/         # Angular 15 -sovellus
│   └── src/app/
│       ├── core/     # Palvelut, guardит, interceptorit
│       ├── auth/     # Kirjautuminen ja rekisteröinti
│       ├── cats/     # Kissojen CRUD
│       └── messages/ # Reaaliaikainen chat
├── docker-compose.yml
└── .env
```
