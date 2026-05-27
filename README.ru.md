**🌐 Язык:** [English](README.en.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Suomi](README.fi.md) · Русский · [中文](README.zh.md)

---

# Cat Breeders Hub

Полнофункциональное веб-приложение для заводчиков кошек, позволяющее управлять питомцами и общаться в режиме реального времени.

## Стек технологий

- **Бэкенд**: Django 4.2 + Django REST Framework + Django Channels + PostgreSQL + Redis
- **Фронтенд**: Angular 15 (модульный) + Angular Material
- **Инфраструктура**: Docker + docker-compose

## Возможности

- JWT-аутентификация (регистрация, вход, обновление токена)
- Управление кошками (CRUD) с проверкой прав владельца
- Групповой чат в реальном времени через WebSockets (Django Channels + Redis)
- REST API для сообщений (история)
- Интерфейс на Angular Material

## Быстрый старт (Docker)

1. Скопируйте файл окружения:
   ```bash
   cp .env.example .env
   ```

2. При необходимости измените значения в `.env` (особенно `DJANGO_SECRET_KEY`)

3. Соберите и запустите все сервисы:
   ```bash
   docker-compose up --build
   ```

4. Откройте приложение:
   - Фронтенд: http://localhost
   - Backend API: http://localhost:8000/api/
   - Панель администратора Django: http://localhost:8000/admin/

## Локальная разработка

### Бэкенд

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Создайте локальный файл .env в папке backend/ с локальным значением DATABASE_URL
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Фронтенд

```bash
cd frontend
npm install
npm start
```

## Эндпоинты API

| Метод | Эндпоинт | Описание |
|-------|----------|----------|
| POST | `/api/register/` | Регистрация нового пользователя |
| POST | `/api/login/` | Вход (возвращает JWT-токены) |
| POST | `/api/token/refresh/` | Обновление токена доступа JWT |
| GET | `/api/user/me/` | Информация о текущем пользователе |
| GET | `/api/users/` | Список всех заводчиков |
| GET/POST | `/api/cats/` | Список своих кошек / Создать кошку |
| GET/PUT/PATCH/DELETE | `/api/cats/<id>/` | Детали кошки (только владелец) |
| GET/POST | `/api/messages/` | Сообщения общей комнаты |

## WebSocket

- URL: `ws://localhost:8000/ws/chat/<название_комнаты>/?token=<jwt_token>`
- Формат сообщения: `{"sender": "имя_пользователя", "text": "...", "timestamp": "..."}`

## Структура проекта

```
Cat001/
├── backend/          # Проект Django
│   ├── cat_breeders/ # Пакет проекта Django
│   ├── users/        # Приложение CustomUser
│   ├── cats/         # Модель Cat и API
│   └── chat/         # WebSocket-потребитель и API сообщений
├── frontend/         # Приложение Angular 15
│   └── src/app/
│       ├── core/     # Сервисы, guards, интерсепторы
│       ├── auth/     # Вход и регистрация
│       ├── cats/     # CRUD для кошек
│       └── messages/ # Чат в реальном времени
├── docker-compose.yml
└── .env
```
